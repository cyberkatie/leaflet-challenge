// Store our API endpoint as url
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.

    // remember arr.map takes in an array of length n
    // transforms the values according to some function fn 
    // outputs an array of length n

    //create the bins
    var colors = {
        color1 : "red",
        color2 : "orange",
        color3 : "yellow",
        color4 : "green",
        color5 : "blue"
    };

    for (var i = 0; i < earthquakeData.length; i++) {
        var earthquakes = L.geoJSON(earthquakeData, {
            pointToLayer: function (feature, latlng) {
                return new L.CircleMarker(latlng)
            },
            style:()=>{
                //programatically set color here
                var markerColor = "";
                if (earthquakeData[i].geometry.coordinates[2] < -10){
                    markerColor = "red";
                } else if (earthquakeData[i].geometry.coordinates[2] < 30){
                    markerColor = "orange";
                } else if (earthquakeData[i].geometry.coordinates[2] < 50){
                    markerColor = "yellow";
                } else if (earthquakeData[i].geometry.coordinates[2] < 70){
                    markerColor = "green";
                } else if (earthquakeData[i].geometry.coordinates[2] < 90) {
                    markerColor = "blue";
                }
                return {
                    radius: earthquakeData[i].properties.mag ? earthquakeData[i].properties.mag*3 : 1,
                    color: markerColor,
                }
            },
             onEachFeature: onEachFeature
        })
    };

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    //Defines the legend
var legend = L.control({ position: "bottomright" });
//Sets HTML to render color legend for depth
legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");

  div.innerHTML += "<span style='float: left; width: 1em; height: 1em; background-color: #008000; margin: 2px;'></span><span>-10 - 30</br>"; 
  div.innerHTML += "<span style='float: left; width: 1em; height: 1em; background-color: #9ACD32; margin: 2px;'></span><span>10 - 30</span></br>";
  div.innerHTML += "<span style='float: left; width: 1em; height: 1em; background-color: #FFFF00; margin: 2px;'></span><span>30 - 50</span></br>";
  div.innerHTML += "<span style='float: left; width: 1em; height: 1em; background-color: #FFD580; margin: 2px;'></span><span>50 - 70</span><br>";
  div.innerHTML += "<span style='float: left; width: 1em; height: 1em; background-color: #FFA500; margin: 2px;'></span><span>70 - 90</span><br>";
  div.innerHTML += "<span style='float: left; width: 1em; height: 1em; background-color: #FF0000; margin: 2px;'></span><span>70 - 90</span><br>";
  return div;
};
legend.addTo(myMap);

//legend.addTo(myMap);
  //return div;
};
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
