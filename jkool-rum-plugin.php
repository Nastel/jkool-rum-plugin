/*
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
 */

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

$jk_corrid = NULL;    
if ($_SESSION["JK_CORR_SID"] == null)
    {
        $jk_corrid = createGuid();
        $_SESSION["JK_CORR_SID"] = $jk_corrid;
    }
    else
    {
        $jk_corrid =  $_SESSION["JK_CORR_SID"];
    }
$jk_rid = null;
$jk_rid = createGuid();
$jk_pid = createGuid();
$_SESSION["JK_CORR_RID"] = $jk_rid;
$_SESSION["JK_ZORKA_PARENT_ID"] = $jk_pid;
$jk_ipAddress = $_SERVER["X-FORWARDED-FOR"] ;
$jk_usrName=$_SERVER['REMOTE_USER'];

if($jk_ipAddress == NULL) {
    $jk_ipAddress = $_SERVER["REMOTE_ADDR"] ; 
}
?>
<input type="hidden" name="corrid" id="corrid" value="<?=$jk_corrid?>"/>
<input type="hidden" name="rcorrid" id="rcorrid" value="<?=$jk_rid?>"/>
<input type="hidden" name="ipaddress" id="ipaddress" value="<?=$jk_ipAddress?>"/>
<input type="hidden" name="username" id="username" value="<?=$jk_usrName?>"/>
<input type="hidden" name="pid" id="pid" value="<?=$jk_pid?>"/> 
