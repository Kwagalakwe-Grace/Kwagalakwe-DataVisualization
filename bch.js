var svg = d3.select("#barchart")
			.append("svg")
      //.orient(left)
			.attr("height", 200)
      .attr("width", 1000);


// Logic to handle Tooltip on Hover of Bar
var hoveron = function(d) {
      console.log('d', d, 'event', event);
      var div = document.getElementById('tooltip');
      div.style.left = event.pageX + 'px';
      div.style.top = event.pageY + 'px';

      
      //Fill white to highlight
      d3.select(this)
        .style("fill", "white");

      //Show the tooltip
      d3.select("#tooltip")
        .style("opacity", 1);

      //Populate name in tooltip
      d3.select("#tooltip .name")
        .text(d.District);

      //Populate value in tooltip
      d3.select("#tooltip .value")
        .text(d.Percentage +"%"); 
}

var hoverout = function(d) {

  //Restore original color fill
  d3.select(this)
    .style("fill", "");

  //Hide the tooltip
  d3.select("#tooltip")
    .style("opacity", 0);

}

// Entering data

d3.csv("barchart.csv", function(data) {


	var rects = svg.selectAll("rect")
					.data(data)
					.enter()
					.append("rect");

	rects.attr("y", function(d) {
      return 200 - d.Percentage; 
    })
		.attr("x", function(d, i) {
			return i*6.8;
		})
		.attr("height", function(d) {
			return d.Percentage; 
		})
		.attr("width",8)
		.on("mouseover", hoveron)
		.on("mouseout", hoverout)
		.style("cursor", "pointer")
        .style("stroke", "#777")
        .style("fill", "");
});
