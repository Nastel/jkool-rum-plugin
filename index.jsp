<%@page import="org.apache.catalina.tribes.tipis.AbstractReplicatedMap.MapEntry"%>
<%@page import="com.sun.org.apache.bcel.internal.generic.AALOAD"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.util.*"%>
<!DOCTYPE html>
<html>
    <head>
        <title>jKool</title>
        <link rel="shortcut icon" type="image/png" href="images/favicon.png" />
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=10,chrome=1">
        <%  
                session.setAttribute("repositoryID", request.getParameter("repoId"));
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
        <!--Include all common header files-->
        <link rel="stylesheet" type="text/css" href="css/defaultStyle.css"/>
        <style>
            body{
                background: #000000 !important;
            }
            /*Hide Elements to show blank screen bfre loading*/
            .appLogo,.datetimeForTopBar,.topUsernameBar,#pageContainer,.headerDivParentContainer{
                display:none;
            }
        </style>
<script>

var socket;

 var serverAddr = <%= "'"+session.getAttribute("serverAddr")+"'" %>;
 socket = new WebSocket(serverAddr);

//socket = new WebSocket("ws://localhost:8888/jKool/actions");

</script>

    </head>
    <body>
        <div id="defaultLoader" class="loadingDivTransparent"></div>
        <form id="appForm" name="appForm" method="post">

            <iframe id="zoomDetectFrame" style="width:0px; height:0px; border:  0px solid red;" ></iframe>
            <input type="hidden" value="" name="Param" id="Param"/>
            <input type="hidden" value="" name="DateRangeId" id="DateRangeId"/>
            <input type="hidden" value="" name="fileName" id="fileName"/>
            <input type="hidden" value="" name="exportItemType" id="exportItemType"/>
            <input type="hidden" name="corrid" id="corrid" value="<%=id%>"/>
			<input type="hidden" name="username" id="username" value="${sessionScope.username}"/>
			<input type="hidden" name="ipaddress" id="ipaddress" value="<%=ipAddress%>"/>

            <div class="outer-center" id="mainPanel">    <!-- Start of outer-center(mainPanel) div-->
                <div class="mid-north pageHeader">   <!-- Start of mid-north div-->
                     <div class="appTitle">jKool</div>
                     <div class="appLogo" onClick="openjKoolCloud()"></div>  <!-- used to diplay logo on top-left corner of page-->
                      <!--header parent div controls-->  
                     <div class="headerDivParentContainer">

                        <div class="tutorials-collector-container">
                           <div onClick="helpMenuIcon();" class="tutorialBtn">Tutorial <span><img src="images/help2.png" ></span></div>
                            <div onClick="window.open('https://www.jkoolcloud.com/product/technology/#Connectors','_blank');" class="getcollectorsBtn">Collectors <span><img src="images/get_collector.png" ></span></div>
                        </div>

                         <div class="repo-container">
                             <div id="loggedinRepository" class="username" title="Loggedin Repository"></div>  
                        </div> 

                         <div class="username-container">
                            <!-- used to display repository list and user-name on top-right corner of page-->   
                            <div id="loggedinUserName" class="username" title="User Name"></div>
                        </div>


                          <!--setting and log out-->  
                          <div class="setting-logout-container"> 
                          <!-- used to display help, setting and logout icon on top-right corner of page-->
                            <ul>  
                                <li> <a href="#" > <img src="images/setting-icon-top.png"  onClick="dashboardSettingPopup()" title="Settings"> </a> </li>
                                <li> <a href="#" style="border-left:1px solid #ccc;"><img src="images/user-logout-icon.png"   onClick="logoutUser()" title="Logout"> </a></li>
                            </ul>
                        </div>

                        <!--2nd row in header-->
                        <div class="secondRow-container">
                                <!-- displays application level menu -->
                               <div class="mytest">
                                    <div class="currentDateTimeOnDashboard rangeBoxOnDashboard" id="currentDateTimeOnDashboard" 
                                    title="Current Date">This Hour</div>
                                </div>
                               <div class="currentDateTimeOnDashboard" style="border:0; font-size:11px; line-height: 11px;"></div>
                        <!--end of 2nd row-->    
                        </div>
                         <div id='topMenu'></div>  
                     </div>

                </div>  <!-- End of mid-north div-->

                <div class="mid-center" id="pageContainer"> <!-- Start of mid-center div-->
                        <ul class="tabs-header" id="pageContainer-tabs"></ul>  <!--contains only dashboard tabs-->
                        <div class="tabsHeaderLeftRightArrowG">
                            <div id="rightArrow" class="firstArrow" title="First" ></div>
                            <div id="right" class="rightArrow" title="Left" ></div>
                            <div id="left" class="leftArrow" title="Right" ></div>
                            <div id="leftArrow" class="lastArrow" title="Last" ></div>
                        </div>

                    <div id="app-top-sidebar" >
                            
                            <div class="helpWizardButton blue" id="createViewletMainWindow" onClick="openCreateViewlet()" title="Create Viewlet">Viewlet <span><img src="images/plus-white-icon.png"></span></div>  
                            
                            <div class="importData lightGreen" id="importDataBtn" onClick="importData()" title="Import Data">Import <span><img src="images/import-icon.png"></span></div>  
                            

                            <!--<div class="importData" id="importDataBtn" onClick="importData()" title="Import Data"><span><img src="images/importdata-btn.png"></span></div>              -->
                            

                        </div>  
                        
                    <div class="tabs-panels"></div>  <!--contains dashboard tab body-->

                    <div id="customMenu" style="display:none"> <!--used to display context-menu on right click of dashboard tabs-->
                        <ol>
                            <li typeAcr='SAV'>Save</li>
                            <li typeAcr='SVA'>Save As</li>
                            <li typeAcr='SAD'>Set As Default</li>
                            <li typeAcr='CFD'>Change layout</li>
                        </ol>
                    </div>

                </div>  <!-- End of mid-center div-->
                <div class="TransparentMenuBg"></div>
            </div>  <!-- End of outer-center(mainPanel) div-->

            <div class="outer-south" id="consolePanel"> <!--console panel container-->
                <div class="TransparentMenuBg"></div>
            </div>

            <!--This code does not belongs to layout structure ===== start-->
            <div class="contextMenu" id="myMenu1" style="display:none">
                <ul style="width: 250px; padding:0px;">
                    <li id="compTable"> <span style="font-size:11px; font-family:Verdana">Compare as Table</span> </li>
                    <li id="compColChart"> <span style="font-size:11px; font-family:Verdana">Compare as Column Chart</span> </li>
                    <li id="compBarChart"> <span style="font-size:11px; font-family:Verdana">Compare as Bar Chart</span> </li>
                    <li id="compLineChart"> <span style="font-size:11px; font-family:Verdana">Compare as Line Chart</span> </li>
                    <li id="showSnapshot"> <span style="font-size:11px; font-family:Verdana">Show Snapshot</span> </li>
                    <li id="showPieChart"> <span style="font-size:11px; font-family:Verdana">Show Severities</span> </li>
                    <li id="showTopology"> <span style="font-size:11px; font-family:Verdana">Show Topology</span> </li>
                </ul>
            </div>
            <div class="contextMenu" id="myMenu2" style="display:none">
                <ul style="width: 250px; padding:0px;">
                    <li id="showEvent"> <span style="font-size:11px; font-family:Verdana">Show Event</span> </li>
                    <li id="compTable"> <span style="font-size:11px; font-family:Verdana">Compare Activity as Table</span> </li>
                    <li id="compActEventTable"> <span style="font-size:11px; font-family:Verdana">Compare ActivityEvent as Table</span> </li>
                    <li id="compColChart"> <span style="font-size:11px; font-family:Verdana">Compare as Column Chart</span> </li>
                    <li id="compBarChart"> <span style="font-size:11px; font-family:Verdana">Compare as Bar Chart</span> </li>
                    <li id="compLineChart"> <span style="font-size:11px; font-family:Verdana">Compare as Line Chart</span> </li>
                </ul>
            </div>
            <div class="contextMenu" id="myMenu3" style="display:none">
                <ul style="width: 250px; padding:0px;">
                    <li id="showSeverityEvent"> <span style="font-size:11px; font-family:Verdana">Show Details</span> </li>
                </ul>
            </div>


            <div class="TransparentBg"></div>
            <a href="" id="dummyLink"></a>

        </form>
        <input type='hidden' id='exportButton' value='Display Dialog'/>
        <!--<div id='YourDialog' style="display:none">
            Please choose Export Type : <br />
            <input name='choice' type='radio' value='png' checked >PNG<br />
            <input name='choice' type='radio' value='csv'>CSV
            
          </div>    -->
        <!--This code does not belongs to layout structure ===== end-->
        <!--Code for filters to implement hover in topology -->
        <svg>
        <defs>
    <filter id="dropshadow" x="0" y="0" width="100%" height="100%">
        <feOffset result="offOut" in="SourceAlpha" dx="3" dy="3"> </feOffset>
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10"> </feGaussianBlur>
        <feBlend in="SourceGraphic" in2="offOut" mode="normal"> </feBlend>
    </filter>
    </defs>

    <defs>
    <filter id="dropshadow2" x="0" y="0" width="200%" height="200%">
        <feOffset result="offOut" in="SourceGraphic" dx="5" dy="5" ></feOffset>
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" ></feGaussianBlur>
        <feBlend in="SourceGraphic" in2="offOut" mode="normal" ></feBlend>
    </filter>
    </defs>

    </svg>


    <%@ include file="header.jsp" %>

    <!--Only init.js need to be included here-->
    <script type="text/javascript" src="js/init.js?v=<%=FileRandomVar%>"></script>
		<script src="js/lib/jkool-rum-plugin.js" type="text/javascript"></script>

    <script type="text/javascript">
        var outerLayout;
        $(document).ready(function () {

            var screenHeight = $(window).height();
            var southSize = ((screenHeight / 100) * parseInt(HEIGHT_OF_CONSOLE_PERCENTAGE));
            // OUTER-LAYOUT
            outerLayout = $('body').layout({
                enableCursorHotkey: false
                , center__paneSelector: ".outer-center"
                , south__paneSelector: ".outer-south"
                , spacing_open: 19  // ALL panes
                , spacing_closed: 19 // ALL panes
                , south__initClosed: true
                , south__size: southSize
                        //, south__maxSize:         300
                , south__onclose: function () {
                    $('.ui-layout-toggler-south').attr('title', 'Show');
                    consoleChange('close');
                }
                , south__onresize: function () {
                    consoleChange('resize');
                }
                , south__onopen: function () {




                                            $('.ui-layout-toggler-south').attr('title', 'Hide');
                                            setTimeout(function () {
                                                //Code for applying scroll for dashboard tabs
                                                var tabDivId = currentDashboardID + '-tabs';
                                                var $tabUL = $('#' + tabDivId);
                                                var $tabs = tabSettings[tabDivId].tabInstance;
                                                tabSettings[tabDivId].totalTab = $('li', $tabUL).length;
                                                var tmpULWidth = tabSettings[tabDivId].totalTab * tabSettings[tabDivId].tabWidth;
                                                if (tmpULWidth < windowWidth)
                                                    tmpULWidth = windowWidth;
                                                //              $tabs.trigger('tabMaxLeft');
                                                fnTabMaxLeft(tabDivId);
                                                $tabUL.css('width', (tmpULWidth) + 'px');

                        var activeTab = $tabs.tabs("option", "active");
                        //alert(activeTab);
                        var ulLeft = $tabUL.position().left;
                        if (ulLeft > 20)
                            $tabUL.css('left', '20px');
                        else if (ulLeft < 0)
                        {
                            if ((tmpULWidth + ulLeft) < windowWidth)
                                $tabUL.css('left', '20px');
                        }
                        fnSelectTab($tabUL, activeTab, tabDivId);

                        /*
                         if($tabUL.position().left < 0){
                         $tabUL.css('width', (tmpULWidth) + 'px');
                         tabRightClick(tabDivId);
                         }else if($tabUL.position().left > (tabSettings[tabDivId].maxLeft)){
                         $tabUL.css('width', (tmpULWidth) + 'px');
                         tabLeftClick(tabDivId);
                         }*/
                        if (tabSettings[tabDivId].totalTab == 1) {
                            $tabUL.animate({
                                left: tabSettings[tabDivId].maxLeft
                            }, 300, function () {
                                showArrow(tabDivId);
                            });
                        }

                        $tabs.tabs('refresh');

                        //var scrViewlet = $('#tabPanel_'+currentDashboardIndex+' .tabs-header .ui-tabs-active strong').text();
                        var scrViewlet = $('#tabPanel_' + currentDashboardID + ' .tabs-header .ui-tabs-active strong').text();
                        //scrViewlet = scrViewlet.substring(scrViewlet.indexOf('_',scrViewlet.indexOf(currentDashboardIndex))+1,scrViewlet.indexOf('content'));
                        scrViewlet = scrViewlet.substring(scrViewlet.indexOf('_', scrViewlet.indexOf(currentDashboardID)) + 1, scrViewlet.indexOf('content'));
                        scrollToDiv(scrViewlet);
                        //$('#tabPanel_'+currentDashboardIndex+' .tabs-header .ui-tabs-active').click();
                    }, 1000);
                }
                , south__onopen_start: function () {
                    checkSouthPanel();
                    //outerLayout.close('south');
                }


                                        // mid-LAYOUT (child of middle-center-pane)
                                        //Initialising second level layout of application i.e Dashboard tab and console div inside layout
                                        , center__childOptions: {
                                            enableCursorHotkey: false
                                            , center__paneSelector: ".mid-center"
                                            , north__paneSelector: ".mid-north"
                                            , spacing_open: 0  // ALL panes
                                            , spacing_closed: 0 // ALL panes
                                            , north__closable: false
                                            , north__resizable: false
                                            , north__size: 50


                            //Dashboard pannel
                    , center__childOptions: {
                        enableCursorHotkey: false
                        , center__paneSelector: ".tabs-panels"
                        , north__paneSelector: ".tabs-header"
                        , spacing_open: 0  // ALL panes
                                //, spacing_closed:         0 // ALL panes
                                //  ,   north__closable : false
                                //  ,   north__resizable : false
                        , north__size: 50

                    }

                }
            });

            $('.ui-layout-toggler-south').attr('title', 'Show');

            //var browserUrl = window.location.href;
            //var urlArray = browserUrl.split('?');
            //var loggedInUser = urlArray[1].split('=');
            //var userName = loggedInUser[1].split('#');
            $('#loggedinUserName').text(userName);
            $('#loggedinUserName').prop('title',userName);
            $('#loggedinRepository').text(" (" + repoVal + ")");
            $('#loggedinRepository').prop('title'," (" + repoVal + ")");


            bindRefreshEvent();

            $(window).on('unload', function () {  // This will be called to save dashboard if the user hits refresh 
                //saveDashboard();
            });

           
            function minMaxSidebarControls(makeMe){
                //below width are same as images width, height remains same
                var sideBarMinWidth = 6;
                var sideBarMaxWidth = 70;
                
                if(makeMe.toLowerCase()=='min')
                {
                    $(".sidebar-child div").hide();
                    $(".sidebar-child").parent().closest('div').width(sideBarMinWidth);
                    $("#tutorial").addClass('tutorial1-min').removeClass('tutorial1-max');
                    $("#collector").addClass('collectors1-min').removeClass('collectors1-max');

                    $(".sidebar-child").animate({
                            width: sideBarMinWidth
                        }, {
                            duration: 400,
                            specialEasing: {
                                width: 'linear'
                            }
                        });

                }else if(makeMe.toLowerCase()=='max')
                {
                        $(".sidebar-child div").show();
                        $(".sidebar-child").parent().closest('div').width(sideBarMaxWidth);
                        $("#tutorial").addClass('tutorial1-max').removeClass('tutorial1-min');
                        $("#collector").addClass('collectors1-max').removeClass('collectors1-min');
                        $(".sidebar-child").animate({
                            width: sideBarMaxWidth
                        }, {
                            duration: 100,
                            specialEasing: {
                                width: 'linear'
                            }
                        });
                }
            }

            //on mouse enter and mouse leave open close sidebar controls
            $("#sidebar-parent").on("mouseenter", function() {
                 minMaxSidebarControls('max');
            }).on("mouseleave", function() {
                  minMaxSidebarControls('min');
            });

            $('#overlayInstrcMenuDiv').live('click',function(e){
                e.preventDefault();
                instructionDashboard(false);        
            });
        });
    </script>
    <script>
         Handlebars.registerHelper("bindData", function(value) {
            return "data-summaryGrpID="+value+"";
        });

          Handlebars.registerHelper("parentViewletRef", function(value) {
            return "data-parentViewletID="+value+"";
        });

           Handlebars.registerHelper("viewletRef", function(value) {
            return "data-viewletID="+value+"";
        });
    </script>
    <script id="summaryDiv-template" type="text/x-handlebars-template">
        <div class="summary-child-div" id="{{summaryGrpID}}" {{parentViewletRef parentViewletID}} {{viewletRef viewletID}}>
             
            <div class="ag-heading_header" style="background-color:{{hColor}}"><div class="ag-heading-header-title">{{title}}</div></div>
            <div class="ag-heading_body" style="background-color:{{bColor}}">
                {{countVal}}
            </div>
        </div>
        </div>

    
