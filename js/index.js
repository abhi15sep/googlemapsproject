var map;
var markers = [];
var infoWindow;
var locationSelect;


function initMap() {
    var sydney = {
        lat: -33.063276, 
        lng: 151.107977
      };

    var losAngeles = {
        lat: 34.0194,
        lng: -118.411,
    }

    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles,
      zoom: 11,
      styles: mapsStyle,
      mapTypeId: 'roadmap',
      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    });          

    infoWindow = new google.maps.InfoWindow();

    //showStoresMarkers();
  }

function storeOpen(i){
  google.maps.event.trigger(markers[i], 'click')
}

function displayStores(stores){
  var storesHtml = ''

  for(var i in stores){
    var address = stores[i].addressLines
    var phone = stores[i].phoneNumber
    
    storesHtml += /*html*/`
                    <div class="store-item" onclick="storeOpen(${i})">
                        <div class="store-container">
                            <div class="store-address">
                                <span>
                                    ${address[0]}
                                </span>
                                <span>${address[1]}</span>
                            </div>
                            <div class="store-phone-number">
                                ${phone}
                            </div>
                        </div>
                        <div class="number-container">
                            <div class="store-number">                      
                                ${parseInt(i)+1}
                            </div>
                        </div>  
                    </div>
    `



    document.querySelector(".stores-list").innerHTML = storesHtml
  }
}

function showStoresMarkers(stores){
  var bounds = new google.maps.LatLngBounds();
  for(var [index, store] of stores.entries()){
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    var name = store.name
    var address = store.addressLines
    var phone = store.phoneNumber
    var lat = store.coordinates.latitude
    var lng = store.coordinates.longitude

    bounds.extend(latlng)
    createMarker(latlng, name, address, phone, lat, lng, parseInt(index)+1)
  }
  map.fitBounds(bounds)
}

function createMarker(latlng, name, address, phone, lat, lng, index) {
  var link = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  var html = /*html*/ `
    <div class="header">
      <b>${address[0]}</b><br/>
      <span class="open">Open until 6:00 AM</span>
    </div>
    <div class="content">
        <div onclick="window.location.href = '${link}'">
          <i class="fas fa-location-arrow" aria-hidden="true"></i>
          ${address[1]}
        </div>
        <br/>
        <i class="fas fa-phone-alt" aria-hidden="true"></i>
        ${phone}
    </div>
  `

  var icon = 'style/marker.png'

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: {
      text: `${index}`,
      color: "#fff",
      fontWeight: "bold"
    },
    icon: {
      url: "style/marker.png",
      labelOrigin:  new google.maps.Point(25,0)
    }
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

window.onload = () => {

}

function searchStores(){
  var foundStores = []  
  var zipCode = document.getElementById('zip-code-input').value
  if(zipCode){
    for(let store of stores){
      var postal = store.address.postalCode.substring(0,5)
      if(postal == zipCode){
        foundStores.push(store)
      }
    }
  }else{
    foundStores = stores
  }

  clearLocations()
  displayStores(foundStores)
  showStoresMarkers(foundStores)
}

function clearLocations(){
  infoWindow.close()  
  markers.map(x => x == null)
  markers.length == 0
}