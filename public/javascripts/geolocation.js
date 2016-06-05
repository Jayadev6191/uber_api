(function(){
  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
          var coordinates={
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
          };
          console.log(coordinates);

          var geocoder = new google.maps.Geocoder();
          var latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);

          // try to get house address or destination address from lat lng

          
        })
      }
})()


// (function random(){
//   alert("This is ramdom function");
// })()
