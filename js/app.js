var app = angular.module('app', []);

app.controller('myController', ['$scope', '$http', function($scope, $http){

	$scope.currentPosition = null
	$scope.map = null
	$scope.marker = null
	$scope.latlon = null

	
	$scope.locationFinder = function(){
		    if (navigator.geolocation) 
		    {
		        navigator.geolocation.getCurrentPosition(function(position){
		        $scope.showPosition(position)});
		    } 
		    else
		    {
		        alert("Geolocation is not supported by this browser.");
		    }
		
		//function to get current position
		$scope.showPosition = function(position){
			$scope.mapProperties(position.coords);
        	$scope.currentPosition = position.coords;
	        //parameters to get venues
	       
	        var lat= ($scope.currentPosition.latitude);
	        var lon= ($scope.currentPosition.longitude);
	        $scope.latlon= (lat+","+lon);
	        //parameters for current location's weather
	        config = {
	        	params: {
		            lat: $scope.currentPosition.latitude,
		            lon: $scope.currentPosition.longitude,
		            callback: 'JSON_CALLBACK' 
	          	}
	        }
	      $scope.LoadWeather(config);
	    }
		
	}
	
	$scope.mapProperties = function(coordinates){
	
		var mapProp = {
			  center: new google.maps.LatLng(coordinates.latitude, coordinates.longitude),
			  zoom: 12,
			  mapTypeId:google.maps.MapTypeId.TERRAIN
		};
	
			$scope.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
			//Marker constructor to create a marker
			$scope.marker = new google.maps.Marker({
			  	position: mapProp.center,
			  	animation: google.maps.Animation.BOUNCE
			 });
			$scope.marker.setMap($scope.map);

		// Zoom to 15 when clicking on marker
		google.maps.event.addListener($scope.marker,'click',function() {
		  $scope.map.setZoom(15);
		  $scope.map.setCenter($scope.marker.getPosition());
		});

		//reset center postion of marker when changed after 10s
		google.maps.event.addListener($scope.map,'center_changed',function() {
		  	window.setTimeout(function() {
		    	$scope.map.panTo($scope.marker.getPosition());
		 	},10000);
		});

		google.maps.event.addListener($scope.map, 'click', function(event) {
	  		$scope.placeMarker(event.latLng);
	  	});
	}

	
	$scope.placeMarker = function(location){
		var mapProp = {
	      center: location,
	      zoom: 17,
	      mapTypeId:google.maps.MapTypeId.ROADMAP
    };
	    $scope.marker.setPosition(location)
	    infowindow = new google.maps.InfoWindow({
	        content:  'Latitude: ' + location.lat() +'<br>Longitude: ' + location.lng()
    });
	    infowindow.open($scope.map,$scope.marker);  
	    config = {
	      params: {
	          lat: location.lat(),
	          lon: location.lng(),
	          callback: 'JSON_CALLBACK' 
	      }
    	}
  }

  //function to load weather
    $scope.LoadWeather = function(config){
	    var url = 'http://api.openweathermap.org/data/2.5/weather';
	            $http.jsonp(url, config).success(function(response) {
	              $scope.TemperatureInCent = Math.round(response.main.temp - 273.15);
	              $scope.IconUrl = 'http://openweathermap.org/img/w/'+ response.weather[0].icon+".png";  
	              $scope.humidity = response.main.humidity;
	              $scope.pressure = response.main.pressure;
	              $scope.wind = response.wind.speed;
	              $scope.description = response.weather[0].description;
	            });
	  

	  	var forecast = 'http://api.openweathermap.org/data/2.5/forecast';
	            $http.jsonp(forecast, config).success(function(response) {
	            	$scope.forecasts = response.list;
	            	console.log($scope.forecasts);
	            });

	    $scope.convertTemp = function(value) {
	    	return Math.round(value - 273.15);
	    };

	    $scope.convertPressure = function(value) {
	    	return Math.round(value);
	    };
    }
}]);





































// 	var api = {

// 	$scope.currentPosition: null,
// 	$scope.map: null,
// 	$scope.marker: null,

// 	init: function(){
// 		api.locationFinder();
// 		api.LoadWeather();
// 		$("#js-geolocation").click(MyAPI.getCurrentLocation);
// 	},

// 	// get current location's coordinate.
// 	locationFinder: function (){
// 	    if (navigator.geolocation) 
// 	    {
// 	        navigator.geolocation.getCurrentPosition(showPosition);
// 	    } 
// 	    else
// 	    {
// 	        alert("Geolocation is not supported by this browser.");
// 	    }
// 		//function to get current position
// 		function showPosition(position) {
// 		   	api.mapProperties(position.coords);
// 		   	api.currentPosition = position.coords;
// 			var params = {lat: api.currentPosition.latitude, lon: api.currentPosition.longitude};
//    		    api.LoadWeather(params);
// 		}
// 	},

// 	//function to draw the map
// 	mapProperties: function(coordinates) {
// 		// Map properties.
// 		var mapProp = {
// 		  center: new google.maps.LatLng(coordinates.latitude, coordinates.longitude),
// 		  zoom: 12,
// 		  mapTypeId:google.maps.MapTypeId.TERRAIN
// 		};
	
