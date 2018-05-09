<?php
// Custom sorting function
// sorts repos descending by their rating and ascending by their occurence (name)
$repo_rating = array();
function custom_sort($a, $b)
{
	global $repo_rating;
	return $repo_rating[$a] > $repo_rating[$b] ? -1 : ($repo_rating[$a] < $repo_rating[$b] ? 1 : ($a < $b ? -1 : 1));
}

// Compose OpenDOAR query
// We only need minimal repository info + their content listing
$country = strtolower($_GET['country']);
$url = "http://www.opendoar.org/api13.php?show=min,index&sort=rname&co=".$country.'&ct='.$_GET['content'];
$xml = @simplexml_load_file($url);

if ($xml === false) {
    exit(header("HTTP/1.0 404 Not Found"));
} else {
	header('Content-type: application/json');
	$repos = $xml->repositories;
	
	$content_worth = array(0b100, 0b010, 0b001);

	$content_array = explode(",", $_GET['content']);
	$num_repos = count($repos->children());
	
	
	for($i=0; $i < $num_repos; $i++) {
		$content_types = $repos->repository[$i]->contentTypes;
		$repo_rating[$i] = 0b0;
		for($j=0; $j < count($content_types->children()); $j++) {
			$repo_content = $content_types->contentType[$j]->attributes()->ctID;
			for($k=0; $k < count($content_array); $k++) {
				if($repo_content == $content_array[$k]) {
					$repo_rating[$i] = $repo_rating[$i] | $content_worth[$k];
				}
			}
		}
	}

	// sort array
	$repo_sorted = array_keys($repo_rating);
	usort($repo_sorted, "custom_sort");
	
	$json = array();
	$num_output = $num_repos <= 3 ? $num_repos : 3;
	
	for($i=0; $i < $num_output; $i++) {
		$entry = array('name' => $repos->repository[$repo_sorted[$i]]->rName, 'url' => $repos->repository[$repo_sorted[$i]]->rUrl);
		$json['repository'][$i] = $entry;
	}
	
	echo json_encode($json);
	exit();
}
?>
