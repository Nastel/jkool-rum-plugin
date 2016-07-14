<%--
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
 --%>


<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.util.*"%>

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
      String rid = UUID.randomUUID().toString();
      String pid = UUID.randomUUID().toString();
      session.setAttribute("JK_CORR_RID", rid);
      session.setAttribute("JK_ZORKA_PARENT_ID", pid);
      String ipAddress = request.getHeader("X-FORWARDED-FOR");
      if (ipAddress == null)
        ipAddress = request.getRemoteAddr();
    %>
    
      <input type="hidden" name="corrid" id="corrid" value="<%=id%>"/>
      <input type="hidden" name="rcorrid" id="rcorrid" value="<%=rid%>"/>
      <input type="hidden" name="username" id="username" value="${sessionScope.username}"/>
      <input type="hidden" name="ipaddress" id="ipaddress" value="<%=ipAddress%>"/>
      <input type="hidden" name="pid" id="pid" value="<%=pid%>"/>    
