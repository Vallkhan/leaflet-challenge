let response = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Fetch earthquake data and process it
d3.json(response).then(function (data) {
    createFeatures(data.features); // Call function to create features
});

// Function to create features (circles representing earthquakes)
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        // Bind popup with earthquake details
        layer.bindPopup(`<h3>${feature.properties.place}</h3><p>${new Date(feature.properties.time)}</p>`);
    }

    // Function to determine radius of the circle based on earthquake magnitude
    function getRadius(magnitude) {
        return magnitude*8; // Adjust this multiplier as needed for better visualization
    }

    // Function to determine color of the circle based on earthquake magnitude
      function depth(depth) {
        // Colors based on magnitude range 
        return depth > 10 ? '#F54C17' :
               depth > 8 ?  '#FAA58A' :
               depth > 6 ?  '#F7AE81' :
               depth > 4 ?  '#BEECBA' :
                            '#76E763' ;
    }
    

    // Create a GeoJSON layer with circles for each earthquake
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: depth(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            });
        },
        onEachFeature: onEachFeature
    });

    // Call function to create map with the earthquakes layer
    createMap(earthquakes);
}

// Function to create map with base and overlay layers
function createMap(earthquakesLayer) {
    // Define base map layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Define base maps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Define overlay maps object
    let overlayMaps = {
        "Earthquakes": earthquakesLayer
    };

    // Create map centered on US
    let map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakesLayer] // Initial layers on load
    });

    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(map);
}

legend.addTo(map);


////////////////////////////////////////////////////////////////////////////////////////////////////