</script>
<script id="summaryViewlet-template" type="text/x-handlebars-template">
<div class="summary-ag-group" id="widget{{ViewletNo}}">
            <div class="summaryUpLevel" >
                <div class="summary-viewlet-title" id="widget{{ViewletNo}}viewletTitle"><label></label> <span class="summaryRealTimeDate" title ="Real Time Data" style="display:none;"></span></div>
                <div class="summaryTopIcons">
                    <span class="summary-Child-Icon query" id="edit{{ViewletNo}}btn" title="Edit Query"></span>
                    <span class="summary-Child-Icon frequency" id="realTimewidget{{ViewletNo}}menu" onclick="EditSummaryRealTimeMenu(this)" title="Real Time Menu" style="display:none;"></span>
                    <span class="summary-Child-Icon refresh" id="reloadViewletData{{ViewletNo}}btn" title="Refresh Viewlet"></span>
                    <span class="summary-Child-Icon edit" id="setting{{ViewletNo}}btn" title="Viewlet Menu"></span>
                    <div class="editViewletSetting">
                    <div id="widget{{ViewletNo}}editOuter" class="settingPannel"></div></div>
                </div>
                <!-- For Query click open -->
                <div class="queryInputGroup" id="edit{{ViewletNo}}" style="display:none;">
                <input type="text" id="txtGetdata{{ViewletNo}}" class="inputWithjKQL"  value="{{value}}" placeholder="{{placeholderMsgForQuery}}" /><input type="button" id="qb{{ViewletNo}}btn" value="" class="jkqlBtnOff" />
               <div class="summaryJKQLPrompt">jKQL&gt; </div>
                </div>
            
            
            </div>
