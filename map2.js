// dimensions for map container
var width = 500,
	height = 500;


var field = "Percentage"

var valueFormat = d3.format(",");


var template = d3.select('#template').html();
Mustache.parse(template);

var hoveron = function(d) {
	console.log('d', d, 'event', window.event);
	var div = document.getElementById('tooltip');
	div.style.left = window.event.pageX + 'px';
	div.style.top = window.event.pageY + 'px';

	
	
	d3.select(this)
		.style("fill", "blue");


	d3.select("#tooltip")
		.style("opacity", 1);

	
	d3.select("#tooltip .name")
		.text(d.properties.dist);

	
	d3.select("#tooltip .value")
		.text(valueFormat(d.properties.field) + "%");	
}

var hoverout = function(d) {

	
	d3.select(this)
		.style("fill", function(d) {
			var value = d.properties.color;
			if (value) {
				return value;
			} else {
				return "#ccc";
			}
		});

	
	d3.select("#tooltip")
		.style("opacity", 0);

}


// Create SVG inside map container and assign dimensions
var svg = d3.select("#map").append('svg')
	.attr("width", width)
	.attr("height", height);


var projection	= d3.geo.mercator()
	.scale(1);


var path = d3.geo.path()
	.projection(projection);


var dataById = d3.map();


// Load in  data
d3.csv("Map2.csv", function(cdata) {
	console.log(cdata)
						
	
		
	var data = cdata.map(
		function(row){
			var district_id = row.District.slice(0,3)
			var district_name = row.District.slice(4)

			row.id =  district_id;
			row.District =  district_name;
			row.color = row.color
			return row;
		}
	);
	console.log(data);
	
    dataById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(data);
	  

	                                                     
	d3.json('ug_districts3.geojson', function(error, json) {

		var scaleCenter = calculateScaleCenter(json);
		projection.scale(scaleCenter.scale)
				.center(scaleCenter.center)
				.translate([width/2, height/2]);

	

		for (var i=0; i < data.length ; i++ ) {

			
			var dataDistrict = data[i].District;
			var dataValue = +data[i][field];
			
			for (var j=0; j < json.features.length ; j++ ) {

				var jsonDistrict = json.features[j].properties.dist;

				if (dataDistrict == jsonDistrict) {

					
					json.features[j].properties.field = dataValue;
					json.features[j].properties.distId =data[i]["id"];
					json.features[j].properties.color =data[i]["color"]

					break;
				}
			}
		}
		
		
		svg.append('g')
			.attr('class', 'features')			
		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.on("mouseover", showDetails)
			.style("cursor", "pointer")
			.style("stroke", "#777")
			.style("fill", function(d) {

				// Get data value
				
				var value = d.properties.color;
				console.log(d.properties) 

					return value;
				
			});

	}); 
}); 


function calculateScaleCenter(features) {
	
	var bbox_path = path.bounds(features),
		scale = 0.95 / Math.max(
			(bbox_path[1][0] - bbox_path[0][0]) / width,
			(bbox_path[1][1] - bbox_path[0][1]) / height
			);

	
	var bbox_feature = d3.geo.bounds(features),
		center = [
			(bbox_feature[1][0] + bbox_feature[0][0]) / 2,
			(bbox_feature[1][1] + bbox_feature[0][1]) / 2];

	return {
		'scale':scale,
		'center':center
	};
}


function showDetails(f) {
	var id = getIdOfFeature(f); 
	var d = dataById[id]; 

	console.log(d) 
	var detailsHtml = Mustache.render(template, d); 
	d3.select('#initial').classed('hidden', true);
	d3.select('#details').html(detailsHtml);
	d3.select('#details').classed('hidden', false);
}

function getIdOfFeature(f) {
  return f.properties.distId
}f
