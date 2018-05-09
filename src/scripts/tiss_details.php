<?php
$xml = @simplexml_load_file("https://tiss.tuwien.ac.at/api/person/v21/id/".$_GET['id']);
if ($xml === false) {
    exit(header("HTTP/1.0 404 Not Found"));
} else {
	header('Content-type: application/json');
	$author = $xml->person;
	$json = array('title' => $author->preceding_titles, 'firstname' => $author->firstname, 'lastname' => $author->lastname, 'email' => $author->main_email, 'institute' => $author->employee->employment[0]->organisational_unit);
	echo json_encode($json);
	exit();
}
?>
