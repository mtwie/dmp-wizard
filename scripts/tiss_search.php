<?php
$result = @file_get_contents("https://tiss.tuwien.ac.at/api/person/v21/psuche?q=".$_GET['name']);
if ($result === false) {
    exit(header("HTTP/1.0 404 Not Found"));
} else {
	header('Content-type: application/json');
	echo $result;
	exit();
}
?>
