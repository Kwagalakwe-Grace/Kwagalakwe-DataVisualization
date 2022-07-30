var svg = d3.select("#barchart")
			.append("svg")
			.attr("height", 200)
      .attr("width", 1000);



var hoveron = function(d) {
      console.log('d', d, 'event', event);
      var div = document.getElementById('tooltip');
      div.style.left = event.pageX + 'px';
      div.style.top = event.pageY + 'px';

      
     
      d3.select(this)
        .style("fill", "white");

      
      d3.select("#tooltip")
        .style("opacity", 1);


      d3.select("#tooltip .name")
        .text(d.District);
      d3.select("#tooltip .value")
        .text(d.Percentage +"%"); 
}

var hoverout = function(d) {


  d3.select(this)
    .style("fill", "");

 
  d3.select("#tooltip")
    .style("opacity", 0);

}

// Entering data

d3.csv("barchart.csv", function(data) {


	var rects = svg.selectAll("rect")
					.data(data)
					.enter()
					.append("rect");

	rects.attr("y",0)
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