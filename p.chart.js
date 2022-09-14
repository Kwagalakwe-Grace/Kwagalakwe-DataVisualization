var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var field = "Count"

var color = d3.scale.ordinal()
    .range([ "#000080","#00BFFF","#87CEFA","#B0E0E6",, "1E90FF"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Count; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
// hoveron   
var hoveron = function(d) {
      var div = document.getElementById('tooltip');
      div.style.left = event.pageX + 'px';
      div.style.top = event.pageY + 'px';
      d3.select(this)
        .style("fill", "grey");

      d3.select("#tooltip")
        .style("opacity", 1)
        .style("width", "100px");

     
      d3.select("#tooltip .name")
        .text(d.data.Percentage +"%");

      d3.select("#tooltip .value")
        .text(d.data.Cluster ); 
}

var hoverout = function(d) {

  
  d3.select(this)
    .style("fill", function(d) { return color(d.data.Cluster); });


  d3.select("#tooltip")
    .style("opacity", 0);    
}

d3.csv("Pie_chart.csv", type, function(error, data) {
  if (error) throw error;
  
 

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.Cluster); })
	.on("mouseover", hoveron)
	  
	.on("mouseleave", hoverout );

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".56em")
      .text(function(d) { return ""+  "" });
});

function type(d) {
  d.Count = +d.Count;
  return d;
}

