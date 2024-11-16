// index.js

window.onload = function() {
    initMap();
  }
  
  var map;
  var markers = [];
  
  function initMap() {
    var losAngeles = { lat: 12.9716, lng: 77.5946 }; // Bengaluru coordinates
  
    // Create Leaflet map
    map = L.map('map').setView([losAngeles.lat, losAngeles.lng], 11);
  
    // Add OSM tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    searchStores();
  }
  
  function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if (zipCode) {
        for (var store of stores) {
            var postal = store['address'].substring(store['address'].length - 6);
            if (postal === zipCode) {
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
  }
  
  function clearLocations() {
    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);  // Remove markers from map
    }
    markers = [];
  }
  
  function displayStores(foundStores) {
    var storesHtml = '';
    for (var [index, store] of foundStores.entries()) {
        storesHtml += `
            <div class="store-container">
                <div class="store-info-container">
                    <div class="store-image">
                        <img src="${store.image}" alt="${store.name}" />
                    </div>
                    <div class="store-info">
                        <div class="store-name">${store.name}</div>
                        <div class="store-address">
                            <span>${store.address}</span>
                        </div>
                        <div class="store-phone-number">${store.phone}</div>
                    </div>
                </div>
                <div class="store-number">${index + 1}</div>
            </div>
        `;
    }
    document.querySelector('.stores-list').innerHTML = storesHtml;
  }
  
  function showStoresMarkers(stores) {
    var bounds = L.latLngBounds();
    for (var [index, store] of stores.entries()) {
        var latlng = L.latLng(store.lat, store.lng);
        var name = store.name;
        var address = store.address;
        var phoneNumber = store.phone;
        var image = store.image; // Image for the store
        bounds.extend(latlng);
        createMarker(latlng, name, address, phoneNumber, image, index + 1);
    }
    map.fitBounds(bounds);
  }
  
  function createMarker(latlng, name, address, phoneNumber, image, index) {
    var popupContent = `
        <div class="store-info-window">
            <div class="store-info-name">${name}</div>
            <div class="store-info-address">${address}</div>
            <div class="store-info-phone">${phoneNumber}</div>
            <img src="${image}" alt="${name}" style="width: 100px; height: 100px;" />
        </div>
    `;
    
    var marker = L.marker(latlng)
        .bindPopup(popupContent)
        .addTo(map);
    
    markers.push(marker);
  }
  