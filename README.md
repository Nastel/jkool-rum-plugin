# jKool Real-User Monitoring & Tracking for Web Apps

jKool is happy to offer you a very simple and easy to use plug-in that you can use to monitor your end-user experience & engagement for web apps. This plugin will gather performance metrics, usability and stream them to jKool. When you login to your jKool repository you will see these metrics by simply clicking on a ready-made End-User Monitoring Dashboard. You will also have the ability to create your own views of the end user data by creating your own viewlets. Please follow these simple instructions to get setup using the plugin in just a few minutes. If you encounter any difficulty please don't hesitate to contact us at support@jkoolcloud.com.

###Import the plugins.
Into the web application you wish to monitor, import `jkool-rum-plugin.js` and either `jkool-rum-plugin.jsp` (if using javascript) or `jkool-rum-plugin.php` (if using php).

###Import jquery libraries 
These libraries can be obtained at http://jquery.com/download/

###Update the User-defined fields in the javascript plugin (`jkool-rum-plugin.js`)
Please note that you will receive your jKool token when you register for jKool.
```java
// User fills in these variables.
var token = "your jKool token here"; 
var appl = "your application name here";
var dataCenter = "your data center name here";
```

###Include the plugins in your project

* Include the jsp or php plugin on every page you wish to track within the form tag.
```java
<%@ include file="jkool-rum-plugin.jsp" %>
```
or
```java
<?php include "/inc/jkool-rum-plugin.php"; ?>
```

* Also include the javascript plugin to every page you wish to track.  
```java
<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>
```
###To get performance metrics on javascript functions

Including the plugins will meaure your overall site performance (i.e. page load time, redirect time, connect time, domain lookup time, request and response time, etc.). If you wish more fine-grained measuring of javascript functions, please do the following:

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
afterLoadMeasure(<name>, <custom properties>, <custom message>, <descriptive name>, <SUCCESS or ERROR>)

Where:
<name> - the name of the custom event of type string
<custom properties> - your custom fields you would like to report on. Each field should be in the following format and be of type string: {"name": "<name value>","type": <type value>,"value":"<value value>"},...
<custom message> - a custom message for your event of type string
<descriptive name> - the name of the mark/measure (from above)
<ERROR> if you are reporting an error event, <SUCCESS> otherwise.
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
	afterLoadMeasure('FunctionABCEvent', properties, 'Function ABC Message', 'processJavascriptFunctionABC, 'SUCCESS'); 
}
```

###Obfuscate

We strongly recommend that you obfuscate this file prior to releasing it into a production environment, because your jKool API access token is embedded in the javascript RUM plugin. A good obfuscation tool can be found here:

http://yui.github.io/yuicompressor/

###View End-User Analytics	
		
Your website is now setup to monitor end users. When a user hits a page, data will be posted to your repository in jKool via Restful Webservices.

Logon to your jKool Dashboard. On the upper-right hand side, you will see a button labeled "EUM". Click on this button to see various
charts displaying your end user data. You may also create your own viewlets. Click on the Tutorial and learn to create your own viewlets.
