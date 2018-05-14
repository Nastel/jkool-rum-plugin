/*
 * Copyright (c) 2014 jKool, LLC. All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * jKool, LLC. ("Confidential Information").  You shall not disclose
 * such Confidential Information and shall use it only in accordance with
 * the terms of the license agreement you entered into with jKool, LLC.
 *
 * JKOOL MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
 * THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE, OR NON-INFRINGEMENT. JKOOL SHALL NOT BE LIABLE FOR ANY DAMAGES
 * SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 * CopyrightVersion 1.0
 *
 */


var token = window.token; 
var appl = window.appl;
var dataCenter = window.dataCenter;
var mark = window.mark;

function augment(beforeMarks, afterMarks) {
    var name, fn, loc;
    for (name in window) {
        fn = window[name];
		loc = window.location.href;
        if (typeof fn === 'function') {
			if ((mark == "all" && fn.toString().indexOf("native") == -1  && name != "$" && name != "jQuery" && name != "afterLoadMeasure"  && name != "createGuid"  && name != "get_browser_info"  && name != "myIP"  && name != "declined"  && name != "stream"  && name != "report"  && name != "reportError"  && name != "afterLoadMeasure") ||
			     mark.indexOf(name) != -1)
            window[name] = (function(name, fn) {
                var args = arguments; 
                return function() {
                    beforeMarks.apply(this, args); 
                    var x = fn.apply(this, arguments);
					afterMarks.apply(this, args);
					return x;
                }
            })(name, fn);
        }
    }
}

function markFunctions ()
{
	if (mark == "none")
	{
		return;
	}
	augment(function(name, fn) {
		performance.mark("start_" + name);   
		},function(name, fn) {
		performance.mark("end_" + name);
		performance.measure('measure_' + name, 'start_' + name, 'end_' + name);
		var properties = '{"markedFunction":"true"}';    
		afterLoadMeasure('measure_' + name, properties, '', name, 'INFO'); 
}	
);
}

function createGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function get_browser_info() {
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName = navigator.appName;
	var fullVersion = '' + parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset = nAgt.indexOf("Opera")) != -1) {
		browserName = "Opera";
		fullVersion = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf("Version")) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
		browserName = "Microsoft Internet Explorer";
		fullVersion = nAgt.substring(verOffset + 5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
		browserName = "Chrome";
		fullVersion = nAgt.substring(verOffset + 7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
		browserName = "Safari";
		fullVersion = nAgt.substring(verOffset + 7); 
		if ((verOffset = nAgt.indexOf("Version")) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
		browserName = "Firefox";
		fullVersion = nAgt.substring(verOffset + 8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt
			.lastIndexOf('/'))) {
		browserName = nAgt.substring(nameOffset, verOffset);
		fullVersion = nAgt.substring(verOffset + 1);
		if (browserName.toLowerCase() == browserName.toUpperCase()) {
			browserName = navigator.appName;
		}
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix = fullVersion.indexOf(";")) != -1)
		fullVersion = fullVersion.substring(0, ix);
	if ((ix = fullVersion.indexOf(" ")) != -1)
		fullVersion = fullVersion.substring(0, ix);

	majorVersion = parseInt('' + fullVersion, 10);
	if (isNaN(majorVersion)) {
		fullVersion = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}

	return majorVersion;
}

