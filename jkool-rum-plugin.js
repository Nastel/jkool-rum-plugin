    if ( ('performance' in window)            &
         ('timing' in window.performance)     &
         ('navigation' in window.performance)
    )  
    {
          //window.addEventListener('load', function() {
          var timings = window.performance.timing;
          var myJSONData = "hello";
          var path;
          var url = window.location.href;
          //var appl = url.substring(url.indexOf(":"), url.length);
          var appl = "myAppl";
          var server = "myServer";
          var loc = "myLoc";
          //var address = url.substring(url.indexOf("http:\\"), url.indexOf(":"));
          var address = "myAddress";
          var dataCenter = "myDataCenter";
          var navigationStart;
          var redirectStart;
          var redirectEnd;
          var fetchStart;
          var domainLookupStart;
          var domainLookupEnd;
          var connectStart;
          var unloadEnd;
          
          for (var timing in timings) 
          {
              if (timing == "navigationStart") 
            	 navigationStart = timings[timing]  
              else if (timing == "redirectStart") 
            	 redirectStart = timings[timing] 
              else if (timing == "unloadEventEnd")
            	  unloadEnd = timings[timing] ;
              else 
              {
            	  //
              }
          }
              myJSONData = '{"status":"END","start-time-usec":'
            	.concat(navigationStart)
            	.concat('"end-time-used:"')
            	.concat(unloadEnd)
            	.concat(',"elapsed-time":')
            	//.concat(Number(navigationEnd) - Number(navigationEnd))
            	.concat('","operation":"navigationStart","source_fqn":"APPL=')
            	.concat(appl)
            	.concat('#SERVER=')
            	.concat(server)
            	.concat('#NETADDR=')
            	.concat(address)
            	.concat('#DATACENTER=')
            	.concat(dataCenter)
            	.concat('#GEOADDR=')
            	.concat(loc)
            	.concat('"}');		
              path = 'activity';
              alert (navigationEnd);
              alert(myJSONData);
    		/* $.ajax({
                	type: 'POST',
                	url: 'http://localhost:6580/JESL/'.concat(path),
                	data: myJSONData,
                    dataType: 'text',
               		headers:{'token':'775d182c-fb54-4eb1-be58-1153ce2d7865'},
            		  });   
          

	      var perfEntries = window.performance.getEntriesByType("mark");
          for (var i = 0; i < perfEntries.length; i++)
          {
        	  var myJSONData = '{"tracking-id":"51191015-1783-4f63-b91e-7e17e8e33333","status":"END","time-usec":"1444679553236000","operation":"Performance","source_fqn":"APPL=WebOrders#SERVER=WebServer100#NETADDR=11.0.0.2#DATACENTER=DC1#GEOADDR=New York, NY"}';		
    		  $.ajax({
                	type: 'POST',
                	url: 'http://localhost:6580/JESL/activity',
                	data: myJSONData,
                    dataType: 'text',
               		headers:{'token':'775d182c-fb54-4eb1-be58-1153ce2d7865'},
               		success: function(data) { 
       				   alert(data);
             		}, 
    			    error: function(jqXHR, textStatus, errorThrown) { 
            			alert("HelloStatus: " + textStatus); alert("HelloError: " + errorThrown); 
    			    }, 
    			    statusCode: {
        			    202: function() {
          			      alert( "Request accepted.")}}
            		  });   
          }

    })*/
    }