</div>
</script>
<script id="summaryRealTime-template" type="text/x-handlebars-template">
<div class="frequencyGroup" id="realTime{{viewletDivID}}" style="display:none;">
                    <div class="pagination" id="pagingLineChart_{{viewletDivID}}" style="height: 55px;">
                        <div class="sliderFirstDiv">
                            <table cellpading="0" cellpading="0" border="0" width="100%">
                                <tr>
                                    <td colspan="3"><div class="headeinglabel">Frequency (Second)</div></td>
                    <td colspan="3"></td>
                                </tr>
                                <tr>
                                <td class="widthSlider">
                                    <div class="scrollerParentDiv">
                                    <section>
                      <div class="slider" id="frequencySeconds{{viewletDivID}}"></div> 
                                    </section></div>
                                </td>
                <td width="50"><div class="scrollerLableSmall"><input type="number"  class="realTimeNumericStepper" id="freqNumericVal{{viewletDivID}}" value='{{initialrealfreqvalue}}'value='50' title="Max Freq:1800 Sec" min="0" max="1800" pattern="^[0-9]$" /></div>
                                </td>
                <td width="20" align="center" height="30" ><div id="{{viewletDivID}}_Play" class="viewletPlayOff" title="Pause Subscription" ></div></td>
                                </tr></table>
                        </div>
                        </div>
                    </div>
                </div>    
