function findCoffeeShops() {
  // Check if Geolocation is supported
  if (navigator.geolocation) {
    // Use geolocation to find the current position (latitude & longitude)
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userLocation = new google.maps.LatLng(lat, lng);

        // Create the map centered on the user's location
        const map = new google.maps.Map(document.createElement('div'), {
          center: { lat: lat, lng: lng },
          zoom: 15
        });

        // Define the request for nearby places (e.g., restaurants, cafes)
        const request = {
          location: { lat: lat, lng: lng },
          rankBy: google.maps.places.RankBy.DISTANCE, // Rank results by distance
          type: ["cafe"], // You can change this to 'cafe', 'bar', etc.
          
        };

        // Create a PlacesService instance
        const service = new google.maps.places.PlacesService(map);

        // Perform the nearby search
        service.nearbySearch(request, function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Process and log results
            const places = results.map((place) => {
              // Calculate distance
              const placeLocation = place.geometry.location;
              const distance =
                google.maps.geometry.spherical.computeDistanceBetween(
                  userLocation,
                  placeLocation
                ) / 1609.34;

              return {
                name: place.name,
                distance: Math.round(distance * 10) / 10, // Distance in miles
                hyperlink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`

              };
            });

            // Log the extracted place objects
            console.log("Processed Places:", places);

            // Return the places array
            return places;
          } else {
            console.error("Places request failed due to:", status);
            return [];
          }
        });
      },
      function () {
        console.error("Geolocation service failed.");
        return [];
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    return [];
  }
}

// Load the map after the window has loaded
window.onload = findCoffeeShops;
