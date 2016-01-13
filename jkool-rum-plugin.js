
function createGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

if (('performance' in window) & ('timing' in window.performance)
		& ('navigation' in window.performance)) {

	// User fills in these variables.
	var token = "775d182c-fb54-4eb1-be58-1153ce2d7865";
	var appl = "jKoolUI";
	var server = "jKoolServer";
	var dataCenter = "NastelHQ";
	
	// System computed variables
	var myJSONData = "";
	var path;
	var url = window.location.href;
	var address = url.substring(0, (url.indexOf("?") > 0) ? url.indexOf("?") : url.length);
	var platform = navigator.platform; // property on activity
	var userAgent = navigator.userAgent; // property on activity
	var queryString = url.substring((url.indexOf("?") > 0) ? url.indexOf("?") : 0, (url.indexOf("?") > 0) ? url.length : 0); // property on activity
	var d = new Date();
	var now = d.getTime();
	var sid = document.getElementById('corrid').value;
	var rid = document.getElementById('rcorrid').value;
	var timings = window.performance.timing;
	var userName = document.getElementById("username").value;
	var ipAddress = document.getElementById("ipaddress").value;
	var geoAddress = "Melville";
	var activityId = createGuid();
	var activityProperties = '"properties": [{"name": "queryString","type": "string","value":"'
		.concat(queryString).concat('"},{"name": "platform","type": "string","value":"')
		.concat(platform).concat('"},{"name": "userAgent","type": "string","value": "')
		.concat(userAgent).concat('"}]');
	var eventProperties = '","properties": [{"name": "JK_CORR_SID","type": "string","value":"'
		.concat(sid).concat('"},{"name": "JK_CORR_RID","type": "string","value":"')
		.concat(rid).concat('"},{"name": "queryString","type": "string","value":"')
		.concat(queryString).concat('"},{"name": "platform","type": "string","value":"')
		.concat(platform).concat('"},{"name": "userAgent","type": "string","value": "')
		.concat(userAgent).concat('"}]');
	var sourceFqn = "APPL="
		.concat(appl)
		.concat('#SERVER=')
		.concat(server)
		.concat('#NETADDR=')
		.concat(ipAddress)
		.concat('#DATACENTER=')
		.concat(dataCenter)
		.concat('#GEOADDR=')
		.concat(geoAddress);
	
	var common = '"source-fqn":"'
	.concat(sourceFqn)
	.concat('","msg-tag":"')
	.concat(rid)
	.concat('","time-usec":')
	.concat(now)
	.concat('000')
	.concat(',"resource":"')
	.concat(url)
	.concat('","severity":"SUCCESS","parent-id":"')
	.concat(activityId)
	.concat('","location":"')
	.concat(ipAddress)
	.concat('","source-ssn":"')
	.concat(appl)
	.concat('","user":"')
	.concat(userName)
	.concat('","corrid":"')
	.concat(document.getElementById('corrid').value)
	.concat(',')
	.concat(document.getElementById('rcorrid').value)
	.concat(eventProperties)
	.concat('}')

	
	
	
	
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
					'000,"end-time-usec":').concat(redirectEnd).concat('000')
					.concat(',"operation":"redirect",').concat(common);
			path = 'event';
			//alert(myJSONData);
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
				'","start-time-usec":').concat(fetchStart).concat('000')
				.concat(',"operation":"appCache",').concat(common);
		path = 'event';
		//alert(myJSONData);
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
		myJSONData = '{"tracking-id":"'.concat(createGuid())
				.concat('","start-time-usec":')	
				.concat(domainLookupStart)
				.concat('000,"end-time-usec":')
				.concat(domainLookupEnd)
				.concat('000')
				.concat(',"operation":"DNS",')
				.concat(common);
		path = 'event';
		//alert(myJSONData);
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
				'000,"end-time-usec":').concat(connectEnd).concat('000')
				.concat(',"operation":"TCP",').concat(common);
		path = 'event';
		//alert(myJSONData);
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
				'","start-time-usec":').concat(requestStart).concat('000')
				.concat(',"operation":"request",').concat(common);
		path = 'event';
		//alert(myJSONData);
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
				'000,"end-time-usec":').concat(responseEnd).concat('000')
				.concat(',"operation":"response",').concat(common);
		path = 'event';
		//alert(myJSONData);
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
				'000,"end-time-usec":').concat(domComplete).concat('000')
				.concat(',"operation":"processing",').concat(common);
		path = 'event';
		//alert(myJSONData);
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
				'000,"end-time-usec":').concat(unloadEventEnd).concat('000')
				.concat(',"operation":"unload",').concat(common);
		path = 'event';
		//alert(myJSONData);
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
						'000').concat(',"time-usec":').concat(now).concat('000').concat(',"operation":"navigation","source-fqn":"').concat(
						sourceFqn).concat('","resource":"').concat(url).concat('",').concat(activityProperties).concat(
						',"user":"').concat(userName).concat('"}');
		path = 'activity';
		//alert(myJSONData);
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
	setTimeout(
			function() {
				var timings = window.performance.timing;
				var myJSONLoadData = '{"tracking-id":"'.concat(createGuid())
						.concat('","start-time-usec":"').concat(
								timings["loadEventStart"]).concat(
								'000,"end-time-usec":').concat(
								timings["loadEventEnd"]).concat('000').concat(
								',"operation":"onload",').concat(common)

				loadPath = 'event';

				//alert(myJSONLoadData);
				$.ajax({
					type : 'POST',
					url : 'http://localhost:6580/JESL/'.concat(loadPath),
					data : myJSONLoadData,
					dataType : 'text',
					headers : {
						'token' : token
					},
				});

		var perfEntries = window.performance.getEntriesByType("mark");
		for (var i = 0; i < perfEntries.length; i++) {
			
			var prefix = perfEntries[i].name.substring(0,perfEntries[i].name.indexOf("_"));
			
			if (prefix.length > 0 && prefix == "start")
			{
				var suffix = perfEntries[i].name.substring(perfEntries[i].name.indexOf("_"),perfEntries[i].name.length);
				var start = perfEntries[i];
				var end = window.performance.getEntriesByName('end' + suffix);
				var measure = window.performance.getEntriesByName('measure' + suffix);			
				
				var myJSONAjaxData = '{"tracking-id":"'.concat(createGuid())
						.concat('","start-time-usec":').concat(Math.round(((timings["navigationStart"] * 1000) + start.startTime)))
						.concat(',"end-time-usec":').concat(Math.round(((timings["navigationStart"] * 1000) + end[0].startTime)))
						.concat(',"elapsed-time-usec":').concat(Math.round(measure[0].duration))
						.concat(',"operation":"' + suffix + '","source-fqn":"').concat(sourceFqn)
						.concat('",').concat(common);
				var ajaxPath = 'event';
				//alert(myJSONAjaxData);
				$.ajax({
					type : 'POST',
					url : 'http://localhost:6580/JESL/'.concat(ajaxPath),
					data : myJSONAjaxData,
					dataType : 'text',
					headers : {
						'token' : token
					},
				});
			}
		}

	}, 0);
}

 window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	
    if (errorMsg.indexOf('Script error.') > -1) {
        return;
    }
    else
    {
		var myJSONErrorData = '{"tracking-id":"'.concat(createGuid()).concat(
		'","start-time-usec":').concat(now).concat(
		'000').concat(',"operation":"javascriptError",').concat(common);
		errorPath = 'event';
		//alert(myJSONData);
		$.ajax({
			type : 'POST',
			url : 'http://localhost:6580/JESL/'.concat(errorPath),
			data : myJSONErrorData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		});
    }
   }
