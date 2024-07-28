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

        // Define the request for nearby places (e.g., cafes)
        const request = {
          location: userLocation,
          rankBy: google.maps.places.RankBy.DISTANCE,
          type: ["cafe"]
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

            // Update the popup HTML with the list of coffee shops
            updateCoffeeShopsList(places);
          } else {
            console.error("Places request failed due to:", status);
          }
        });
      },
      function () {
        console.error("Geolocation service failed.");
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function updateCoffeeShopsList(places) {
  const container = document.getElementById('coffee-shops');
  container.innerHTML = ''; // Clear any existing items
  places.forEach(shop => {
    //creating an anchor tag with the name
    const link = document.createElement('a');
    link.href = shop.hyperlink;
    link.target = '_blank';
    link.classList.add('.coffee-name')
    link.textContent = `${shop.name}`;

    //creating a p tag with miles
    const dist = document.createElement('p');
    dist.textContent = `${shop.distance} mi`;
    dist.classList.add('coffee-dist');

    container.appendChild(link);
    container.appendChild(dist);
  });
}

// Load the map after the window has loaded
// window.onload = function() { findCoffeeShops };
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("find-coffee").addEventListener("click", test);
});

function test() {
  const link = document.createElement('a');
  link.target = '_blank';
  link.classList.add('.coffee-name')
  link.textContent = hi;
  document.getElementById('coffee-shops').appendChild(link)
}
/*
document.getElementById('find-coffee').addEventListener('click', function() {
  if (navigator.geolocation) {
    findCoffeeShops
  } else {
    document.getElementById('locationInfo').innerText = "Geolocation is not supported by this browser.";
  }
});


function showPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  document.getElementById('locationInfo').innerHTML = `Latitude: ${lat} <br> Longitude: ${lng}`;
}*/