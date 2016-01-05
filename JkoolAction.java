/*
* Copyright (c) 2014 Nastel Technologies, Inc. All Rights Reserved.
*
* This software is the confidential and proprietary information of Nastel
* Technologies, Inc. ("Confidential Information").  You shall not disclose
* such Confidential Information and shall use it only in accordance with
* the terms of the license agreement you entered into with Nastel
* Technologies.
*
* NASTEL MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
* THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE, OR NON-INFRINGEMENT. NASTEL SHALL NOT BE LIABLE FOR ANY DAMAGES
* SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
* THIS SOFTWARE OR ITS DERIVATIVES.
*
* CopyrightVersion 1.0
*
*/

package com.nastel.jkool.Action;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.nastel.jkool.WebSocket.ViewletHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.nastel.jkool.client.JKConnection;
import com.nastel.jkool.client.JKRequest;
import com.nastel.jkool.client.JKResult;
import com.nastel.jkool.jkql.ParameterType;
import com.nastel.jkool.jkql.ResultSet;
import com.nastel.jkool.tnt4j.TrackingLogger;
import com.nastel.jkool.tnt4j.config.DefaultConfigFactory;
import com.nastel.jkool.tnt4j.config.TrackerConfig;
import com.nastel.jkool.tnt4j.core.OpLevel;
import com.nastel.jkool.tnt4j.tracker.ContextTracker;
import com.nastel.jkool.tnt4j.tracker.TrackingActivity;
import com.nastel.jkool.tnt4j.tracker.TrackingEvent;

import java.util.Vector;

import javax.servlet.ServletContext;

@SuppressWarnings("unchecked")
// This class contains methods which we use to get connection object, insert data into database and get data from database.
public class JkoolAction extends HttpServlet {

    static final long serialVersionUID = 996526940558287523L;
    
    private static final Logger logger = Logger.getLogger(JkoolAction.class);
	private static final TrackerConfig config = DefaultConfigFactory.getInstance().getConfig("com.nastel.jkool").build();
	private static final TrackingLogger tracker = TrackingLogger.getInstance(config); 

