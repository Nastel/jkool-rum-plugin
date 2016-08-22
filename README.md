# jKool Real-User Monitoring & Tracking for Web Apps

jKool is happy to offer a simple and easy to use plug-in that you can use to monitor end-user experience & engagement for your web apps. This plugin gathers performance, usability, errors, clicks and stream them to your jKool account. When you register and login to your jKool repository (https://www.jkoolcloud.com) you will see end-user analytics by simply clicking on End-User Monitoring Dashboard. You will also have the ability to create your own views of the end user data by creating your own viewlets. Please follow instructions below to setup jKool RUM, which should only take a few minutes. If you encounter any difficulty please don't hesitate to contact us at support@jkoolcloud.com.

###Import the plugins.
Into the web application you wish to monitor, import `jkool-rum-plugin.js` and either `jkool-rum-plugin.jsp` (if using javascript) or `jkool-rum-plugin.php` (if using php).

###Import jquery libraries 
These libraries can be obtained at http://jquery.com/download/

###Add the following code in to the head section of the web pages you wish to monitor
Please note that you will receive your jKool token when you register for jKool.
```java
<script>
window["token"] = "Your Token";
window["appl"] = "Your Application Name";
window["dataCenter"] = "Your Data Center Name"
</script>
```

###Include the plugins in your project

* Include the jsp or php plugin on every page you wish to track within the form tag.
```java
<%@ include file="jkool-rum-plugin.jsp" %>
```
```java
<?php include "/inc/jkool-rum-plugin.php"; ?>
```

* Also include the javascript plugin to every page you wish to track.  It needs to be included after the jsp plugin.
```java
<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>
```

### Automatic Injection for Apache Web Server
If you don't wish to instrument every page of your webapp, you can have Apache automatically inject the code for you. Simply do the following:
* Add the following to httpd.conf:
```
LoadModule substitute_module modules/mod_substitute.so
LoadModule filter_module modules/mod_filter.so
```
* Create a file called jkool-plugin.conf as follows:
```
<Location/>
AddOutputFilterByType SUBSTITUTE text/html
Substitute "s|<head>|<head>
<script type="text/javascript" src="/js/jquery.min.1.7.2.js"></script><script>window["token"] = "<your-token>";window["appl"] = "<your-application-name>";window["dataCenter"] = "<your-data-center>"</script>|in"
Substitute "s|</form>|<%@ include file="jkool-rum-plugin.jsp" %></form><script src="/js/jkool-rum-plugin.js" type="text/javascript"></script>|in"
</Location>
```
The above is for Apache 2.4. If running Apache 2.2, you will need to also add this line of code:
```
SetOutputFilter INFLATE;SUBSTITUTE;DEFLATE 
```

* Add the location of this file to httpd.conf by adding the following:
```
Include [path]/jkool-plugin.conf
```
* Restart Apache

### Automatic Injection for IIS
If you don't wish to instrument every page of your webapp, you can have IIS automatically inject the code for you. Simply do the following:
* Install URL Rewrite from here http://www.iis.net/download/urlrewrite
* Open IIS Manager, click on your site and then open the URL Rewrite feature
* In the Outbound Rule section click View Preconditions and the Add to add a new condition called IsHTML. The condition need check {RESPONSE_CONTENT_TYPE} matches the pattern “^text/html”. This is so that we only insert our JavaScript code into HTML and not into any other content type.
* Add an Outbound rule called 'jKoolPlugin1'. This Outbound rule should check for our Precondition “IsHTML”, and then Match on a pattern ```<head>``` using an “Exact Match”. In the Action section we have a rewrite action which then rewrites ```<head>``` as:
``` java 
<head><script type="text/javascript" src="/js/jquery.min.1.7.2.js"></script><script>window["token"] = "<your-token>";window["appl"] = "<your-application-name>";window["dataCenter"] = "<your-data-center>"</script>
```
* Add another Outbound called jKoolPlugin2. The rule should check for our Precondition “IsHTML”, and then Match on a pattern ```</form>``` using an “Exact Match”. In the Action section we have a rewrite action which then rewrites ```</form>``` as:
``` java
<%@ include file="jkool-rum-plugin.jsp" %></form><script src="/js/jkool-rum-plugin.js" type="text/javascript"></script>
``` 
### Automatic Injection for Ngnix
If you don't wish to instrument every page of your webapp, you can have Ngnix automatically inject the code for you. Simply do the following:
* Install the ngx_htt_sub_module module http://nginx.org/en/docs/http/ngx_http_sub_module.html.
* Enable it with `--with-http_sub_module`
* The configuration for jKool Rum Plugin is as follows:
``` java
location / {
    sub_filter '<head>' '<head><script type="text/javascript" src="/js/jquery.min.1.7.2.js"></script><script>window["token"] = "<your-token>";window["appl"] = "<your-application-name>";window["dataCenter"] = "<your-data-center>"</script>';
    sub_filter '</form>' '<%@ include file="jkool-rum-plugin.jsp" %></form><script src="/js/jkool-rum-plugin.js" type="text/javascript"></script>';
    sub_filter_once on;
}
```

###To get performance metrics on javascript functions

Including the plugins will measure your overall site performance (i.e. page load time, redirect time, connect time, domain lookup time, request and response time, etc.). If you wish more fine-grained measuring of javascript functions, please do the following:

* Add the following code before and after the javascript you wish to measure.
```java
performance.mark("start_<descriptive name>");  
<javascript code being marked>
performance.mark("end_<descriptive name>");  
performance.measure('measure_<descriptive name>', 'start_<descriptive name>', 'end_<descriptive name>');
```
###If obtaining these metrics "after" the completion of the page load (i.e. Ajax)
In addition to the performance marks above, call the following plugin function ...
```java
afterLoadMeasure(<name>, <custom properties>, <custom message>, <descriptive name>, <INFO or ERROR>)

Where:
<name> - the name of the custom event of type string
<custom properties> - your custom fields you would like to report on. Each field should be in the following format and be of type string: {"name": "<name value>","type": <type value>,"value":"<value value>"},...
<custom message> - a custom message for your event of type string
<descriptive name> - the name of the mark/measure (from above)
<ERROR> if you are reporting an error event, <INFO> otherwise.
```

Here is an example:

```java
function FunctionABC()
{
	performance.mark("start_processJavascriptFunctionABC");
	...
	performance.mark("end_processJavascriptFunctionABC);  
	performance.measure('measure_processJavascriptFunctionABC, 'start_processJavascriptFunctionABC, 'end_processJavascriptFunctionABC);	
	var properties = '{"name": "ABCProperty1","type": "string","value":"hello"},{"name": "ABCPropery2","type": "integer","value":"10"}';	
	// Only if reporting after page load.
	afterLoadMeasure('FunctionABCEvent', properties, 'Function ABC Message', 'processJavascriptFunctionABC, 'INFO'); 
}
```

###Obfuscate

We strongly recommend that you obfuscate `jkool-rum-plugin.js` prior to releasing it into a production environment. A good obfuscation tool can be found here:

http://yui.github.io/yuicompressor/

###View End-User Analytics	
		
Your web application is now setup to monitor end users. When a user hits a page, data will be posted to your jKool repository via Restful.

Logon to your jKool Dashboard (https://www.jkoolcloud.com), click on "Dashboard". Once logged in, you will see a button labeled "EUM" on the upper-right hand side. Click on this button to see various charts displaying your end user data. You may also create your own viewlets. Click on the Tutorial and learn to create your own viewlets.
