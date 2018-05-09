<?php
if(!isset($_FILES['file']['error'])) {
	exit(header("HTTP/1.0 404 Not Found"));
} else {
	header('Content-type: application/json');
	
	$finfo = finfo_open(FILEINFO_MIME_TYPE);
	$mime = finfo_file($finfo, $_FILES['file']['tmp_name']);
	finfo_close($finfo);
	
	$json = array('name' => $_FILES['file']['name'], 'mime' => $mime, 'size' => $_FILES['file']['size']);
	echo json_encode($json);
	exit();
}
?>
