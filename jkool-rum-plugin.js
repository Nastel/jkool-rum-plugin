function createGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}


if (('performance' in window) & ('timing' in window.performance)
		& ('navigation' in window.performance)) {

	var token = "775d182c-fb54-4eb1-be58-1153ce2d7865";
	var myJSONData = "";
	var path;
	var url = window.location.href;
	var appl = "myAppl";
	var server = "myServer";
	var loc = "myLoc";
	// var address = url.substring(url.indexOf("http:\\"),
	// url.indexOf(":"));
	var address = "myAddress";
	var dataCenter = "myDataCenter";
	var sourceFqn = "APPL=".concat(appl).concat('#SERVER=').concat(server)
			.concat('#NETADDR=').concat(address).concat('#DATACENTER=').concat(
					dataCenter).concat('#GEOADDR=').concat(loc);
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
					'000,"end-time-used":').concat(redirectEnd).concat(
					'000,"elapsed-time":').concat(
					Number(redirectEnd) - Number(redirectStart)).concat(
					',"operation":"redirect","source-fqn":"').concat(sourceFqn)
					.concat('","resource":"').concat(url).concat(
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

		// App Cache
		myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
				'","start-time-usec":').concat(fetchStart).concat(
				'000,"operation":"appCache","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat('"}');
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
				'000,"end-time-used":').concat(domainLookupEnd).concat(
				'000,"elapsed-time":').concat(
				Number(domainLookupEnd) - Number(domainLookupStart)).concat(
				',"operation":"DNS","source-fqn":"').concat(sourceFqn).concat(
				'","resource":"').concat(url).concat('","parent-id":"').concat(
				activityId).concat('"}');
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
				'000,"end-time-used":').concat(connectEnd).concat(
				'000,"elapsed-time":').concat(
				Number(connectEnd) - Number(connectStart)).concat(
				',"operation":"TCP","source-fqn":"').concat(sourceFqn).concat(
				'","resource":"').concat(url).concat('","parent-id":"').concat(
				activityId).concat('"}');
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
				',"operation":"request","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat('"}');
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
				'000,"end-time-used":').concat(responseEnd).concat(
				'000,"elapsed-time":').concat(
				Number(connectEnd) - Number(connectStart)).concat(
				',"operation":"response","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat('"}');
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
				'000,"end-time-used":').concat(domComplete).concat(
				'000,"elapsed-time":').concat(
				Number(connectEnd) - Number(connectStart)).concat(
				',"operation":"processing","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat('"}');
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
				'000,"end-time-used":').concat(loadEventEnd).concat(
				'000,"elapsed-time":').concat(
				Number(connectEnd) - Number(connectStart)).concat(
				',"operation":"onLoad","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat('"}');
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
				'000,"end-time-used":').concat(unloadEventEnd).concat(
				'000,"elapsed-time":').concat(
				Number(connectEnd) - Number(connectStart)).concat(
				',"operation":"unLoad","source-fqn":"').concat(sourceFqn)
				.concat('","resource":"').concat(url).concat('","parent-id":"')
				.concat(activityId).concat('"}');
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
				.concat('000,"end-time-used":').concat(unloadEventEnd).concat(
						'000,"elapsed-time":').concat(
						Number(unloadEventEnd) - Number(navigationStart))
				.concat(',"operation":"navigation","source-fqn":"').concat(
						sourceFqn).concat('","resource":"').concat(url).concat(
						'"}');
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
				.concat('000,"end-time-used":').concat(timings["loadEventEnd"])
				.concat('000,"elapsed-time":').concat(
						Number(timings["loadEventEnd"])
								- Number(timings["loadEventStart"])).concat(
						',"operation":"onLoad","source-fqn":"').concat(
						sourceFqn).concat('","resource":"').concat(url).concat(
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
		var perfEntries = window.performance.getEntriesByType("mark");

		for (var i = 0; i < perfEntries.length; i++) {
			myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
					'","start-time-usec":').concat(timings["loadEventStart"])
					.concat('000,"end-time-used":').concat(
							timings["loadEventEnd"]).concat(
							'000,"elapsed-time":').concat(
							Number(timings["loadEventEnd"])
									- Number(timings["loadEventStart"]))
					.concat(',"operation":"mark","source-fqn":"').concat(
							sourceFqn).concat('","resource":"').concat(url)
					.concat('","parent-id":"').concat(activityId).concat('"}');
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
