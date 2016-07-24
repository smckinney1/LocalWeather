//To do: (1) Display error message if using Chrome (can I make it display with a certain version?)
//https://developers.google.com/web/updates/2016/04/geolocation-on-secure-contexts-only?hl=en
//(2) Load a UI on page load that says something like "searching for information..."

var WEATHER_API_COUNTRY_CODE_UNITED_STATES = 'US';

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

//If geolocation fails, allow user to enter zip code to get weather data

function getPosition_Fail(msg) {
	$('#weather').html('<span> Error: ' + msg.message + '<br><br> Try using another browser, or enter your zip code below (US only): </span>');
	$('#form').removeClass('hidden-form');
	$('#submit').click(function() {
		var zipCodeVal = $('#zip').val();
		isValidZipCode(zipCodeVal);	
	})
}

function isValidZipCode(zipCodeVal) {
	if (/^\d{5}(-\d{4})?$/.test(zipCodeVal)) {
		var url = 'http://api.openweathermap.org/data/2.5/weather?appid=bf1b5eaa823ec33bb62dc1c9c72fe979&zip=' + zipCodeVal;
		getJSON(url);
		$('#form').addClass('hidden-form');
	} else {
		alert('Please enter a valid zip code.');	//eventually make this appear in the UI instead. For now keep as alert
	}
}

function getJSON(url) {  
	
	//API key can be kept secret on the server. For now, keep it in the JS file.

	$.getJSON(url, function(data) {

		var tempInKelvin = data.main.temp;
		var celsius = Math.round(tempInKelvin - 273.15);
		var fahrenheit = Math.round(tempInKelvin * 1.8 - 459.67);
		var weatherCondition = data.weather[0].id;

		$('#weather-main').children().removeClass('hidden');
		$('#weather').css('text-shadow', 'none');


		if (data.sys.country !== WEATHER_API_COUNTRY_CODE_UNITED_STATES) {
			$('#myonoffswitch').attr('checked', false);
			
		} else {
			$('#temp').text(fahrenheit + ' \u00B0' + 'F'); //symbols must always be Unicode values in JS
		}
		
		$('.onoffswitch-label').click(function() {
/*			debugger;*/
			
			if ($('#myonoffswitch').prop('checked')) {
				$('#temp').text(celsius + ' \u00B0' + 'C');
			} else {
				$('#temp').text(fahrenheit + ' \u00B0' + 'F');
			}

		})






		$('#weather').text(data.weather[0].main);	//inserts type of weather
		$('#city').text(data.name);					//inserts city

		$('#icon').attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");		//gets the appropriate weather icon from API

		//Show background images based on current weather condition
		switchBackground(weatherCondition);

/*		$('#fahrenheit-btn').click(function() {
			$('#temp').text(fahrenheit + ' \u00B0' + 'F');
		})

		$('#celsius-btn').click(function() {
			$('#temp').text(celsius + ' \u00B0' + 'C');
		})*/

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
