$(document).ready(function(){
  var geocoder = new google.maps.Geocoder();
  var latLng;
  var autocomplete, mapOptions, map;

  var input = /** @type {!HTMLInputElement} */(
            document.getElementById('to_address'));

  function getCoordinates(address, fn){
    geocoder.geocode( { 'address': address}, function(results, status) {
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results[0].geometry.location.lat());
        console.log(results[0].geometry.location.lng());
        var res = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };

        fn(res);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }


  $("#address_placeholder").submit(function(e){
    e.preventDefault();
    var from_address = $('#from_address').val();
    var to_address = $('#to_address').val();
    // var from_coordinates = getCoordinates("address", function(from_address){
    //   debugger;
    //   console.log(from_address);
    //   return from_address;
    // });
    // var to_coordinates = getCoordinates("address", function(to_address){
    //   debugger;
    //   console.log(to_address);
    //   return to_address;
    // });
    // console.log("from", from_coordinates);
    // console.log("to", to_coordinates);
  });

  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
          var coordinates={
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
          };
          console.log(coordinates);

          latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);

          // get current address and autofill from address by default

          $.ajax({
            type:"GET",
            contentType: "application/json",
            url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+coordinates.latitude+","+coordinates.longitude+"&key=AIzaSyA8Ms1kaHfZZcJWuv4wJTX6xNeLvklTURg",
            success:function(res){
                console.log(res.results[0].formatted_address);
                var current_address = res.results[0].formatted_address;
                $("#from_address").val(current_address)
              }
          });

          // set map Options

          mapOptions = {
            zoom: 15,
            center: latLng
          }
          map = new google.maps.Map(document.getElementById("map"), mapOptions);

          // place marker

          var marker = new google.maps.Marker({
            position: latLng,
            map: new google.maps.Map(document.getElementById("map"), mapOptions),
            title: 'You are here!',
            animation: google.maps.Animation.DROP,
            draggable: true
          });

          // auto commplete destination address
          autocomplete = new google.maps.places.Autocomplete(input);
        })
      }


});