</script>
<!-- Add icons for Help and Get collector -->
<!--
<div class="fixedIconHelpGETCollector">
     <img src="images/tutorial.png" onclick="helpMenuIcon();" style="cursor:pointer;"/>
     <a href="https://www.jkoolcloud.com/product/technology/#Connectors" target="_blank"><img src="images/get-collector.png" /></a>
</div>-->

<div class="helpMenuItems">
    <div class="header">Tutorial<span>X</span></div>
   <ul>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/index.html" target="_blank">Index</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/introducing-jkool.html" target="_blank">Introducing jKool</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/how-jKool-works.html" target="_blank">How jKool Works</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/jkool-cloud-platform.html"target="_blank">jKool Cloud Platform</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/jkool-components.html" target="_blank">jKool Components</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/getting-data-into-jkool.html" target="_blank">Getting Data into jKool</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/starting-out.html" target="_blank">Starting Out</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/add-a-dashboard.html" target="_blank">Add a Dashboard</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/create-a-viewlet.html" target="_blank">Create a viewlet</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/rearranging-the-viewlets.html" target="_blank">Rearranging the viewlets</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/edit-viewlet.html" target="_blank">Edit Viewlet</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/console.html" target="_blank">Drill down into the data (Console)</a></li>
        <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries.html" target="_blank" class="submenu" >Using jKQL queries</a>
            <ul>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-get.html" target="_blank">Get</a></li>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-drilldown.html" target="_blank">Drill down</a></li>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-compare.html" target="_blank">Compare</a></li>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-events.html" target="_blank">Events</a></li>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-other-queries.html target="_blank"">Other queries</a></li>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-topology.html target="_blank"">Topology</a></li>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-geomaps.html" target="_blank">Geo Maps</a></li>
                <li><a href="https://www.jkoolcloud.com/help/tutorial/using-jkql-queries-whatsnext.html" target="_blank">What's Next?</a></li>
           </ul></li>
           <li><div><a id="overlayInstrcMenuDiv" href="" target="_blank">View jKool walk-through</a></div></li>

      </ul>
</div>


</body>
</html>