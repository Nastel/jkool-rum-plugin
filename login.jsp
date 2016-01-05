<%@ page language="java" import="java.util.*,java.io.InputStream" pageEncoding="utf-8"%>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=10,chrome=1">
        <meta http-equiv="cache-control" content="no-cache">
        <!-- tells browser not to cache -->
        <meta http-equiv="expires" content="0">
        <!-- says that the cache expires 'now' -->
        <meta http-equiv="pragma" content="no-cache">
        <!-- says not to use cached stuff, if there is any -->
        <script src="js/lib/jquery.min.1.7.2.js" type="text/javascript"></script>
        <script src="js/constant.js" type="text/javascript"></script>
		<script src="js/defaultVariables.js" type="text/javascript"></script>
		<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>
		<script src="js/login.js" type="text/javascript"></script>
		<script src="js/lib/jstz-1.0.4.min.js" type="text/javascript"></script>
        <title>jKool</title>
        <link rel="shortcut icon" type="image/png" href="images/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2">
        <link href="css/Login.css" rel="stylesheet" type="text/css" />
        <script>
            /*	$(document).ready(function(){
             $("#forgotPass").click(function(){
             $("#LoginBox").hide();
             $("#forgotPassword").show();
             });
             });*/
            /* Managing password autofill */
            $(document).ready(function(){
                $('#Uname').empty();
                $('#PWD').empty();
                $('#PWD').focus(function(){
                    $(this).get(0).type='password';
                });
				var currentYear = (new Date).getFullYear();
				$("#currentYear").text(currentYear);

				var timezone = jstz.determine();
				var timeZoneName = timezone.name(); 

				//var date = new Date()
				//var offsetInMinutes = date.getTimezoneOffset();
				//var OffSetInSeconds = offsetInMinutes * 60;
				//var offSetInMilliSeconds = OffSetInSeconds * 1000;
				$("#timeZone").val(timeZoneName);
             });
            
            window.onload = function () {
                document.forms[0].reset();
                $("#repositoryID").val('UITEST4$jKoolDev');
                $('#appVersion').text(applicationProperties.applicationVersion);
                placeFocus();
            }
            function placeFocus() {
                document.forms[0].elements[0].focus(); // assuming the first element
            }
            //==========

            //Right Click disabled 
            $(document).bind('contextmenu', function (e) {
                e.preventDefault();
            });
            //==========

            $(function () {

                $("form input").keypress(function (e) {

                    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                        $('button[type=submit] .default').click();
                        authenticateUser();
                    }
                });
            });

            function authenticateUser() {
                var Uname = $('#Uname').val();
                var PWD = $('#PWD').val();
            }
          
        </script>
    </head>

    <body>
        <div id="container">
        <div id="LoginBoxContainer">
        <div id="LoginBox">
            <form name ="login" method = "post" action = "servlet/LoginServlet" id="myLoginForm">
                <div class="logo-div"><img src="images/jkool-logo-70.png" class="CompLogo" /></div>
                <!--<div class="Heading1">AutoPilot<sup>&reg;</sup> On-Demand Web</div>-->

                <div class="FrmField"><input type="text" placeholder="Login ID" name="Uname" id="Uname" class="username" required tabindex="1" autocomplete="off"/>

                </div>
                <div class="FrmField"><input type="text" placeholder="Password" name="PWD" id="PWD" class="password" required tabindex="2" autocomplete="off"/>

                </div>
                <%
                  if(session.getAttribute("errorDisplay")!=null){
                %><div class="FrmField" id="errorMSg" style="text-align:left; color:#fd1f1f">
		<%=session.getAttribute("errorDisplay")%></div><%
                   }
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
		String userName=(request.getRemoteUser() == null) ? "unknown" : request.getRemoteUser();
                %>
                <div class="UserInfoField"><input type="text" name="userInfoID" id="userInfoID"/>
				<input type="hidden" name="timeZone" id="timeZone"/>
				<input type="hidden" name="corrid" id="corrid" value="<%=id%>"/>
				<input type="hidden" name="username" id="username" value="<%=userName%>"/>
				<input type="hidden" name="ipaddress" id="ipaddress" value="<%=ipAddress%>"/></div>
                <div class="FrmField">
<!--                    <input type="submit" name="Submit"  class="BlkBtn submit-btn" id="Submit" value="Login"  tabindex="4"/>-->
                    <button type="submit" name="Submit"  class="BlkBtn submit-btn" id="Submit"  tabindex="4">Login</button>
                    &nbsp;<a id="forgotPass" href="http://www.jkoolcloud.com/signup/member/">Forgot Password ?</a>
                </div>

				<div id="signup">Not registered for jKool, yet? Sign up <a href="https://www.jkoolcloud.com/signup/signup/freetrial" target="_blank" style="color:#FF9900" >here</a> </div>


 <div class="policies">
 <a href="https://www.jkoolcloud.com/company/terms-conditions/" target="_blank"  >Terms of Service</a> &nbsp;|&nbsp;
<a href="https://www.jkoolcloud.com/company/privacy-policy/" target="_blank"   >Privacy Policy</a> <br>
By logging in you agree to these terms.
</div>

			
				 
                <% session.invalidate(); %>
            </form>
        </div>
        <div id="forgotPassword">
            <form name ="login" >
                <div class="logo-div"><img src="images/jkool-logo-70.png" class="CompLogo" /></div>
                <!--<div class="Heading1">AutoPilot<sup>&reg;</sup> On-Demand Web</div>-->

                <div class="FrmField"><input type="text" placeholder="Login Id" name="Uname" id="Uname" required tabindex="1"/>

                </div>
                <!--<div class="FrmField"><input type="password" placeholder="Password" name="PWD" id="PWD" required tabindex="2"/>
                 
                </div>-->
                <!--<div class="FrmField" id="errorMSg" style="text-align:left; color:#fd1f1f"></div>-->

                <div class="UserInfoField"><input type="text" name="userInfoID" id="userInfoID"/></div>
                <div class="FrmField"><input type="submit" name="Submit"  class="BlkBtn submit-btn" id="Submit" value="Submit"  tabindex="4"/>
                </div>


            </form>
        </div>
        <div class="FrmField versionLabel">
            Version <span id='appVersion'></span> | Copyright <span id="currentYear"></span> jKool, LLC | All Rights Reserved.
        </div>
        </div>
        </div>
        <div class="TransparentBg"></div>
        <script src="js/browserCompatibility.js" type="text/javascript"></script>
    </body>
</html>