    private static final int NUM_ANALYSE_QUERIES = 6;
    int maxResultSetRows = 0; //This variable has been used on temporary basis.
    ViewletHandler viewletHandler = new ViewletHandler();
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        try {
        	
        	// start timing
        	
        	
        	TrackingActivity activity = tracker.newActivity();
        	activity.start();
        	
        	//TrackingEvent event = tracker.newEvent("jkoolAction", "Viewing viewlets"); 
        	TrackingEvent event = tracker.newEvent(OpLevel.SUCCESS, "jKoolAction", ContextTracker.get(),"Viewing viewlets");
        	//event.setCorrelator(ContextTracker.get()); 
        	event.start(); 
        	
            String ret = "";
            String query = request.getParameter("Param");
            int queryType = Integer.parseInt(request.getParameter("queryType"));
            String fromDate = request.getParameter("FromDate");
            String toDate = request.getParameter("ToDate");
            String dateRange = request.getParameter("DateRange");
            HttpSession session = request.getSession();
            String repository = session.getAttribute("repositoryID").toString();
            DashboardManager dashboardManager = new DashboardManager();
	        String userName=session.getAttribute("userName").toString();
	        String passWord=session.getAttribute("passWord").toString();
            String pageSizeval=( request.getParameter("pageSize")!=null)? request.getParameter("pageSize"):"100";
            int pageSize=(pageSizeval!=null)?Integer.parseInt(pageSizeval):100;
            String pageSizeStr=( request.getParameter("pageSelected")!=null)?request.getParameter("pageSelected").toString():"1";
            int pageSelected=(pageSizeStr!=null)?Integer.parseInt(pageSizeStr):1;
            generateUUID("d-");
            
            // stop timing
            event.stop(); 
            activity.tnt(event);
            activity.stop();
            tracker.tnt(event);
            tracker.tnt(activity);
            //tracker.tnt(event);
            
            switch (queryType) {
                case 0: try {
                            //This case is used to save data into cassandra
                            ret = saveProperties(query, repository, request,userName);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
                        break;

                case 1: //This case is used to get data from cassandra
                    if (query.toLowerCase().indexOf("analyze event") > -1) { //This block is used to get data for analyze related query 
                        long t1 = System.currentTimeMillis();

                        String intervalCount = request.getParameter("intervalCount");
                        String startDateTime = request.getParameter("startDateTime");
                        String endDateTime = request.getParameter("endDateTime");

                        String[] queries = new String[NUM_ANALYSE_QUERIES];
                        String[] rs = new String[NUM_ANALYSE_QUERIES];

                        queries[0] = "get events fields avg elapsedtime, min elapsedtime, max elapsedtime, open elapsedtime, close elapsedtime where starttime between '" + startDateTime + "' and '" + endDateTime + "' group by starttime bucketed by " + intervalCount;
                        queries[1] = "get number of event where starttime between '" + startDateTime + "' and '" + endDateTime + "' group by severity, starttime bucketed by " + intervalCount;
                        queries[2] = "get number of activity where starttime between '" + startDateTime + "' and '" + endDateTime + "' group by activitystatus, starttime bucketed by " + intervalCount;
                        queries[3] = "get number of event where starttime between '" + startDateTime + "' and '" + endDateTime + "' group by starttime bucketed by " + intervalCount;
                        queries[4] = "get number of activity where starttime between '" + startDateTime + "' and '" + endDateTime + "' group by starttime bucketed by " + intervalCount;
                        queries[5] = "get snapshot fields open properties(FreeBytes,MaxBytes,TotalCpuUsec), close properties(FreeBytes,MaxBytes,TotalCpuUsec), avg properties(FreeBytes,MaxBytes,TotalCpuUsec) where snapshottime between '" + startDateTime + "' and '" + endDateTime + "' group by snapshottime bucketed by " + intervalCount;
                        try {
                            getResultSet(queries, rs, repository, fromDate, toDate, dateRange, request,userName,passWord);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }

                        JSONObject json1 = (JSONObject) new JSONParser().parse(rs[0]);
                        JSONObject json2 = (JSONObject) new JSONParser().parse(rs[1]);
                        JSONObject json3 = (JSONObject) new JSONParser().parse(rs[2]);
                        JSONObject json5 = (JSONObject) new JSONParser().parse(rs[3]);
                        JSONObject json4 = (JSONObject) new JSONParser().parse(rs[4]);
                        JSONObject json6 = (JSONObject) new JSONParser().parse(rs[5]);

                        JSONObject jsonComplete = new JSONObject();
                        jsonComplete.put("show-as", "analyze");
                        jsonComplete.put("eventElapsedTime", json1);
                        jsonComplete.put("eventSeverityVolume", json2);
                        jsonComplete.put("activityStatusVolume", json3);
                        jsonComplete.put("activityVolume", json4);
                        jsonComplete.put("eventVolume", json5);
                        jsonComplete.put("snapshotProperties", json6);

                        Gson gson = new Gson();
                        ret = gson.toJson(jsonComplete);

                        ObjectMapper mapper = new ObjectMapper();
                        Response res = mapper.readValue(ret, Response.class);
                        MergedResponse merged_res = new MergedResponse(res);
                        long t2 = System.currentTimeMillis();
                        ret = mapper.writeValueAsString(merged_res);
                        long t3 = System.currentTimeMillis();
                        logger.debug("Before send " + (t2 - t1)
                                + "including send " + (t3 - t1));
                        }else {
                            try {
                                ret = getResultSet(query, repository, fromDate, toDate, dateRange, request,userName,passWord);
                            } catch (Throwable ex) {
                                ex.printStackTrace();
                            }
                     
                        }
                        break;
                case 2:
                        ret = getColumnNameOfType().toString();
                        break;

                case 3:
                        try {
                            ret = saveDashboardViewlet(query,request,(String)session.getAttribute("userName"),repository);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
                        break;

                case 4://delete dashboard and viewlet
                        String deleteTarget = request.getParameter("UIItemType");
                        if(deleteTarget.toLowerCase().equals("dashboard"))
                        {
                            int deleteViewlet = Integer.parseInt(request.getParameter("deleteViewlet"));
                        }else if(deleteTarget.toLowerCase().equals("viewlet"))
                        {
                        try {
                            ret = dashboardManager.deleteViewletFromdashoard((String)session.getAttribute("userName"),request.getParameter("dashboardID").toString(),request.getParameter("viewletID").toString(),request.getSession(),repository);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
                        }
                        break;   
                     
                
                case 5: //retrieving dashboard details
                        String rets = null;
                        try {
                            rets = getResultSet(query,repository,fromDate,toDate,dateRange,request,userName,passWord);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }

                        if(query.indexOf("Sample")>-1){	
                            userName="Sample";
                        }else{
                            userName=(String)session.getAttribute("userName");
                        }
                        try {
                            ret=dashboardManager.getUserDetails(rets,repository,userName,request.getSession(),passWord);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
                        logger.debug("user "+userName+"....  sending retrieved json to client "+ret);

                        if(ret.indexOf("userDashboardList")>-1){
                                ret=buildJsonString(ret);
                        }else{
                                ret="";
                        }
                        break;
                case 6://remove dashboard, sample dashboard
                       String UIItemType = request.getParameter("UIItemType"); 
                       if(UIItemType.toLowerCase().equals("dashboard")){
                            try {
                                ret = dashboardManager.removeDashboard((String)session.getAttribute("userName"), request.getParameter("dashboardID").toString(),Integer.parseInt(request.getParameter("isSampleDashboard").toString()),request.getSession(),repository);
                            } catch (Throwable ex) {
                                ex.printStackTrace();
                            }
                       }
                       break;
                 case 7: try {
                            //set as default
                           ret = dashboardManager.setAsDefaultDashboard((String)session.getAttribute("userName"),request.getParameter("dashboardID").toString(),request.getSession(),repository);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
       
                        break;

                 case 8: //load dashboard, move from invisible to visible
                       String loadItemType = request.getParameter("UIItemType"); 
                       if(loadItemType.toLowerCase().equals("dashboard")){
                            try {
                                ret = dashboardManager.addDashboard((String)session.getAttribute("userName"),request.getParameter("dashboardID").toString(),Integer.parseInt(request.getParameter("isSampleDashboard").toString()),request.getSession(),repository);
                            } catch (Throwable ex) {
                                ex.printStackTrace();
                            }
                       }
                       break;

                case 9: //change dashboard layout
                       String dashboardDeatil = request.getParameter("Param"); 
                        try {
                            ret = dashboardManager.changeDashbboardLayoutDetails(dashboardDeatil, repository, request.getSession(),
                                (String)session.getAttribute("userName"));
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
                       break;

                case 10: //delete multple dashboards
                       String dashboardIdList = request.getParameter("Param");
                       List<String> tempdashboardIdList = dashboardIdList != null ? (List<String>) new JSONParser().parse(dashboardIdList) : new ArrayList<String>();
                       for(String tempdashboardId : tempdashboardIdList){
                            try {
                                ret = dashboardManager.deleteDashboard((String)session.getAttribute("userName"),tempdashboardId,request.getSession(),repository);
                            } catch (Throwable ex) {
                                ex.printStackTrace();
                            }
                       }
                       break;

                 case 11: //Saves viewlet object into database
                        String viewletString = request.getParameter("Param");
                        try {
                            ret = saveViewlet(viewletString, request, (String)session.getAttribute("userName"), repository);
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
                        break;
                case 12: //get activity field names for event
                        ServletContext sc = request.getSession().getServletContext();
                        Map<String,String> activityFields=(Map<String,String>)sc.getAttribute("ActivityFields");
                        String activityFld=activityFields.toString();
                        activityFld=activityFld.replace("=",":");
                        ret= activityFld;
                        break;
                    
                case 13 :try {
                            ret = JSONObject.toJSONString(dashboardManager.getOpenViewletDetails(repository, request.getSession(),(String)session.getAttribute("userName")));
                        } catch (Throwable ex) {
                            ex.printStackTrace();
                        }
                        break;

            }


            response.getWriter().write(ret);
           

        } catch (Exception e) {
            logger.error("Error doPost JkoolAction class " + e.getMessage());
            e.printStackTrace();
        }
    }
    

    //This method calls saveViewletByViewletId method to save the viewlet individually.
    public String saveViewlet(String viewletObjString, HttpServletRequest request,String userName,String repository) throws Throwable{
        JKConnection dbConn = null;
        //JKConnectionPool connPool = null;
        boolean isOrphanViewlet = false;
        try{
            dbConn = getConnectionObj(request.getSession());
            String viewletID = "";
            DashboardManager dashboardManager = new DashboardManager();
            JSONObject viewletObject = viewletObjString != null ? (JSONObject) new JSONParser().parse(viewletObjString) : new JSONObject();
            Set<String> viewletKey = viewletObject.keySet();
            
            for(String key : viewletKey){//receiving viewlet id from viewlet object
                   viewletID = key;
            }
            JSONObject tempViewletobj = viewletObject.get(viewletID) != null ? (JSONObject)viewletObject.get(viewletID) : new JSONObject();
            
            if(tempViewletobj.containsKey("Orphan")){
                isOrphanViewlet = true;
            }
            dashboardManager.saveViewletByViewletId(userName, viewletID, tempViewletobj, request.getSession(), repository, "viewletDefinition", dbConn,Constant.VERSION_NO);
            
            if(isOrphanViewlet){
                dashboardManager.updateViewletOrphanEntry(viewletID, request.getSession(), repository, userName);
            }
        }catch(Exception e){
            logger.error("error in saving individual viewlet"+e.getMessage());
        }finally {
            //if(dbConn != null){
            //    connPool.giveBack(dbConn);
            //}    
        }
        return "success";
    }

    public String saveDashboardViewlet(String dashBoardObj, HttpServletRequest request,String userName,String repository) throws Throwable {
        JKConnection dbConn = null;
        //JKConnectionPool connPool = null;
        try {
            logger.debug("getting dashboard string to save it into database "+dashBoardObj);
            
            dbConn = getConnectionObj(request.getSession());
            
            JSONObject jsonObject = (JSONObject) new JSONParser().parse(dashBoardObj);
            DashboardManager dashboardManager = new DashboardManager();
            //adding version number in dashboard saving
            dashboardManager.saveUser(userName,jsonObject, request.getSession(),repository,dbConn,Constant.VERSION_NO);

        } catch (Exception e) {
            logger.debug("error in saveDashboardViewlet method "+e.getMessage());
            e.printStackTrace();
        } 
        return "success";
    }
    
    public static JKConnection getConnectionObj(HttpSession httpSession){
        JKConnection dbConn = null;
        try{
            dbConn = (JKConnection) httpSession.getAttribute(Constant.CONNECTION);
        }catch(Exception e){
            e.printStackTrace();
        }
        return dbConn;
    }

    public String generateUUID(String idPrefix) {
        UUID uuid = UUID.randomUUID();
        String randomUUIDString = null;
        try {

            randomUUIDString = idPrefix + uuid.toString();
            System.out.println("Random UUID String = " + randomUUIDString);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return randomUUIDString;
    }   

    public Vector<Map<String, Object>> convertToList(String jsonResult) {
        Vector<Map<String, Object>> exportData = new Vector<Map<String, Object>>();
        try {

            JSONObject json = (JSONObject) new JSONParser().parse(jsonResult);
            JSONArray jsonArray = (JSONArray) json.get("rows");
            JSONObject parsedJson = (JSONObject) new JSONParser().parse(jsonArray.get(0).toString());
            Set<String> keys = parsedJson.keySet();
            List<String> keyList = new ArrayList<String>();
            Iterator<String> itr = keys.iterator();
            while (itr.hasNext()) {
                keyList.add((String)itr.next());
            }

            for (int i = 0; i < jsonArray.size(); i++) {
                Map<String, Object> temp = new HashMap<String, Object>();
                JSONObject parsedJsonObject = (JSONObject) new JSONParser().parse(jsonArray.get(i).toString());
                for (int j = 0; j < keyList.size(); j++) {
                    temp.put(keyList.get(j), parsedJsonObject.get(keyList.get(j)));
                }
                exportData.add(temp);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return exportData;
    }

//this method is used to build json string
public String buildJsonString(String ret)
    {

        String lineSep = " ";
        StringBuilder sb = new StringBuilder(1024);
        sb.append("{ \"show-as\" : \"").append("").append("\",").append(lineSep);
        sb.append("").append("\"rows-found\" : \"").append("1").append("\",").append(lineSep);
        sb.append("").append("\"item-type\" : \"").append("Dictionary").append("\",").append(lineSep);
        sb.append("").append("\"colhdr\" : { ");
        sb.append("\"").append("DictionaryName").append("\":\"").append("STRING").append("\",").append(lineSep);
        sb.append("\"").append("Properties").append("\":\"").append("MAP(MAP)").append("\",").append(lineSep);
        sb.append("\"").append("UpdateTime").append("\":\"").append("TIMESTAMP").append("\"").append(lineSep);
        sb.append(" },").append(lineSep);
        sb.append("").append("\"keycols\" : [ ");
        sb.append("\"").append("DictionaryName").append("\"");
        sb.append(" ],").append(lineSep);
        sb.append("").append("\"rows\" : [");
        sb.append(ret);
        sb.append(lineSep).append("  ]}");
        return sb.toString();
    }


    //This method is used to get data from cassandra by passing query
    public String getResultSet(String query, String repository, String fromDate, String toDate, String dateRange, HttpServletRequest request,String userName,String passWord) throws Throwable {
        JKConnection dbConn = null;
        //JKConnectionPool connPool = null;
        String ret;
        String dateFilter = null;
        try {
            long t1 = System.currentTimeMillis();
            HttpSession httpSession = request.getSession();
            String timeZone = (String)httpSession.getAttribute("timeZone");
            dbConn = getConnectionObj(httpSession);
            JKRequest req = new JKRequest();
            req.setJKQLParameter(ParameterType.TIMEZONE, timeZone);
            req.setJKQLParameter(ParameterType.USER_NAME, userName);
            req.setRepoId(repository);
             
            long t2 = System.currentTimeMillis();
	
            if (dateRange != null && !dateRange.isEmpty()) {
                dateFilter = dateRange;
            } else if (fromDate != null && !fromDate.isEmpty()
                    && toDate != null && !toDate.isEmpty()) {
               dateFilter = "\"" + fromDate.trim()+ "\" to \"" + toDate.trim() + "\"";
            }

            //Set default page size to return all records, this will be variable driven once paging logic is ready from UI side
            String pageQuery = "use maxresultrows '2500'";
            req = new JKRequest();
            req.setJKQLParameter(ParameterType.TIMEZONE, timeZone);
            req.setRepoId(repository);
            req.setJKQLStmt(pageQuery); 
            req.setJKQLParameter(ParameterType.USER_NAME, userName);
            dbConn.send(req);
            
            req = new JKRequest();
            req.setJKQLParameter(ParameterType.TIMEZONE, timeZone);
            req.setJKQLParameter(ParameterType.USER_NAME, userName);
            req.setRepoId(repository);
            req.setJKQLParameter(ParameterType.DATE_FILTER, dateFilter );
            req.setJKQLStmt(query);
            JKResult resp = dbConn.send(req);
            
            long t3 = System.currentTimeMillis();
            ret = resp.getResultSet()!= null ? resp.getResultSet() : resp.getErrorMsg();
            long t4 = System.currentTimeMillis();

            logger.debug("Retrieve Query[" + query + "] conn/repo[" + (t2 - t1)
                    + "] execute[" + (t3 - t2) + "] json[" + (t4 - t3)
                    + "] ms num_row[] db details ");
        } catch (Exception e) {
            logger.error("Error getResultSet JkoolAction " + e.getMessage());
            e.printStackTrace();
            ret = e.getMessage();
        } 
        return ret;
    }

    //This method is used to get data from cassandra by passing multiple queries(For Analyze)
     public void getResultSet(String[] queries,
            String[] str_resultset,
            String repository,
            String fromDate,
            String toDate,
            String dateRange,
            HttpServletRequest request,String userName,String passWord) throws Throwable {
            JKConnection dbConn = null;
            String dateFilter = null;

        try {
            HttpSession httpSession = request.getSession();
            String timeZone = (String)httpSession.getAttribute("timeZone");
            dbConn = getConnectionObj(httpSession);
            JKRequest req = new JKRequest();
            req.setJKQLParameter(ParameterType.TIMEZONE, timeZone);
            req.setJKQLParameter(ParameterType.USER_NAME, userName);
            
            ResultSet[] rs = new ResultSet[NUM_ANALYSE_QUERIES];
            List<String> db_details = new ArrayList<String>();

            long t1 = System.currentTimeMillis();
            if (dateRange != null && !dateRange.isEmpty()) {
                dateFilter = dateRange;
            } else if (fromDate != null && !fromDate.isEmpty()
                    && toDate != null && !toDate.isEmpty()) {
                dateFilter = "\"" + fromDate.trim()+ "\" to \"" + toDate.trim() + "\"";
            }
            maxResultSetRows= 2500;
            //Set default page size to return all records, this will be variable driven once paging logic is ready from UI side
            String pageQuery = "use maxresultrows '"+maxResultSetRows+"'";
            req.setRepoId(repository);
            req.setJKQLStmt(pageQuery);
            dbConn.send(req);
            

            int sz = queries.length;
            JKResult resp = null;
            for (int i = 0; i < sz; i++) {
                logger.debug("Analyze viewlet query to receive data from cassandra--------"+queries[i]);
                req.setRepoId(repository);
                req.setJKQLStmt(queries[i]);
                req.setJKQLParameter(ParameterType.DATE_FILTER, dateFilter);
                resp = dbConn.send(req);
                str_resultset[i] = resp.getResultSet();
            }
            long t2 = System.currentTimeMillis();

            logger.debug("Total time " + (t2 - t1) + " db details for analyze query");
        } catch (Exception e) {
            logger.error("Error getResultSet JkoolAction " + e.getMessage());
            e.printStackTrace();
         
        } 
        return;
    }

    //This method is used to save records in cassandra by passing required data 
    public String saveProperties(String query, String repository, HttpServletRequest request,String userName) throws Throwable {
        JKConnection dbConn = null;
        String ret = "success";
        try {
            HttpSession httpSession = request.getSession();
            String timeZone = (String)httpSession.getAttribute("timeZone");
            dbConn = getConnectionObj(httpSession);
            JKRequest req = new JKRequest();
            req.setJKQLParameter(ParameterType.TIMEZONE, timeZone);
            req.setJKQLParameter(ParameterType.USER_NAME, userName);
            
            long t1 = System.currentTimeMillis();
            
            logger.debug("Query to save data into database is-----"+query);
            req.setRepoId(repository);
            req.setJKQLStmt(query);
            dbConn.send(req);
            long t2 = System.currentTimeMillis();

            logger.debug("Save Query[" + query + "] conn/repo[" + (t2 - t1)+ "ms");
        } catch (Exception e) {
            logger.error("Error saveProperties " + e.getMessage());
            e.printStackTrace();
            ret = e.getMessage();
        } 
        return ret;
    }

    //this function is for topology which will return correspondign column names in activity and event table using parent and child type
    public List<String> getColumnNameOfType() {
        List<String> columnName = new ArrayList<String>();
        for (int i = 0; i < Constant.TOPOLOGY_ITEM_TYPE_LENGTH; ++i) {
            com.nastel.jkool.jkql.ItemType obj = com.nastel.jkool.jkql.ItemType.getType(i);
            try {
                if (obj != null) {
                    columnName.add(obj.getNameField().getLabel());
                }
            } catch (NullPointerException e) {
                break;
            }
        }
        return columnName;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class TimeSpan {

    public String end;
    public String begin;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ByteCpu {

    @JsonProperty("MaxBytes")
    public String MaxBytes;
    @JsonProperty("FreeBytes")
    public String FreeBytes;
    @JsonProperty("TotalCpuUsec")
    public String TotalCpuUsec;

    public ByteCpu(String s) {
        MaxBytes = FreeBytes = TotalCpuUsec = s;
    }

    public ByteCpu() {
        MaxBytes = "";
        FreeBytes = "";
        TotalCpuUsec = "";
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ColHdr {

    @JsonProperty("Open ElapsedTime")
    public String open_elapsedTime_unit;
    @JsonProperty("Close ElapsedTime")
    public String close_elapsedTime_unit;
    @JsonProperty("Max ElapsedTime")
    public String max_ElapsedTime_unit;
    @JsonProperty("Min ElapsedTime")
    public String min_ElapsedTime_unit;
    @JsonProperty("Avg ElapsedTime")
    public String avg_ElapsedTime_unit;
    @JsonProperty("StartTime")
    public String StartTime_unit;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class EventElapsedTimeRow {

    @JsonProperty("Open ElapsedTime")
    public String open_elapsedTime;
    @JsonProperty("Close ElapsedTime")
    public String close_ElapsedTime;
    @JsonProperty("Max ElapsedTime")
    public String max_ElapsedTime;
    @JsonProperty("Min ElapsedTime")
    public String min_ElapsedTime;
    @JsonProperty("Avg ElapsedTime")
    public String avg_ElapsedTime;
    @JsonProperty("StartTime")
    public TimeSpan StartTime;

    public EventElapsedTimeRow() {
    }

    public EventElapsedTimeRow(TimeSpan t) {
        StartTime = t;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class EventElapsedTime {
    //@JsonProperty("item-type")
    //public String item_type;

    @JsonProperty("colhdr")
    public ColHdr col_hdr;
    @JsonProperty("rows")
    public List<EventElapsedTimeRow> rows;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ActivityVolumeRow {

    @JsonProperty("StartTime")
    public TimeSpan StartTime;
    @JsonProperty("NumberOf")
    public String NumberOf;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ActivityVolume {

    @JsonProperty("rows")
    public List<ActivityVolumeRow> rows;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class SnapshotPropertiesRow {

    @JsonProperty("SnapshotTime")
    public TimeSpan SnapshotTime;
    @JsonProperty("Close Properties([FreeBytes, MaxBytes, TotalCpuUsec])")
    public ByteCpu close_byteCpu;
    @JsonProperty("Open Properties([FreeBytes, MaxBytes, TotalCpuUsec])")
    public ByteCpu open_byteCpu;
    @JsonProperty("Avg Properties([FreeBytes, MaxBytes, TotalCpuUsec])")
    public ByteCpu avg_byteCpu;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class SnapshotProperties {

    @JsonProperty("rows")
    public List<SnapshotPropertiesRow> rows;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class EventVolumeRow {

    @JsonProperty("StartTime")
    public TimeSpan StartTime;
    @JsonProperty("NumberOf")
    public String NumberOf;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class EventVolume {

    @JsonProperty("rows")
    public List<EventVolumeRow> rows;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ActivityStatusVolumeRow {

    @JsonProperty("StartTime")
    public TimeSpan StartTime;
    @JsonProperty("ActivityStatus")
    public String activityStatus;
    @JsonProperty("NumberOf")
    public String NumberOf;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ActivityStatusVolume {

    public List<ActivityStatusVolumeRow> rows;
}

class EventSeverityVolumeRow {

    @JsonProperty("Severity")
    public String severity;
    @JsonProperty("StartTime")
    public TimeSpan StartTime;
    @JsonProperty("NumberOf")
    public String NumberOf;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class EventSeverityVolume {

    public List<EventSeverityVolumeRow> rows;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class Response {

    @JsonProperty("show-as")
    public String show_as;
    @JsonProperty("eventElapsedTime")
    public EventElapsedTime eventElapsedTime;
    @JsonProperty("activityVolume")
    public ActivityVolume activityVolume;
    @JsonProperty("snapshotProperties")
    public SnapshotProperties snapshotProperties;
    @JsonProperty("eventVolume")
    public EventVolume eventVolume;
    @JsonProperty("activityStatusVolume")
    public ActivityStatusVolume activityStatusVolume;
    @JsonProperty("eventSeverityVolume")
    public EventSeverityVolume eventSeverityVolume;
}

class MergedResponseRow {

    @JsonProperty("Open ElapsedTime")
    public String open_elapsedTime;
    @JsonProperty("Close ElapsedTime")
    public String close_ElapsedTime;
    @JsonProperty("Max ElapsedTime")
    public String max_ElapsedTime;
    @JsonProperty("Min ElapsedTime")
    public String min_ElapsedTime;
    @JsonProperty("Avg ElapsedTime")
    public String avg_ElapsedTime;
    @JsonProperty("StartTime")
    public TimeSpan StartTime;
    // Activities
    @JsonProperty("Activity")
    public String activity;
    // Event properties
    @JsonProperty("Event")
    public String event;
    // snapshot properties
    @JsonProperty("Close Properties([FreeBytes, MaxBytes, TotalCpuUsec])")
    public ByteCpu close_byteCpu;
    @JsonProperty("Open Properties([FreeBytes, MaxBytes, TotalCpuUsec])")
    public ByteCpu open_byteCpu;
    @JsonProperty("Avg Properties([FreeBytes, MaxBytes, TotalCpuUsec])")
    public ByteCpu avg_byteCpu;
    // Activity Status
    @JsonProperty("BEGIN")
    public String begin_count = "0";
    @JsonProperty("END")
    public String end_count = "0";
    @JsonProperty("EXCEPTION")
    public String exception_count = "0";
    // Event Severity
    @JsonProperty("TRACE")
    public String trace_count = "0";
    @JsonProperty("DEBUG")
    public String debug_count = "0";
    @JsonProperty("INFO")
    public String info_count = "0";
    @JsonProperty("SUCCESS")
    public String sucesss_count = "0";
    @JsonProperty("FAILURE")
    public String failure_count = "0";
    @JsonProperty("CRITICAL")
    public String critical_count = "0";
    @JsonProperty("HALT")
    public String halt_count = "0";
    @JsonProperty("UNKNOWN")
    public String unknown_count = "0";
    @JsonProperty("WARNING")
    public String warning_count = "0";
    @JsonProperty("FATAL")
    public String fatal_count = "0";
    @JsonProperty("ERROR")
    public String error_count = "0";
}

class MergedResponse {

    private static final Logger logger = Logger.getLogger(MergedResponse.class);
    @JsonProperty("item-type")
    public String item_type = "Event";
    @JsonProperty("show-as")
    public String show_as = "analyze";
    @JsonProperty("colhdr")
    public ColHdr col_hdr;
    @JsonProperty("rows")
    public List<MergedResponseRow> rows;

    public MergedResponse(Response res) {
        try {
            rows = new ArrayList<MergedResponseRow>();
            col_hdr = res.eventElapsedTime.col_hdr;

            int num_rows = res.eventElapsedTime.rows.size();

            for (int ctr = 0; ctr < num_rows; ++ctr) {
                MergedResponseRow new_row = new MergedResponseRow();

                // EventElapsedTime
                EventElapsedTimeRow ev_elapsed_time_row = res.eventElapsedTime.rows.get(ctr);
                new_row.StartTime = ev_elapsed_time_row.StartTime;
                new_row.open_elapsedTime = ev_elapsed_time_row.open_elapsedTime;
                new_row.close_ElapsedTime = ev_elapsed_time_row.close_ElapsedTime;
                new_row.max_ElapsedTime = ev_elapsed_time_row.max_ElapsedTime;
                new_row.min_ElapsedTime = ev_elapsed_time_row.min_ElapsedTime;
                new_row.avg_ElapsedTime = ev_elapsed_time_row.avg_ElapsedTime;

                // Activity
                new_row.activity = res.activityVolume.rows.get(ctr).NumberOf;

                // EventVolume
                new_row.event = res.eventVolume.rows.get(ctr).NumberOf;

                // Snapshot properties
                SnapshotPropertiesRow snap_prop = res.snapshotProperties.rows.get(ctr);
                new_row.close_byteCpu = snap_prop.close_byteCpu;
                new_row.open_byteCpu = snap_prop.open_byteCpu;
                new_row.avg_byteCpu = snap_prop.avg_byteCpu;

                // Add now....
                this.rows.add(new_row);
            }

            Comparator<EventElapsedTimeRow> comp =
                    new Comparator<EventElapsedTimeRow>() {

                        @Override
						public int compare(EventElapsedTimeRow u1,
                                EventElapsedTimeRow u2) {
                            return u1.StartTime.begin.compareTo(u2.StartTime.begin);
                        }
                    };

            // activityStatusVolume
            for (ActivityStatusVolumeRow iter : res.activityStatusVolume.rows) {
                //iter.StartTime;
                int index = Collections.binarySearch(res.eventElapsedTime.rows,
                        new EventElapsedTimeRow(iter.StartTime),
                        comp);
                if (iter.activityStatus.contains("BEGIN")) {
                    this.rows.get(index).begin_count = iter.NumberOf;
                } else if (iter.activityStatus.contains("END")) {
                    this.rows.get(index).end_count = iter.NumberOf;
                } else if (iter.activityStatus.contains("EXCEPTION")) {
                    this.rows.get(index).exception_count = iter.NumberOf;
                } else {
                    logger.error("Unhandled activity status "
                            + iter.activityStatus);
                }
            }


            for (EventSeverityVolumeRow iter : res.eventSeverityVolume.rows) {
                //iter.StartTime;
                int index = Collections.binarySearch(res.eventElapsedTime.rows,
                        new EventElapsedTimeRow(iter.StartTime),
                        comp);
                if (iter.severity.contains("TRACE")) {
                    this.rows.get(index).trace_count = iter.NumberOf;
                } else if (iter.severity.contains("INFO")) {
                    this.rows.get(index).info_count = iter.NumberOf;
                } else if (iter.severity.contains("DEBUG")) {
                    this.rows.get(index).debug_count = iter.NumberOf;
                } else if (iter.severity.contains("SUCCESS")) {
                    this.rows.get(index).sucesss_count = iter.NumberOf;
                } else if (iter.severity.contains("FAILURE")) {
                    this.rows.get(index).failure_count = iter.NumberOf;
                } else if (iter.severity.contains("CRITICAL")) {
                    this.rows.get(index).critical_count = iter.NumberOf;
                } else if (iter.severity.contains("HALT")) {
                    this.rows.get(index).halt_count = iter.NumberOf;
                } else if (iter.severity.contains("UNKNOWN")) {
                    this.rows.get(index).unknown_count = iter.NumberOf;
                } else if (iter.severity.contains("WARNING")) {
                    this.rows.get(index).warning_count = iter.NumberOf;
                } else if (iter.severity.contains("FATAL")) {
                    this.rows.get(index).fatal_count = iter.NumberOf;
                } else if (iter.severity.contains("ERROR")) {
                    this.rows.get(index).error_count = iter.NumberOf;
                } else {
                    logger.error("Unhandled event serverity "
                            + iter.severity);
                }
            }
        } catch (Exception e) {
            logger.error("Error MergedResponse MergedResponse " + e.getMessage());
        }
    }
}
