//navigator.geolocation.getCurrentPosition(function(position) {alert(position)});


function createGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function myIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

if (('performance' in window) & ('timing' in window.performance)
		& ('navigation' in window.performance)) {

	// User fills in these variables.
	var token = "775d182c-fb54-4eb1-be58-1153ce2d7865";
	var appl = "myAppl";
	var server = "myServer";
	var dataCenter = "myDataCenter";
	var userName = "myUserName";
		
	// System computed variables
	var geoAddress = "New York, NY";
	var myJSONData = "";
	var path;
	var url = window.location.href;
	//var ipAddress = myIP();
	var ipAddress = "192.168.253.1";
	var address = url.substring(0, (url.indexOf("?") > 0) ? url.indexOf("?") : url.length);
	var sourceFqn = "APPL=".concat(appl).concat('#SERVER=').concat(server)
			.concat('#NETADDR=').concat(ipAddress).concat('#DATACENTER=').concat(
					dataCenter).concat('#GEOADDR=').concat(geoAddress);
	var platform = navigator.platform; // property on activity
	var userAgent = navigator.userAgent; // property on activity
	var queryString = url.substring((url.indexOf("?") > 0) ? url.indexOf("?") : 0, (url.indexOf("?") > 0) ? url.length : 0); // property on activity
	var properties = '"properties": [{"name": "queryString","type": "string","value":"'.concat(queryString).concat('"},{"name": "platform","type": "string","value":"').concat(platform).concat('"},{"name": "userAgent","type": "string","value": "').concat(userAgent).concat('"}]');
	var d = new Date();
	var now = d.getTime();
	
	// Start/End times
	var navigationStart;
	var redirectStart;
	var redirectEnd;
	var fetchStart;
	var domainLookupStart;
	var domainLookupEnd;
	var connectStart;
	var unloadEventEnd;
	var fetchStart;
	var domainLookupStart;
	var domainLookupEnd;
	var connectStart;
	var connectEnd;
	var requestStart;
	var responseStart;
	var responseEnd;
	var activityId = createGuid();
	var domLoading;
	var domInteractive;
	var domContentLoadedEventStart;
	var domContentLoadedEventEnd;
	var domComplete;
	var loadEventStart;
	var loadEventEnd;
	var unloadEventStart;
	var unloadEventEnd;

	window.addEventListener('load', function() {
		var timings = window.performance.timing;

		// Obtain start/end times
		for ( var timing in timings) {
			if (timing == "navigationStart")
				navigationStart = timings[timing]
			else if (timing == "redirectStart")
				redirectStart = timings[timing]
			else if (timing == "redirectEnd")
				redirectEnd = timings[timing]
			else if (timing == "responseStart")
				responseStart = timings[timing]
			else if (timing == "responseEnd")
				responseEnd = timings[timing]
			else if (timing == "connectStart")
				connectStart = timings[timing]
			else if (timing == "connectEnd")
				connectEnd = timings[timing]
			else if (timing == "domainLookupStart")
				domainLookupStart = timings[timing]
			else if (timing == "domainLookupEnd")
				domainLookupEnd = timings[timing]
			else if (timing == "unloadEventEnd")
				unloadEventEnd = timings[timing];
			else if (timing == "fetchStart")
				fetchStart = timings[timing];
			else if (timing == "requestStart")
				requestStart = timings[timing];
			else if (timing == "domLoading")
				domLoading = timings[timing]
			else if (timing == "domInteractive")
				domInteractive = timings[timing]
			else if (timing == "domContentLoadedEventStart")
				domContentLoadedEventStart = timings[timing];
			else if (timing == "domContentLoadedEventEnd")
				domContentLoadedEventEnd = timings[timing];
			else if (timing == "domComplete")
				domComplete = timings[timing];
			else if (timing == "loadEventStart")
				loadEventStart = timings[timing]
			else if (timing == "unloadEventStart")
				unloadEventStart = timings[timing];
			else if (timing == "unloadEventEnd")
				unloadEventEnd = timings[timing];
			else if (timing == "loadEventEnd")
				loadEventEnd = timings[timing];
			else {
				//
			}

		}

		// Redirect
		if (redirectStart > 0) {
			myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
					'","start-time-usec":').concat(redirectStart).concat(
					'000,"end-time-usec":').concat(redirectEnd).concat(
					'000').concat(
					',"operation":"redirect","source-fqn":"').concat(sourceFqn)
					.concat('","resource":"').concat(url).concat(
							'","parent-id":"').concat(activityId).concat(
							'","user":"').concat(userName).concat('"}');
			path = 'event';
			alert(myJSONData);
			$.ajax({
				type : 'POST',
				url : 'http://localhost:6580/JESL/'.concat(path),
				data : myJSONData,
				dataType : 'text',
				headers : {
					'token' : token
				},
			});
		}

		// App Cache
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(fetchStart).concat(
				'000,"operation":"appCache","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// DNS Lookup
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(domainLookupStart).concat(
				'000,"end-time-usec":').concat(domainLookupEnd).concat(
				'000').concat(
				',"operation":"DNS","source-fqn":"').concat(sourceFqn).concat(
				'","resource":"').concat(url).concat('","parent-id":"').concat(
				activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// TCP
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(connectStart).concat(
				'000,"end-time-usec":').concat(connectEnd).concat(
				'000').concat(
				',"operation":"TCP","source-fqn":"').concat(sourceFqn).concat(
				'","resource":"').concat(url).concat('","parent-id":"').concat(
				activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// Request
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(requestStart).concat(
				'000,"operation":"request","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// Response
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(responseStart).concat(
				'000,"end-time-usec":').concat(responseEnd).concat(
				'000').concat(
				',"operation":"response","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// Processing
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(domLoading).concat(
				'000,"end-time-usec":').concat(domComplete).concat(
				'000').concat(
				',"operation":"processing","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// onLoad
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(loadEventStart).concat(
				'000').concat(
				',"operation":"onLoad","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// unLoad
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(unloadEventStart).concat(
				'000,"end-time-usec":').concat(unloadEventEnd).concat(
				'000').concat(
				',"operation":"unLoad","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat(
				'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

		// Navigation Activity
		myJSONData = '{"tracking-id":"'.concat(activityId).concat(
				'","status":"END","start-time-usec":').concat(navigationStart)
				.concat('000,"end-time-usec":').concat(unloadEventEnd).concat(
						'000').concat(',"operation":"navigation","source-fqn":"').concat(
						sourceFqn).concat('","resource":"').concat(url).concat('","corrid":"').concat(document.getElementById('corrid').value).concat('",').concat(properties).concat(
						',"user":"').concat(userName).concat('"}');
		path = 'activity';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});

	}

	)

	// onLoad & Ajax
	// (To prevent zero from being reported, need to put it in a timeout function)
	setTimeout(function() {

		var timings = window.performance.timing;
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(timings["loadEventStart"])
				.concat('000,"end-time-usec":').concat(timings["loadEventEnd"])
				.concat('000').concat(
						',"operation":"onLoad","source-fqn":"').concat(
						sourceFqn).concat('","resource":"').concat(url).concat(
						'","parent-id":"').concat(activityId).concat(
						'","user":"').concat(userName).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});
		var perfEntries = window.performance.getEntriesByType("mark");

		for (var i = 0; i < perfEntries.length; i++) {
			myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
					'","start-time-usec":').concat(timings["loadEventStart"])
					.concat('000').concat(',"operation":"mark","source-fqn":"').concat(
							sourceFqn).concat('","resource":"').concat(url)
					.concat('","parent-id":"').concat(activityId).concat(
					'","user":"').concat(userName).concat('"}');
			path = 'event';
			alert(myJSONData);
			$.ajax({
				type : 'POST',
				url : 'http://localhost:6580/JESL/'.concat(path),
				data : myJSONData,
				dataType : 'text',
				headers : {
					'token' : token
				},
			});
		}
	}, 3000);
}

 window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	
    if (errorMsg.indexOf('Script error.') > -1) {
        return;
    }
    else
    {
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
		'","start-time-usec":').concat(now).concat(
		'000').concat(
		',"operation":"javascriptError","source-fqn":"').concat(sourceFqn)
		.concat('","resource":"').concat(url).concat('","exception":"').concat(errorMsg).concat(
				'","parent-id":"').concat(activityId).concat('"}');
		path = 'event';
		alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(path),
			data : myJSONData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});
    }
   }
