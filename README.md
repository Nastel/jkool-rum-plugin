# jKool Real-User Monitoring & Tracking for Web Apps

jKool is happy to offer you a very simple and easy to use plug-in that you can use to monitor your end-user experience for web apps. This plugin will gather performance metrics and stream them to jKool. When you login to your jKool repository you will see these metrics by simply clicking on a ready-made End-User Monitoring Dashboard. You will also have the ability to create your own views of the end user data by creating your own viewlets. Please follow these simple instructions to get setup using the plugin in just a few minutes. If you encounter any difficulty please don't hesitate to contact us at support@jkoolcloud.com.


###Import the plugins
In your javascript and jsp directories for the web application you wish to monitor, import jkool-rum-plugin.js and jkool-rum-plugin.jsp


###Import jquery libraries 
These libraries can be obtained at http://jquery.com/download/

###Update the User-defined fields in the plugin (jkool-rum-plugin.js)
Please note that you will receive your jKool token when you register for jKool.
```java
// User fills in these variables.
var token = "your jKool token here"; 
var appl = "your application name here";
var server = "your server name here";
var dataCenter = "your data center name here";
```

###For web pages running JavaScript

* Add the following jsp file to every page you wish to track
```java
<%@ include file="jkool-rum-plugin.jsp" %>
```

* Add the javascript file to every page you wish to track.  
Please be sure to add the javascript file after the jsp file. 
 
```java
<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>
```

###For web pages running PHP
* Add the following scriptlet

```java
<?php

function createGuid(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }
    else {
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = chr(123)// "{"
            .substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12)
            .chr(125);// "}"
        return $uuid;
    }
}

$id = NULL;    
if ($_SESSION["JK_CORR_SID"] == null)
	{
		$id = createGuid();
		$_SESSION["JK_CORR_SID"] = $id;
	}
	else
	{
		$id =  $_SESSION["JK_CORR_SID"];
	}
$rid = null;
$rid = createGuid();
$_SESSION["JK_CORR_RID"] = $rid;
$ipAddress = $_SERVER["X-FORWARDED-FOR"] ;
$usrName=($_SERVER["X-FORWARDED-FOR"] == null) ? "unknown" : $_SERVER["X-FORWARDED-FOR"];
if($ipAddress == NULL) {
	$ipAddress = $_SERVER["REMOTE_ADDR"] ; 
}
?>
```
* Add the following hidden fields
```java
<input type="hidden" name="corrid" id="corrid" value="<?=$id?>"/>
<input type="hidden" name="rcorrid" id="rcorrid" value="<?=$rid?>"/>
<input type="hidden" name="ipaddress" id="ipaddress" value="<?=$ipAddress?>"/>
<input type="hidden" name="username" id="username" value="<?=$usrName?>"/>
```

* Add the plugin.  
Please be sure to add the plugin after the hidden fields. 
 
```java
<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>
```

###To get performance metrics on javascript functions

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
		
Your website is now setup to monitor end users. When a user hits a page, data will be posted to your repository in jKool via Restful Webservices.

###View End-User Analytics	
Logon to your jKool Dashboard. On the upper-right hand side, you will see a button labeled "EUM". Click on this button to see various
charts displaying your end user data. You may also create your own viewlets. Click on the Tutorial and learn to create your own viewlets.
