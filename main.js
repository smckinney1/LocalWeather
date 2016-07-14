//To do: (1) Display error message if using Chrome (can I make it display with a certain version?)
//https://developers.google.com/web/updates/2016/04/geolocation-on-secure-contexts-only?hl=en
//(2) Load a UI on page load that says something like "searching for information..."

$(document).ready(function() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getPosition_Success, getPosition_Fail);
		$('#weather').text('Looking for location...');
	}

})


function getPosition_Success (position) {

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var url = 'http://api.openweathermap.org/data/2.5/weather?appid=bf1b5eaa823ec33bb62dc1c9c72fe979&lat=' + latitude + '&lon=' + longitude;
	getJSON(url);
	//getWeatherGeolocation(latitude, longitude);
	
}

function getPosition_Fail(msg) {
	$('#weather').text(msg.message + ' Try using another browser that supports geolocation data over non-HTTPS connections, or enter your zip code below (US only):');
	$('#form').removeClass('hidden-form');
	$('#submit').click(function() {
		var zipCode = $('#zip').val();
		//make sure only 5 digits entered
		//make sure no non-numeric characters entered
		//make sure text input not empty
		var url = 'http://api.openweathermap.org/data/2.5/weather?appid=bf1b5eaa823ec33bb62dc1c9c72fe979&zip=' + zipCode;
		getJSON(url);
		$('#form').addClass('hidden-form');
		//URL is working, now turn components from success function into reusable code to be used here too
	})
	console.log(msg.code); //account for other message codes at some point
}

function getJSON(url) {  
	
	//API key can be kept secret on the server. For now, keep it in the JS file.

	$.getJSON(url, function(data) {

		var tempInKelvin = data.main.temp;
		var celsius = Math.round(tempInKelvin - 273.15);
		var fahrenheit = Math.round(tempInKelvin * 1.8 - 459.67);
		var weatherCondition = data.weather[0].id;

		$('#weather-main').children().removeClass('hidden');

		//if in the US, automatically display Fahrenheit (can be modified to include the few other places that use F)
		if (data.sys.country === 'US') {
			$('#temp').text(fahrenheit + ' F'); //+ '&deg;' (how to get degrees to show up)
		} else {
			$('#temp').text(celsius + ' C'); // + '&deg;' (how to get degrees to show up)
		}

		$('#weather').text(data.weather[0].main);	//inserts type of weather
		$('#city').text(data.name);					//inserts city

		$('#icon').attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");		//gets the appropriate weather icon from API

		//Show background images based on current weather condition
		switchBackground(weatherCondition);

		$('#fahrenheit-btn').click(function() {
			$('#temp').text(fahrenheit + ' F');
		})

		$('#celsius-btn').click(function() {
			$('#temp').text(celsius + ' C');
		})

	})
}

function switchBackground(condition) {
	switch (true) {
	case (condition < 300):
		$('body').css({"background": "url(\"backgrounds/thunderstorm.jpg\")", "background-size": "cover"});
		break;
	case (condition < 600):
		$('body').css({"background": "url(\"backgrounds/rain.jpg\")", "background-size": "cover"});
		break;
	case (condition < 700):
		$('body').css({"background": "url(\"backgrounds/snow.jpeg\")", "background-size": "cover"});
		break;
	case (condition === 800 || condition === 801 || condition === 802):
		//$('#clear').removeClass("hidden");
		$('body').css({"background": "url(\"backgrounds/clear.jpg\")", "background-size": "cover"});
		break;
	case (condition === 803 || condition === 804):
		$('body').css({"background": "url(\"backgrounds/clouds.jpg\")", "background-size": "cover"});
		break;
	default: 
		$('body').css({"background": "#424242"});
		break;
	}
}
