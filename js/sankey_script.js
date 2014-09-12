var units = "Cases";

var margin = {top: 200, right: 350, bottom: 10, left: 350},
    width = 1500 - margin.left - margin.right,
    height = 2200 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(60)
    .nodePadding(0)
    .size([width, height]);

var path = sankey.link();

drawAxisLabels()
  
// load the data (using the timelyportfolio csv method)
draw = function(url) {
d3.csv(url, function(error, data) {

  //set up graph in same style as original example but empty
  graph = {"nodes" : [], "links" : []};

    data.forEach(function (d) {
      graph.nodes.push({ "name": d.source });
      graph.nodes.push({ "name": d.target });
      graph.links.push({ "source": d.source,
                         "target": d.target,
                         "value": +d.value });
     });

     // return only the distinct / unique nodes
     graph.nodes = d3.keys(d3.nest()
       .key(function (d) { return d.name; })
       .map(graph.nodes));

     // loop through each link replacing the text with its index from node
     graph.links.forEach(function (d, i) {
       graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
       graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
     });

     //now loop through each nodes to make nodes an array of objects
     // rather than an array of strings
     graph.nodes.forEach(function (d, i) {
       graph.nodes[i] = { "name": d };
     });

  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links, function(d) {return d.id})
	  
	link.enter().append("path").call(linkFunc)
	
	link.exit().remove();
		
	svg.append("g").selectAll(".link").transition().duration(500).call(linkFunc);  
	  
// add the link titles
  link.append("title")
        .text(function(d) {
    		return d.source.name + " : " + 
                d.target.name + "\n" + format(d.value); });

// add in the nodes
  var nodeRects = svg.append("g").selectAll(".node")
      .data(graph.nodes, function(d) {return d.id})

	nodeRects.enter().append("rect").call(nodeRectFunc)

	nodeRects.exit().remove();
		
	svg.append("g").selectAll(".node").transition().duration(500).call(nodeRectFunc);	  
		  
// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x > width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");
	
});
};