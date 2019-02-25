function map_access(){
    mapboxgl.accessToken = 'pk.eyJ1IjoicmVpZnJlZCIsImEiOiJjanNrMjZib3YweGRwNGFwb3l0djB3ZGIxIn0.86xCF45tLcyCfFj6nMnovA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.50, 40], // starting position
        zoom: 9 // starting zoom	
    });
    map.addControl(new mapboxgl.NavigationControl());
    // Add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
    
    map.on('click', function (e) {
        lat = JSON.stringify(e.lngLat["lat"])
        long = JSON.stringify(e.lngLat["lng"])
        document.getElementById('location').innerHTML = `Lat: ${lat} Long: ${long}`;
    });
}

map_access()