if (('performance' in window) & ('timing' in window.performance)
		& ('navigation' in window.performance)) {

	// System computed variables
	var jsErrorMsg = "";
	var jsErrorLocation = "";
	var myJSONData = "";
	var timingProperties = "";
	var path;
	var url = window.location.href;
	var address = url.substring(0, (url.indexOf("?") > 0) ? url.indexOf("?")
			: url.length);
	var platform = navigator.platform;
	var userAgent = navigator.userAgent;
	if (userAgent.indexOf("Chrome/") > 0)
		userAgent = "Chrome";
	else if (userAgent.indexOf("Seamonkey/") > 0)
		userAgent = "Seamonkey";
	else if (userAgent.indexOf("Firefox/") > 0)
		userAgent = "Firefox";
	else if (userAgent.indexOf(";MSIE/" > 0))
		userAgent = "IE";
	else if (userAgent.indexOf("Chromium/") > 0)
		userAgent = "Chromium";
	else if (userAgent.indexOf("Safari/") > 0)
		userAgent = "Safari";
	else if (userAgent.indexOf("Opera/") > 0)
		userAgent = "Opera";
	var browserVersion = get_browser_info();
	var queryString = url.substring((url.indexOf("?") > 0) ? url.indexOf("?")
			: 0, (url.indexOf("?") > 0) ? url.length : 0); // property on
															// activity
	var d = new Date();
	var now = d.getTime();
	var sid = document.getElementById('corrid').value;
	var rid = document.getElementById('rcorrid').value;
	var timings = window.performance.timing;
	var userName = document.getElementById("username").value;
	var ipAddressXForwarded; 
	if (document.getElementById("ipAddressXForwarded") != null)
		ipAddressXForwarded = document.getElementById("ipAddressXForwarded").value;
	else
		ipAddressXForwarded = "not.available"
	var ipAddressRemote; 
	if (= document.getElementById("ipAddressRemote") != null)
		ipAddressRemote = document.getElementById("ipAddressRemote").value;
	else
		ipAddressRemote = "not.available"
	var ipAddress;
	var server;
	var activityIdFirstByteTime = createGuid();
	var activityIdServerConnectionTime = createGuid();
	var activityIdEndUserResponseTime = createGuid(); 
	var activityIdFrontEndTime = createGuid();
	var activityIdDocumentReadyTime = createGuid();
	var activityIdPageRenderTime = createGuid();
	var activityIdDocumentDownLoadTime = createGuid();
	var activityIdDocumentProcessingTime = createGuid();
	var activityIdResponseAvailableTime = createGuid();
	var activityIdSummary = createGuid();
	
	var activityProperties = '"properties": [{"name": "queryString","type": "string","value":"'
			.concat(queryString).concat(
					'"},{"name": "platform","type": "string","value":"')
			.concat(platform).concat(
					'"},{"name": "JK_CORR_SID","type": "string","value": "')
			.concat(sid).concat(
					'"},{"name": "JK_CORR_RID","type": "string","value": "')
			.concat(rid).concat(
					'"},{"name": "browser","type": "string","value": "')
			.concat(userAgent).concat(
					'"},{"name": "browserVersion","type": "string","value": "')
			.concat(browserVersion).concat('"},replaceTiming]');
	var eventProperties = '"],"properties": [{"name": "JK_CORR_SID","type": "string","value":"'
			.concat(sid).concat(
					'"},{"name": "JK_CORR_RID","type": "string","value":"')
			.concat(rid).concat(
					'"},{"name": "queryString","type": "string","value":"')
			.concat(queryString).concat(
					'"},{"name": "platform","type": "string","value":"')
			.concat(platform).concat(
					'"},{"name": "browser","type": "string","value": "')
			.concat(userAgent).concat(
					'"},{"name": "browserVersion","type": "string","value": "')
			.concat(browserVersion).concat('"},replaceTiming]');
	var eventSourceFqn = "APPL=".concat(appl).concat('#SERVER=').concat("replaceserver")
			.concat('#NETADDR=').concat("replaceipaddress").concat('#DATACENTER=')
			.concat(dataCenter).concat('#GEOADDR=').concat("replacelat,replacelon");
	
	var activitySourceFqn = "APPL=".concat(appl).concat('#SERVER=').concat("replaceserver")
	.concat('#NETADDR=').concat("replaceipaddress").concat('#DATACENTER=')
	.concat(dataCenter).concat('#GEOADDR=').concat(
			"replacelat,replacelon");
	
	var activityCommon = '"source-fqn":"'.concat(activitySourceFqn).concat('","status":"END","parent-id":"replaceParentIds","resource":SERVICE="').concat(url).concat(
		'",').concat(activityProperties).concat(',"user":"').concat(userName).concat('","corrid":["').concat(sid).concat(',').concat(rid).concat('"]}');

	var common = '"source-fqn":"'.concat(eventSourceFqn).concat('","msg-tag":"')
			.concat(rid).concat('","time-usec":').concat(now).concat('000')
			.concat(',"resource":SERVICE="').concat(url).concat(
					'","severity":"INFO","parent-id":"replaceParentIds"')
			.concat(',"location":"').concat("replaceipaddress").concat(
					'","source-ssn":"').concat(appl).concat('","user":"')
			.concat(userName).concat('","corrid":["').concat(
					document.getElementById('corrid').value).concat(',')
			.concat(document.getElementById('rcorrid').value).concat(
					eventProperties).concat('}');
	var errorSourceFqn = "APPL=".concat(appl).concat('#SERVER=').concat("replaceserver")
			.concat('#NETADDR=').concat(ipAddress).concat('#DATACENTER=')
			.concat(dataCenter);
	var errorProperties = '"properties": [{"name": "queryString","type": "string","value":"'
			.concat(queryString).concat(
					'"},{"name": "platform","type": "string","value":"')
			.concat(platform).concat(
					'"},{"name": "JK_CORR_SID","type": "string","value": "')
			.concat(sid).concat(
					'"},{"name": "JK_CORR_RID","type": "string","value": "')
			.concat(rid).concat(
					'"},{"name": "browser","type": "string","value": "')
			.concat(userAgent).concat(
					'"},{"name": "browserVersion","type": "string","value": "')
			.concat(browserVersion).concat('"}]').concat(',"user":"')
			.concat(userName)
			.concat('","corrid":["').concat(document.getElementById('corrid').value).concat(',').concat(document.getElementById('rcorrid').value)				
			.concat('"]}');

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

	window
			.addEventListener(
					'load',
					function() {

						// Obtain start/end times
						for ( var timing in timings) {
							if (timing == "navigationStart")
								navigationStart = timings[timing];
							else if (timing == "redirectStart")
								redirectStart = timings[timing];
							else if (timing == "redirectEnd")
								redirectEnd = timings[timing];
							else if (timing == "responseStart")
								responseStart = timings[timing];
							else if (timing == "responseEnd")
								responseEnd = timings[timing];
							else if (timing == "connectStart")
								connectStart = timings[timing];
							else if (timing == "connectEnd")
								connectEnd = timings[timing];
							else if (timing == "domainLookupStart")
								domainLookupStart = timings[timing];
							else if (timing == "domainLookupEnd")
								domainLookupEnd = timings[timing];
							else if (timing == "loadEventStart")
								loadEventStart = timings[timing];
							else if (timing == "loadEventEnd")
								loadEventEnd = timings[timing];
							else if (timing == "unloadEventStart")
								unloadEventStart = timings[timing];
							else if (timing == "unloadEventEnd")
								unloadEventEnd = timings[timing];
							else if (timing == "domContentLoadedEventStart")
								domContentLoadedEventStart = timings[timing];
							else if (timing == "domContentLoadedEventEnd")
								domContentLoadedEventEnd = timings[timing];
							else if (timing == "fetchStart")
								fetchStart = timings[timing];
							else if (timing == "requestStart")
								requestStart = timings[timing];
							else if (timing == "domLoading")
								domLoading = timings[timing];
							else if (timing == "domInteractive")
								domInteractive = timings[timing];
							else if (timing == "domComplete")
								domComplete = timings[timing];
							else {
								//
							}

						}
					}
			)
			
	// To report location
	// (To prevent zero from being reported for onLoadEnd, need to put it in a timeout
	// function)
	setTimeout(function() {
		var timings = window.performance.timing;
		if (timings["loadEventEnd"] != null && timings["loadEventEnd"] >= 0)
		{

			markFunctions ();
			myIP();
		}
		else
		{
 

			// Error
			myJSONData = '{"tracking-id":"'.concat(createGuid()).concat(
					'","start-time-usec":').concat(now)
					.concat('000,"end-time-usec":').concat(now).concat(
							'000').concat(',"time-usec":').concat(now)
					.concat('000').concat(
							',"operation":"ERROR","source-fqn":"')
					.concat(errorSourceFqn).concat('","resource":SERVICE="').concat(url).concat(
							'",').concat(errorProperties);
			path = 'activity';
			//alert(myJSONData);
			stream (path, myJSONData);
		}
	}, 5000);
	

	function myIP() {
		jQuery.ajax({
	        url: '//freegeoip.net/json/',
	        type: 'POST',
	        timeout:1000,
	        dataType: 'jsonp',
	        success: function(location) {
	            ipAddress = location.ip;
				activityCommon = activityCommon.replace("replaceserver",ipAddress);
				activityCommon = activityCommon.replace("replaceipaddress",ipAddress);
				common = common.replace("replaceserver",ipAddress);
				common = common.replace("replaceipaddress",ipAddress);
				common = common.replace("replaceipaddress",ipAddress);
//				if (url.substring(0,5) != "https")
//				{
//					report("n/a");
//				}
//				else 
//				{
//					navigator.geolocation.getCurrentPosition(report, declined);
//				}
				report("n/a");
	        },
			error: function() {
				if (ipAddressXForwarded != null)
				{
					ipAddress = ipAddressXForwarded;
				}
				else
				{
					ipAddress = ipAddressRemote;				
				}
				activityCommon = activityCommon.replace("replaceserver",ipAddress);
				activityCommon = activityCommon.replace("replaceipaddress",ipAddress);
				common = common.replace("replaceserver",ipAddress);
				common = common.replace("replaceipaddress",ipAddress);
				common = common.replace("replaceipaddress",ipAddress);
//				if (url.substring(0,5) != "https")
//				{
//					report("n/a");
//				}
//				else
//				{
//					navigator.geolocation.getCurrentPosition(report, declined);
//				}
				report("n/a");
			}
	    });
	}
	
	function declined(error) {
	    if (error.code == error.PERMISSION_DENIED) {
	        report("n/a");
	    }}

	// all Activities, onLoad Event, & Measures
	
	function stream (loadPath, myJSONLoadData) {
		jQuery.ajax({
			type : 'POST',
			url : 'https://data.jkoolcloud.com/JESL/'.concat(loadPath),
			data : myJSONLoadData,
			dataType : 'text',
			headers : {
				'token' : token
			},
		})
	}
	

	function report(position) { // Begin
		  
		// EVENT LEVEL
		if (position == "n/a")
		{
			common = common.replace("replacelat","");
			common = common.replace("replacelon","");
		}
		else
		{
			common = common.replace("replacelat",position.coords.latitude);
			common = common.replace("replacelon",position.coords.longitude);
		}
		// Redirect
		if (redirectStart > 0) {
			timingProperties = '{"name": "timingStart","type": "string","value":"redirectStart"},{"name": "timingEnd","type": "string","value":"redirectEnd"}';
			myJSONData = '{"start-time-usec":'.concat(redirectStart)
			.concat('000,"end-time-usec":').concat(redirectEnd).concat('000')
			.concat(',"operation":"REDIRECT",')
			.concat(common);
			myJSONData = myJSONData.replace("replaceTiming",
					timingProperties);
			myJSONData = myJSONData.replace(',"parent-id":"replaceParentIds"',
				'');
			path = 'event';
			//alert(myJSONData);
			stream (path, myJSONData);
		}

		// App Cache
		if (fetchStart > 0) {
			timingProperties = '{"name": "timingStart","type": "string","value":"fetchStart"}';
			myJSONData = '{"start-time-usec":'.concat(fetchStart).concat('000')
			.concat(',"operation":"APPCACHE",')
			.concat(common);
			myJSONData = myJSONData.replace("replaceTiming",
					timingProperties);
			myJSONData = myJSONData.replace("replaceParentIds",
					activityIdServerConnectionTime);
			path = 'event';
			//alert(myJSONData);
			stream (path, myJSONData);
		}

		// DNS Lookup
		timingProperties = '{"name": "timingStart","type": "string","value":"domainLookupStart"},{"name": "timingEnd","type": "string","value":"domainLookupEnd"}';
		myJSONData = '{"start-time-usec":'.concat(domainLookupStart)
		.concat('000,"end-time-usec":').concat(domainLookupEnd).concat('000')
		.concat(',"operation":"DNS",')
		.concat(common);
		myJSONData = myJSONData.replace("replaceTiming",
				timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds",
				activityIdServerConnectionTime);
		path = 'event';
		//alert(myJSONData);
		stream (path, myJSONData);

		// TCP
		timingProperties = '{"name": "timingStart","type": "string","value":"connectStart"},{"name": "timingEnd","type": "string","value":"connectEnd"}';
		myJSONData = '{"start-time-usec":'.concat(connectStart)
		.concat('000,"end-time-usec":')
		.concat(connectEnd).concat('000')
		.concat(',"operation":"TCP",')
		.concat(common);
		myJSONData = myJSONData.replace("replaceTiming",
				timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds",
				activityIdServerConnectionTime);
		path = 'event';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Request
		timingProperties = '{"name": "timingStart","type": "string","value":"requestStart"}';
		myJSONData = '{"start-time-usec":'.concat(requestStart).concat('000')
		.concat(',"operation":"REQUEST",')
		.concat(common);
		myJSONData = myJSONData.replace("replaceTiming",
				timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds",
				activityIdResponseAvailableTime);
		path = 'event';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Response
		timingProperties = '{"name": "timingStart","type": "string","value":"responseStart"},{"name": "timingEnd","type": "string","value":"responseEnd"}';
		myJSONData = '{"start-time-usec":'.concat(responseStart)
		.concat('000,"end-time-usec":').concat(responseEnd).concat('000')
		.concat(',"operation":"RESPONSE",')
		.concat(common);
		myJSONData = myJSONData.replace("replaceTiming",
				timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds",
				activityIdDocumentDownLoadTime);
		path = 'event';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Processing
		timingProperties = '{"name": "timingStart","type": "string","value":"domLoading"},{"name": "timingEnd","type": "string","value":"domComplete"}';
		myJSONData = '{"start-time-usec":'.concat(domLoading)
		.concat('000,"end-time-usec":').concat(domComplete).concat('000')
		.concat(',"operation":"PROCESSING",')
		.concat(common);
		myJSONData = myJSONData.replace("replaceTiming",
				timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds",
				activityIdDocumentProcessingTime);
		path = 'event';
		//alert(myJSONData);
		stream (path, myJSONData);

		// unLoad
		timingProperties = '{"name": "timingStart","type": "string","value":"unloadEventStart"},{"name": "timingEnd","type": "string","value":"unloadEventEnd"}';
		myJSONData = '{"start-time-usec":'.concat(unloadEventStart)
		.concat('000,"end-time-usec":').concat(unloadEventEnd).concat('000')
		.concat(',"operation":"UNLOAD",')
		.concat(common);
		myJSONData = myJSONData.replace("replaceTiming",
				timingProperties);
		myJSONData = myJSONData.replace(',"parent-id":"replaceParentIds"',
		'');
		path = 'event';
		//alert(myJSONData);
		stream (path, myJSONData);

		// OnLoad Event
		var timings = window.performance.timing;
		timingProperties = '{"name": "timingStart","type": "string","value":"loadEventStart"},{"name": "timingEnd","type": "string","value":"loadEventEnd"}';
		var myJSONLoadData = '{"start-time-usec":'.concat(timings["loadEventStart"])
			.concat('000,"end-time-usec":').concat(timings["loadEventEnd"]).concat('000')
			.concat(',"operation":"ONLOAD",')
			.concat(common);
		myJSONLoadData = myJSONLoadData.replace("replaceTiming", timingProperties);
		myJSONLoadData = myJSONLoadData.replace("replaceParentIds", activityIdPageRenderTime);
		loadPath = 'event';

		//alert(myJSONLoadData);
		stream (path, myJSONData);

		// ACTIVITY LEVEL

		if (position == "n/a")
		{
			activityCommon = activityCommon.replace("replacelat",0);
			activityCommon = activityCommon.replace("replacelon",0);
		}
		else
		{
			activityCommon = activityCommon.replace("replacelat",position.coords.latitude);
			activityCommon = activityCommon.replace("replacelon",position.coords.longitude);
		}

		// First Byte Time
		timingProperties = '{"name": "timingStart","type": "string","value":"navigationStart"},{"name": "timingEnd","type": "string","value":"responseStart"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdFirstByteTime)
		.concat('","start-time-usec":').concat(navigationStart)
		.concat('000,"end-time-usec":').concat(responseStart).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"FIRST_BYTE_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdEndUserResponseTime);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Document Ready Time
		timingProperties = '{"name": "timingStart","type": "string","value":"responseStart"},{"name": "timingEnd","type": "string","value":"domComplete"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdDocumentReadyTime)
		.concat('","start-time-usec":').concat(responseStart)
		.concat('000,"end-time-usec":').concat(domComplete).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"DOCUMENT_READY_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdFrontEndTime);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Response Available Time
		timingProperties = '{"name": "timingStart","type": "string","value":"requestStart"},{"name": "timingEnd","type": "string","value":"responseStart"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdResponseAvailableTime)
		.concat('","start-time-usec":').concat(requestStart)
		.concat('000,"end-time-usec":').concat(responseStart).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"RESPONSE_AVAILABLE_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdFirstByteTime);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Server Connection Time
		timingProperties = '{"name": "timingStart","type": "string","value":"navigationStart"},{"name": "timingEnd","type": "string","value":"requestStart"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdServerConnectionTime)
		.concat('","start-time-usec":').concat(navigationStart)
		.concat('000,"end-time-usec":').concat(requestStart).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"SERVER_CONNECTION_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdFirstByteTime);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Document Download Time
		timingProperties = '{"name": "timingStart","type": "string","value":"responseStart"},{"name": "timingEnd","type": "string","value":"responseEnd"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdDocumentDownLoadTime)
		.concat('","start-time-usec":')
		.concat(responseStart).concat('000,"end-time-usec":').concat(responseEnd).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"DOCUMENT_DOWNLOAD_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdDocumentReadyTime);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Document Processing Time
		timingProperties = '{"name": "timingStart","type": "string","value":"responseEnd"},{"name": "timingEnd","type": "string","value":"domComplete"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdDocumentProcessingTime)
		.concat('","start-time-usec":').concat(responseEnd)
		.concat('000,"end-time-usec":').concat(domComplete).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"DOCUMENT_PROCESSING_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdDocumentReadyTime);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Page Render Time
		timingProperties = '{"name": "timingStart","type": "string","value":"domComplete"},{"name": "timingEnd","type": "string","value":"loadEventEnd"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdPageRenderTime)
		.concat('","start-time-usec":').concat(timings["domComplete"])
		.concat('000,"end-time-usec":').concat(timings["loadEventEnd"]).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"PAGE_RENDER_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdFrontEndTime);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Summary
		timingProperties = '{"name": "END_USER_RESPONSE_TIME","type": "int","value":"'
				.concat(timings["loadEventEnd"] - timings["navigationStart"])
				.concat(
						'"},{"name": "FRONT_END_TIME","type": "int","value":"')
				.concat(timings["loadEventEnd"] - timings["responseStart"])
				.concat(
						'"},{"name": "PAGE_RENDER_TIME","type": "int","value":"')
				.concat(timings["loadEventEnd"] - timings["domComplete"])
				.concat(
						'"},{"name": "DOCUMENT_PROCESSING_TIME","type": "int","value":"')
				.concat(timings["domComplete"] - timings["responseEnd"])
				.concat(
						'"},{"name": "DOCUMENT_DOWNLOAD_TIME","type": "int","value":"')
				.concat(timings["responseEnd"] - timings["responseStart"])
				.concat(
						'"},{"name": "SERVER_CONNECTION_TIME","type": "int","value":"')
				.concat(timings["requestStart"] - timings["navigationStart"])
				.concat(
						'"},{"name": "RESPONSE_AVAILABLE_TIME","type": "int","value":"')
				.concat(timings["responseStart"] - timings["requestStart"])
				.concat(
						'"},{"name": "DOCUMENT_READY_TIME","type": "int","value":"')
				.concat(timings["domComplete"] - timings["responseStart"])
				.concat(
						'"},{"name": "FIRST_BYTE_TIME","type": "int","value":"')
				.concat(timings["responseStart"] - timings["navigationStart"])
				.concat('"}');
		myJSONData = '{"tracking-id":"'.concat(activityIdSummary)
		.concat('","start-time-usec":').concat(timings["navigationStart"]).concat('000,"end-time-usec":').concat(timings["loadEventEnd"]).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"EUM_SMRY",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace('"parent-id":"replaceParentIds",','');
		myJSONData = myJSONData.replace(',' + rid,'');
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// End User Response Time
		timingProperties = '{"name": "timingStart","type": "string","value":"navigationStart"},{"name": "timingEnd","type": "string","value":"loadEventEnd"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdEndUserResponseTime)
		.concat('","start-time-usec":').concat(timings["navigationStart"])
		.concat('000,"end-time-usec":').concat(timings["loadEventEnd"]).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"END_USER_RESPONSE_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdSummary);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		// Front End Time
		timingProperties = '{"name": "timingStart","type": "string","value":"responseStart"},{"name": "timingEnd","type": "string","value":"loadEventEnd"}';
		myJSONData = '{"tracking-id":"'.concat(activityIdFrontEndTime)
		.concat('","start-time-usec":').concat(timings["responseStart"])
		.concat('000,"end-time-usec":').concat(timings["loadEventEnd"]).concat('000')
		.concat(',"time-usec":').concat(now).concat('000')
		.concat(',"operation":"FRONT_END_TIME",')
		.concat(activityCommon);
		myJSONData = myJSONData.replace("replaceTiming", timingProperties);
		myJSONData = myJSONData.replace("replaceParentIds", activityIdEndUserResponseTime);
		path = 'activity';
		//alert(myJSONData);
		stream (path, myJSONData);

		var perfEntries = window.performance.getEntriesByType("mark");
		for (var i = 0; i < perfEntries.length; i++) {

			var prefix = perfEntries[i].name.substring(0, perfEntries[i].name
					.indexOf("_"));

			if (prefix.length > 0 && prefix == "start") {
				var suffix = perfEntries[i].name.substring(perfEntries[i].name.indexOf("_"), perfEntries[i].name.length);
				var start = window.performance.getEntriesByName('start' + suffix);
				var end = window.performance.getEntriesByName('end' + suffix);
				var measure = window.performance.getEntriesByName('measure' + suffix);
				
				if (start.length == end.length && end.length == measure.length)
				{
					for (var j = 0; j < start.length; j++) {
					{
						timingProperties = '{"name": "timingStart","type": "string","value":"markStart"},{"name": "timingEnd","type": "string","value":"markEnd"}';
						var myJSONAjaxData = '{"start-time-usec":'.concat(Math.round(((timings["navigationStart"] * 1000) + start[j].startTime)))
						.concat(',"end-time-usec":').concat(Math.round(((timings["navigationStart"] * 1000) + end[j].startTime)))
						.concat(',"elapsed-time-usec":').concat(Math.round(measure[j].duration))
						.concat(',"operation":"' + suffix + '",')
						.concat(common);
						myJSONAjaxData = myJSONAjaxData.replace("replaceTiming",timingProperties);
						myJSONAjaxData = myJSONAjaxData.replace(',"parent-id":"replaceParentIds"','');
						var ajaxPath = 'event';
						//alert(myJSONAjaxData);
						stream (ajaxPath, myJSONAjaxData);
					
				}
			}
		}

	}
	performance.clearMarks();
	performance.clearMeasures();
} 
  
window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {

	if (errorMsg.indexOf('Script error.') > -1) {
		return;
	} else {
		
		jsErrorMsg = errorMsg;
		var start = url.lastIndexOf('/');
		var end = url.lastIndexOf('?');
		jsErrorLocation = url.substring(start+1, end).concat(':').concat(lineNumber);
		//navigator.geolocation.getCurrentPosition(reportError);
		reportError("n/a")
		
		
	}
}


function reportError(position) {
	  var data = common.slice(0, common.length);
	  var replaceResource = data.substring(data.indexOf('"resource"'),data.indexOf(',"severity"'));
	  if (position == "n/a")
	  {
		data = data.replace("replacelat",0);
		data = data.replace("replacelon",0);
	  }
	  else
	  {
	  	data = data.replace("replacelat",position.coords.latitude);
	  	data = data.replace("replacelon",position.coords.longitude);
	  }
	  timingProperties = '{"name": "timingStart","type": "string","value":"errorTimeStart"}';
	  var myJSONErrorData = '{"tracking-id":"'.concat(createGuid())
	    .concat('","start-time-usec":').concat(now).concat('000')
	    .concat(',"msg-text":"').concat(jsErrorMsg).concat('"')
	    .concat(',"operation":"JAVASCRIPT_ERROR",')
	    .concat(data);
	  myJSONErrorData = myJSONErrorData.replace("replaceTiming", timingProperties);
	  myJSONErrorData = myJSONErrorData.replace(replaceResource,'"resource":SERVICE="' + jsErrorLocation + '"');
	  myJSONErrorData = myJSONErrorData.replace(',"parent-id":"replaceParentIds"','');
	  myJSONErrorData = myJSONErrorData.replace(',"severity:INFO":"severity:ERROR"','');

	  //alert(myJSONErrorData);
	  errorPath = 'event';
	  stream(errorPath,myJSONErrorData);
	}}  // End

function afterLoadMeasure(name, properties, message, suffix, severity)
{
	var start = window.performance.getEntriesByName('start_' + suffix);
	var end = window.performance.getEntriesByName('end_' + suffix);
	var measure = window.performance.getEntriesByName('measure_' + suffix);
	var myJSONAjaxData = '{"start-time-usec":'.concat(Math.round(((Date.now() * 1000) + start[0].startTime)))
	.concat(',"end-time-usec":').concat(Math.round(((Date.now() * 1000) + end[0].startTime)))
	.concat(',"elapsed-time-usec":').concat(Math.round(measure[0].duration))
	.concat(',"msg-text":"').concat(message).concat('"')
	.concat(',"operation":"' + name + '",')	
	.concat(common);
	myJSONAjaxData = myJSONAjaxData.replace("replaceTiming",properties);
	myJSONAjaxData = myJSONAjaxData.replace('replaceParentIds',activityIdEndUserResponseTime);
	myJSONAjaxData = myJSONAjaxData.replace("#GEOADDR=replacelat,replacelon","");
	myJSONAjaxData = myJSONAjaxData.replace('"severity":"INFO"','"severity":"' + severity + '"');
	var ajaxPath = 'event';
	//alert(myJSONAjaxData);
	stream (ajaxPath, myJSONAjaxData);
	performance.clearMarks('start_' + suffix);
	performance.clearMarks('end_' + suffix);
	performance.clearMeasures('measure_' + suffix);
}}
