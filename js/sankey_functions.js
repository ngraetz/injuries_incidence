// Define functions

// Draw axis labels
drawAxisLabels = function() {
	// title
	title = d3.select('svg').append('text').text('Injury Incidence').attr("x", (width+margin.left+margin.right)/2).attr("y", margin.top/2).attr("font-size", 75).attr("text-anchor", "middle")
	
	ecodetitle = d3.select('svg').append('text').text('E-Codes').attr("x", margin.left).attr("y", margin.top-40).attr("text-anchor", "start").attr("font-size", 40)
	ecodetitle = d3.select('svg').append('text').text('(The "event" resulting in injury)').attr("x", margin.left).attr("y", margin.top-15).attr("text-anchor", "start").attr("font-size", 15)
	
	ncodetitle = d3.select('svg').append('text').text('N-Codes').attr("x", width + margin.left).attr("y", margin.top-40).attr("text-anchor", "end").attr("font-size", 40)
	ncode_explanation = d3.select('svg').append('text').text('(The "nature" of the injury)').attr("x", width + margin.left).attr("y", margin.top-15).attr("text-anchor", "end").attr("font-size", 15)
}

 // FUNCTION TO HIGHLIGHT ALL LINKS CONNECTED TO A NODE
 /*
   function highlight_link(id,opacity){
      d3.select("#link-"+id).style("stroke-opacity", opacity);
  }
  
  function highlight_node_links(node,i){

    var remainingNodes=[],
        nextNodes=[];

    var stroke_opacity = 0.03;
    if( d3.select(this).attr("data-clicked") == "1" ){
      d3.select(this).attr("data-clicked","0");
      stroke_opacity = 0.03;
    }else{
      d3.select(this).attr("data-clicked","1");
      stroke_opacity = 0.5;
    }
	console.log("test", i, node)
    var traverse = [{
                      linkType : "sourceLinks",
                      nodeType : "target"
                    },{
                      linkType : "targetLinks",
                      nodeType : "source"
                    }];

    traverse.forEach(function(step){
      node[step.linkType].forEach(function(link) {
        remainingNodes.push(link[step.nodeType]);
        highlight_link(link.id, stroke_opacity);
      });

      while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function(node) {
          node[step.linkType].forEach(function(link) {
            nextNodes.push(link[step.nodeType]);
            highlight_link(link.id, stroke_opacity);
          });
        });
        remainingNodes = nextNodes;
      }
    });
  }

  
// the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform", 
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }  
  */
  
linkFunc = function(link) {
      link.attr("class", "link")
	  .attr("id", function(d,i){
        d.id = i;
        return "link-"+i;
		})
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; })
}

nodeRectFunc = function(node) {
  node
    .attr("class", "node")
    .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", function() { 
		  this.parentNode.appendChild(this); })
    .attr("height", function(d) { return d.dy; })
    .attr("width", sankey.nodeWidth())
    .style("fill", function(d) { 
		  return d.color = color(d.name.replace(/ .*/, "")); })
    .style("stroke", function(d) { 
		  return d3.rgb(d.color).darker(2); })
    .append("title")
    .text(function(d) { 
		  return d.name + "\n" + format(d.value); })
};
// .on("drag", dragmove))
  // .on("click", highlight_node_links)