// 		api.map  =new google.maps.Map(document.getElementById("googleMap"), mapProp);
// 		//Marker constructor to create a marker
// 		api.marker = new google.maps.Marker({
// 		  	position: mapProp.center,
// 		  	animation: google.maps.Animation.BOUNCE
// 		 });
// 		api.marker.setMap(api.map);

// 		// Zoom to 15 when clicking on marker
// 		google.maps.event.addListener(api.marker,'click',function() {
// 		  api.map.setZoom(15);
// 		  api.map.setCenter(api.marker.getPosition());
// 		});

// 		//reset center postion of marker when changed after 10s
// 		google.maps.event.addListener(api.map,'center_changed',function() {
// 		  window.setTimeout(function() {
// 		    api.map.panTo(api.marker.getPosition());
// 		  },10000);
// 		});

// 		google.maps.event.addListener(api.map, 'click', function(event) {
// 	  		api.placeMarker(event.latLng);
// 	  	});
// 	},

// 	//places a marker where the user has clicked and shows an infowindow with the longitudes & latitudes of the marker
// 	placeMarker: function (location){
// 		var markerProp = {
// 			marker: api.marker,
// 		  	position: location,
// 		  	map: api.map,
// 		};
// 		api.marker.setPosition(location)
// 			var params = {lat: location.lat(), lon: location.lng()};
// 	  	var infowindow = new google.maps.InfoWindow({
// 		    content: 'Latitude: ' + location.lat() + ' Longitude: ' + location.lng()
// 	 	});
// 		infowindow.open(api.map,api.marker);	
// 		api.LoadWeather(params);
// 	},

//  	// Display weather for the current location.
// 	LoadWeather: function(params){
// 			var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?callback=?';
// 	        $.getJSON(weatherAPI, params, function(response) {
// 	       			console.log(response);
// 	       			var temp = response.main.temp;
// 	       			api.TemperatureInCent= Math.round(temp - 273.15);
// 	       			console.log(api.TemperatureInCent)

//        			var displayParam = 'http://openweathermap.org/img/w/'+ response.weather[0].icon+".png";
// 				$('#weather').html("<marquee behavior='alternate'><ul>"+ "<li><span id='icon' class='temp_value'>" + '<img src="' + displayParam +'"/>' + '</span></li>' + "<li><span class='temp_value'>" + api.TemperatureInCent + "&deg;C" +'</span></li>'+ "<li><span class='temp_value'>Humidity: " + response.main.humidity + "</span></li>" + "<li><span class='temp_value'>Pressure: " + response.main.pressure + "</span></li>" + "<li><span class='temp_value'>Wind: " + response.wind.deg + "</span></li>"+"<li><span id='weather_descr' class='temp_value'>" + response.weather[0].description+ '</span></li>'+"</ul></marquee>");
//       		});

// 	      	var forecast = 'http://api.openweathermap.org/data/2.5/forecast?callback=?';
// 	            $.getJSON(forecast, params, function(response) {
// 	       			console.log(response.list);

// 	       			var counter = 1;
// 	       			var $div = null;
// 	       			var $list = null;
// 	       			$.each(response.list, function(index, value){
// 	       				// if(counter % 8 ===0)
// 	       				// {
// 	       					$("#forecast").append($list);
// 	       					//$div = $("<div id='div_class'></div>").hide();

// 	       				// }

// 	       				$list = $('<ul class="update"></ul>').attr("id", ''+counter+'');
// 	       				$list.append('<li>'+'Date: '+value.dt_txt+'</li>').append('<li>'+'Temperature: '+Math.round(value.main.temp - 273.15)+"&deg;C"+'</li>').append('<li>'+'Humidity: '+Math.floor(value.main.humidity)+'</li>').append('<li>'+'Pressure: '+Math.floor(value.main.pressure)+'</li>').append('<li>'+'Wind: '+Math.floor(value.wind.deg)+'</li>').append('<li>'+'Description: '+value.weather[0].description+'</li>');
// 	       				//$div.append($list);
// 	       				counter++;
// 	       				// api.TemperatureInCent2 = Math.round(value.main.temp - 273.15);
// 	       				// temp_forecast += "<p><span class='temp_value'>" + api.TemperatureInCent2 + "&deg;C" +'</span></p></br>';
// 	       				// humidity_forecast += "<p><span class='temp_value'>Humidity: " + value.main.humidity + "</span></p></br>";
// 	       				// pressure_forecast += "<p><span class='temp_value'>Pressure: " + value.main.pressure + "</span></p></br>";
// 	       				// wind_forecast += "<p><span class='temp_value'>Wind: " + value.wind.deg + "</span></p></br>";
// 	       				// weather_description += "<p><span id='weather_descr' class='temp_value'>" + value.weather[0].description+ '</span></p></br>';
// 	       			});
// 					$("#forecast").children("#1").show();
	       			
//        			// var displayforecast = 'http://openweathermap.org/img/w/'+ response.weather[0].icon+".png";
// 				 // $('#temp_div').append(temp_forecast);
// 				 // $('#humidity_div').html(humidity_forecast);
// 				 // $('#pressure_div').html(pressure_forecast);
// 				 // $('#wind_div').html(wind_forecast);
// 				 // $('#descr_div').html(weather_description);
//       		});
// 	}

// }//end of api
// $(document).ready(api.init);