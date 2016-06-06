$(document).ready(function(){
  var uberClientId = "YOUR_CLIENT_ID"
  , uberServerToken = "UUgTa0J_u1dthBN2giqeyu9UUOQ032Su2clLX_FI"

  var geocoder = new google.maps.Geocoder();
  var latLng;
  var autocomplete, mapOptions, map;
  var from_address_coordinates, to_coordinates;
  var request_times={};

  var input = /** @type {!HTMLInputElement} */(
            document.getElementById('to_address'));

  // function getCoordinates(address, fn){
  //   geocoder.geocode( { 'address': address}, function(results, status) {
  //     console.log(results);
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       console.log(results[0].geometry.location.lat());
  //       console.log(results[0].geometry.location.lng());
  //       var res = {
  //         lat: results[0].geometry.location.lat(),
  //         lng: results[0].geometry.location.lng()
  //       };
  //
  //       fn(res);
  //     } else {
  //       alert("Geocode was not successful for the following reason: " + status);
  //     }
  //   });
  // }

  function getEstimatesForUserTime(from_lat,from_long) {
    $.ajax({
      url: "https://api.uber.com/v1/estimates/time",
      headers: {
          Authorization: "Token " + uberServerToken
      },
      data: {
          start_latitude: from_lat,
          start_longitude: from_long
      },
      success: function(result) {
          console.log(result.times);
          var times = result.times.map(function(arr){
            return {
              'estimate': Math.ceil(arr.estimate / 60.0),
              'display_name': arr.display_name
            }
          });

          console.log(times);
          var source  = $("#times_template").html();
  				var template = Handlebars.compile(source);

          for (var i=0;i<times.length;i++){
            // if(Object.keys("request_times"))
            if(request_times[times[i].display_name] == undefined){
              request_times[times[i].display_name] = times[i].estimate;
            }
            console.log(request_times);
            var con = {
  						"display_name" : times[i].display_name,
  						"estimate" : times[i].estimate
  					};

  					var html=template(con);
  					$('#suggestions').append(html);

  				}

          // getEstimatesForUserPrice(to_address_cordinates.lat,to_address_cordinates.lng)


          // var data = result["prices"];
          // if (typeof data != typeof undefined) {
          //   // Sort Uber products by time to the user's location
          //   data.sort(function(t0, t1) {
          //     return t0.duration - t1.duration;
          //   });
          //   console.log(data);
          //
          //   // Update the Uber button with the shortest time
          //   var shortest = data[0];
          //   console.log(Math.ceil(shortest.duration / 60.0));
          // }
      }
    });
  }

  function getEstimatesForUserPrice(from_lat,from_long,to_lat,to_lng) {
    $.ajax({
      url: "https://api.uber.com/v1/estimates/price",
      headers: {
          Authorization: "Token " + uberServerToken
      },
      data: {
          start_latitude: from_lat,
          start_longitude: from_long,
          end_latitude: to_lat,
          end_longitude: to_lng
      },
      success: function(result) {
          console.log(result);
          var data = result["prices"];
          if (typeof data != typeof undefined) {
            console.log(data);
            $('#suggestions').empty();
            // Sort Uber products by time to the user's location
            // data.sort(function(t0, t1) {
            //   return t0.duration - t1.duration;
            // });
            // console.log(data);
            // $(".request_ride").css('display','block');
            //
            // // Update the Uber button with the shortest time
            // var shortest = data[0];
            // console.log(Math.ceil(shortest.duration / 60.0));

            var source  = $("#booking_template").html();
    				var template = Handlebars.compile(source);

            for (var i=0;i<data.length;i++){


              var con = {
    						"display_name" : data[i].display_name,
    						"estimate" : data[i].estimate,
                "currency_code": data[i].currency_code,
                "distance": data[i].distance
    					};

              if(request_times[data[i].display_name]!==undefined){
                con['time_estimate'] = request_times[data[i].display_name];
              }

              console.log(con);

    					var html=template(con);
    					$('#suggestions').append(html);

    				}



            // if (typeof shortest != typeof undefined) {
            //   console.log("Updating time estimate...");
            //   $("#time").html("IN " + Math.ceil(shortest.duration / 60.0) + " MIN");
            // }
          }
      }
    });
  }

  $("#address_placeholder").submit(function(e){
    e.preventDefault();
    var to_address = $('#to_address').val();

    geocoder.geocode( { 'address': to_address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var res = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };

        to_address_cordinates = res;

        console.log(from_address_coordinates.lat);
        console.log(from_address_coordinates.lng);
        console.log(to_address_cordinates.lat);
        console.log(to_address_cordinates.lng);

        // uber api key: UUgTa0J_u1dthBN2giqeyu9UUOQ032Su2clLX_FI
        getEstimatesForUserPrice(from_address_coordinates.lat,from_address_coordinates.lng,to_address_cordinates.lat,to_address_cordinates.lng)
        // getEstimatesForUserPrice(from_address_coordinates.lat,from_address_coordinates.lng,to_address_cordinates.lat,to_address_cordinates.lng)


      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });

  });

  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
          var coordinates={
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
          };

          latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);

          // get current address and autofill from address by default

          $.ajax({
            type:"GET",
            contentType: "application/json",
            url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+coordinates.latitude+","+coordinates.longitude+"&key=AIzaSyA8Ms1kaHfZZcJWuv4wJTX6xNeLvklTURg",
            success:function(res){
                var current_address = res.results[0].formatted_address;
                $("#from_address").val(current_address)
                geocoder.geocode( { 'address': current_address}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    var result = {
                      lat: results[0].geometry.location.lat(),
                      lng: results[0].geometry.location.lng()
                    };

                    from_address_coordinates = result;
                    getEstimatesForUserTime(from_address_coordinates.lat,from_address_coordinates.lng)

                  } else {
                    alert("Geocode was not successful for the following reason: " + status);
                  }
                });
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
