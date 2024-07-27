function initMap() {
    // Check if Geolocation is supported
    if (navigator.geolocation) {
      // Use geolocation to find the current position (latitude & longitude)
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userLocation = new google.maps.LatLng(lat, lng);
  
        // Create the map centered on the user's location
        const map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: lat, lng: lng },
          zoom: 15
        });
  
        // Place a marker for the user's current location
        new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: 'You are here'
        });
  
        // Define the request for nearby places (e.g., restaurants, cafes)
        const request = {
          location: { lat: lat, lng: lng },
          radius: '3219', // Search within a 2-mile radius
          type: ['cafe'] // You can change this to 'cafe', 'bar', etc.
        };
  
        // Create a PlacesService instance
        const service = new google.maps.places.PlacesService(map);
  
        // Perform the nearby search
        service.nearbySearch(request, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Process and log results
            const places = results.map(place => {
              // Calculate distance
              const placeLocation = place.geometry.location;
              const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, placeLocation);
  
              return {
                name: place.name,
                distance: Math.round(distance), // Distance in meters
              };
            });
  
            // Log the extracted place objects
            console.log('Processed Places:', places);
  
            // Create markers for each place
            results.forEach(place => {
              createMarker(place);
            });
          } else {
            console.error('Places request failed due to:', status);
          }
        });
        
        // Function to create a marker for a place
        function createMarker(place) {
          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
          });
  
          // Add an info window when the marker is clicked
          google.maps.event.addListener(marker, 'click', function() {
            const infowindow = new google.maps.InfoWindow({
              content: place.name
            });
            infowindow.open(map, this);
          });
        }
      }, function() {
        console.error('Geolocation service failed.');
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  
  // Load the map after the window has loaded
  window.onload = initMap;
  