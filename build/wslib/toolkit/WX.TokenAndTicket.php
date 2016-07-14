<?php
include 'WX.php';

$wx=new WX();


$action=$_GET["action"];
switch ($action) {
	case "ticket"://获取jsapi_ticket
		echo json_encode($wx->getTicket());
		break;
	case "jkabctoken"://获取jsapi_ticket
		echo json_encode($wx->getTokenAndTicket());
		break;
	default://获取jsapi_ticket
		echo json_encode($wx->getTicket());
		break;
}