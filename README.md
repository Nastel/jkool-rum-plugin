# jKool End-User Monitoring

###Import the plugin
In your javascript directory for the web application you wish to monitor, import jkool-rum-plugin.js

###Do the following in the pages you with to monitor

* Import - java.util.UUID
<%@ page ... import="java.util.*  ...%>
* Add the plugin 
```java
<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>
```

* Add the following scriptlet

```java
<%
String id = null;
if (session.getAttribute("JK_CORR_ID") == null)
{
		id = UUID.randomUUID().toString();
     	session.setAttribute("JK_CORR_ID", id);
}
else
{
    id = (String)session.getAttribute("JK_CORR_ID");
}
String ipAddress = request.getHeader("X-FORWARDED-FOR");  
if (ipAddress == null)
  ipAddress = request.getRemoteAddr();  
String userName=(request.getRemoteUser() == null) ? "unknown-user" : request.getRemoteUser();
%>
```
* Add the following hidden fields
```java
<input type="hidden" name="corrid" id="corrid" value="<%=id%>"/>
<input type="hidden" name="username" id="username" value="<%=userName%>"/>
<input type="hidden" name="ipaddress" id="ipaddress" value="<%=ipAddress%>"/>
```

* To get performance metrics on Ajax or javascript functions, do the following ...
```java
performance.mark("start_<descriptive name>");  
<javascript code being marked>
performance.mark("end_<descriptive name>");  
performance.measure('measure_<descriptive name>', 'start_<descriptive name>', 'end_<descriptive name>');
```