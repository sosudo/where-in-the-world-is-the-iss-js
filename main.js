// This runs the functions and correctly sets the output depending on color mode
window.onload = () => {
    let name = window.prompt("What's your name?");
    // Asks for the color mode
	document.getElementById('user').innerHTML = name;
	alert(`Hi, ${name}!`);
	let colorMode = window.prompt("Dark (0) or Light (1) mode (input 0 or 1)?");
	let backgroundColor;
	let textColor;
	if (colorMode == 0) {
			textColor = "white";
			backgroundColor = "black";
	} else if (colorMode == 1) {
			textColor = "black";
			backgroundColor = "white";
	} else {
			textColor = "white";
			backgroundColor = "black";
	}
	// document.getElementsByClassName and TagName return arrays, so we loop over the classes and tags and individually add them for each item in the array
	let bg = document.getElementsByClassName("bottom");
	for (let i = 0; i < bg.length; i++) {
			bg[i].style.backgroundColor = backgroundColor;
	}
	let txt = document.getElementsByTagName("body");
	for (let i = 0; i < txt.length; i++) {
			txt[i].style.color = textColor;
			txt[i].style.backgroundColor = backgroundColor;
	}
	// Renders the map
	mapGen();
};
// This function determines the latitude and longitude of the ISS, creates the map, and places a marker there that corresponds to the ISS's location
function mapGen() {
    // When cold starting, this is used to prevent undefined variables
    loading();
    let count = 1;
    let lat;
    let long;
    let marker;
    // Sets the icon to the satellite
    let Icon = new L.Icon({
        iconUrl: "https://openprocessing-usercontent.s3.amazonaws.com/files/user265091/visual1169156/hdcf1b93ac81af0c34716204ff0209418/transparent-broadcast-icon-communication-icon-satellite-icon-5f350cead41db6.1764351515973122348688.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -34],
        shadowSize: [41, 25],
    });
    // This creates an empty map centered at the latitude and longitude coordinate (0, 0). It has an initial zoom of 5
    let map = L.map("map").setView([0, 0], 2);
    // This adds a layer to the map with all of the geographic data. It also adds a custom style I created using mapbox to give it a more space-y feel
    L.tileLayer("https://api.mapbox.com/styles/v1/swcbn/ckoa3mmdb27re17mv0qop3d3i/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3djYm4iLCJhIjoiY2tvYTJwZnF5MDVpMTJ2bjI1aml2cGFoMiJ9.7-tT1DsVzDI74Myh8Q95MQ", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 30,
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(map);
    // This anonymous function allows us to map the ISS's location using the wheretheissat API
    // The SetInterval function is used to continuously update the marker position every second
    setInterval(function () {
        fetch("https://api.wheretheiss.at/v1/satellites/25544")
            .then((response) => response.json())
            .then((data) => {
                lat = data.latitude;
                long = data.longitude;
                // A try block is used to remove markers programatically except for when there is no marker due to a cold start(there is no marker upon initialization for approximately 1 second)
                try {
                    // This removes the marker before it adds a new one
                    map.removeLayer(marker);
                } catch (err) {}
                // This creates the marker
                marker = L.marker([lat, long], { icon: Icon });
                // This adds the marker to the map in a way that it can be removed later
                map.addLayer(marker);
                count = Math.random() * 9 + 2;
                // Adds the data to the page
                document.getElementById("name").innerHTML = `Satellite Name: ${data.name}`;
                document.getElementById("id").innerHTML = `Satellite ID: ${data.id}`;
                document.getElementById("lat").innerHTML = `Latitude: ${lat} deg`;
                document.getElementById("long").innerHTML = `Longitude: ${long} deg`;
                document.getElementById("alt").innerHTML = `Altitude: ${data.altitude} km`;
                document.getElementById("vel").innerHTML = `Velocity: ${data.velocity} km/hr`;
                document.getElementById("vis").innerHTML = `Visibility: ${data.visibility}`;
                document.getElementById("daynum").innerHTML = `Day Number: ${data.daynum}`;
                document.getElementById("sollat").innerHTML = `Solar Latitude: ${data.solar_lat} deg`;
                document.getElementById("sollong").innerHTML = `Solar Longitude: ${data.solar_lon} deg`;
                document.getElementById("interval").innerHTML = `Lag Interval: ${count} sec`;
            })
            // If there's an error, this shows 'Loading' instead of undefined variables
            .catch((e) => loading());
    }, count * 1000);
}
// This is used to prevent undefined variables
function loading() {
    // Sets all positional DOM elements to Loading
    document.getElementById("name").innerHTML = `Satellite Name: Loading`;
    document.getElementById("id").innerHTML = `Satellite ID: Loading`;
    document.getElementById("lat").innerHTML = `Latitude: Loading`;
    document.getElementById("long").innerHTML = `Longitude: Loading`;
    document.getElementById("alt").innerHTML = `Altitude: Loading`;
    document.getElementById("vel").innerHTML = `Velocity: Loading`;
    document.getElementById("vis").innerHTML = `Visibility: Loading`;
    document.getElementById("daynum").innerHTML = `Day Number: Loading`;
    document.getElementById("sollat").innerHTML = `Solar Latitude: Loading`;
    document.getElementById("sollong").innerHTML = `Solar Longitude: Loading`;
    document.getElementById("interval").innerHTML = `Lag Interval: Loading`;
}
