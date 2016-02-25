# jKool End-User Monitoring

###Import the plugin
In your javascript directory for the web application you wish to monitor, import jkool-rum-plugin.js


###Import jquery libraries 
These libraries can be obtained at http://jquery.com/download/

###Update the User-defined fields in the plugin
Please note that you will receive your jKool token when you register for jKool.
```java
// User fills in these variables.
var token = "your jKool token here"; 
var appl = "your application name here";
var server = "your server name here";
var dataCenter = "your data center name here";
```

###Do the following in the pages you with to monitor

* Import java.util.UUID
```java
<%@ page ... import="java.util.*  ...%>
```

* Add the plugin 
```java
<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>
```

* Add the following scriptlet

```java
 <%  
	  String id = null;
	  if ((String)session.getAttribute("JK_CORR_SID") == null)
	  {
	  		id = UUID.randomUUID().toString();
	       	session.setAttribute("JK_CORR_SID", id);
	  }
	  else
	  {
	      id = (String)session.getAttribute("JK_CORR_SID");
	  }
	  String rid = null;
      rid = UUID.randomUUID().toString();
      session.setAttribute("JK_CORR_RID", rid);

	  String usrName=(session.getAttribute("userName") == null) ? "unknown" : session.getAttribute("userName");
	  String ipAddress = request.getHeader("X-FORWARDED-FOR");  
	  if (ipAddress == null)
	     ipAddress = request.getRemoteAddr();  
%>
```
* Add the following hidden fields
```java
<input type="hidden" name="corrid" id="corrid" value="<%=id%>"/>
<input type="hidden" name="rcorrid" id="rcorrid" value="<%=rid%>"/>
<input type="hidden" name="ipaddress" id="ipaddress" value="<%=ipAddress%>"/>
<input type="hidden" name="username" id="username" value="<%=usrName%>"/>
```

* To get performance metrics on Ajax or javascript functions, do the following ...
```java
performance.mark("start_<descriptive name>");  
<javascript code being marked>
performance.mark("end_<descriptive name>");  
performance.measure('measure_<descriptive name>', 'start_<descriptive name>', 'end_<descriptive name>');
```

Your website is now setup to monitor end users. When a user hits a page, data will be posted to your repository in jKool via Restful Webservices.

###Logon to jKool to see you end-user monitoring data	
Logon to your jKool Dashboard. On the upper-right hand side, you will see a button labeled "EUM". Click on this button to see various
charts displaying your end user data. You may also create your own viewlet. Please do the Dashboard tutorial to see how to use JKQL to create your own viewlets.