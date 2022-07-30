// Assign dimensions for map container
var width = 500,
	height = 500;

// Field reference to csv column
var field = "Valid Votes"

//Number formatting

var valueFormat = d3.format(",");

// Get and prepare the Mustache template
var template = d3.select('#template').html();
Mustache.parse(template);

//  hover on event 
var hoveron = function(d) {
	console.log('d', d, 'event', event);
	var div = document.getElementById('tooltip');
	div.style.left = event.pageX + 'px';
	div.style.top = event.pageY + 'px';

	
	//Fill yellow to highlight
	d3.select(this)
		.style("fill", "yellow");

	//Show the tooltip
	d3.select("#tooltip")
		.style("opacity", 1);

	
	d3.select("#tooltip .name")
		.text(d.properties.dist);


	d3.select("#tooltip .value")
		.text(valueFormat(d.properties.field) + "");	
}

var hoverout = function(d) {

	//Restore original color fill
	d3.select(this)
		.style("fill", function(d) {
			var value = d.properties.field;
			if (value) {
				return color(value);
			} else {
				return "#ccc";
			}
		});

	//Hide the tooltip
	d3.select("#tooltip")
		.style("opacity", 0);

}


// Create SVG inside map container and assign dimensions
var svg = d3.select("#map").append('svg')
	.attr("width", width)
	.attr("height", height);

// Define a geographical projection
// Also, set initial zoom to show the features
var projection	= d3.geo.mercator()
	.scale(1);

// Prepare a path object and apply the projection to it 
var path = d3.geo.path()
	.projection(projection);


var dataById = d3.map();



var color = d3.scale.quantize()
				.range([    "#B0E0E6",
				            "#87CEFA",
				            "#00BFFF",
							"#1E90FF",
							"#4169E1",
							"#0000FF",
							"#0000CD",
							"#00008B",
							"#000080",
							
							 ]);

// Load in  data
d3.csv("disdata.csv", function(cdata) {
	
	color.domain([
		d3.min(cdata, function(d) { return +d[field]; }),
		d3.max(cdata, function(d) { return +d[field]; })

		]);
		
	var data = cdata.map(
		function(row){
			var district_id = row.District.slice(0,3)
			var district_name = row.District.slice(4)

			row.id =  district_id;
			row.District =  district_name;
			
			return row;
		}
	);
	console.log(data);
    dataById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(data);
	

	// Load features from GeoJSON                                                     
	d3.json('ug_districts3.geojson', function(error, json) {

		
	
		var scaleCenter = calculateScaleCenter(json);

		// Apply scale, center and translate parameters.
		projection.scale(scaleCenter.scale)
				.center(scaleCenter.center)
				.translate([width/2, height/2]);

		

		for (var i=0; i < data.length ; i++ ) {

			
			var dataDistrict = data[i].District;
			var dataValue = +data[i][field];
			

			//Find the corresponding district inside GeoJSON
			for (var j=0; j < json.features.length ; j++ ) {
				var jsonDistrict = json.features[j].properties.dist;

				if (dataDistrict == jsonDistrict) {

					//Copy the data value into the GeoJSON
					json.features[j].properties.field = dataValue;
					json.features[j].properties.distId =data[i]["id"];
					break;
				}
			}
		}
		
		// Add a <g> element to the SVG element and give a class to style later
		svg.append('g')
			.attr('class', 'features')			
		// Bind data and create one path per GeoJSON feature
		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.on("mouseover", hoveron)
			.on("mouseout", hoverout)
			.on('click', showDetails)
			.style("cursor", "pointer")
			.style("stroke", "#777")
			.style("fill", function(d) {

				
				
				var value = d.properties.field;
			

				if (value) {
					
					return color(value);
				} else {
				
					return "#ccc";
				}
			});

	}); 
}); 



function calculateScaleCenter(features) {
	// Get the bounding box of the paths (in pixels) 
	var bbox_path = path.bounds(features),
		scale = 0.95 / Math.max(
			(bbox_path[1][0] - bbox_path[0][0]) / width,
			(bbox_path[1][1] - bbox_path[0][1]) / height
			);

	// Get the bounding box of the features (in map units) 
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
}