/*
1	Research papers (pre- and postprints)
2	Research papers (preprints only)
3	Research papers (postprints only)
4	Bibliographic references
5	Conference and workshop papers
6	Theses and dissertations
7	Unpublished reports and working papers
8	Books   chapters and sections
9	Datasets
10	Learning Objects
11	Multimedia and audio-visual materials
12	Software
13	Patents
14	Other special item types
*/

// PDF, PS, DVI
var rendered_doc = ["pdf", "postscript", "x-dvi"];

// TEX, RTF, ODT, DOC, DOCX
var wordprocessor = ["x-tex", "rtf", "vnd.oasis.opendocument.text", "msword", "vnd.openxmlformats-officedocument.wordprocessingml.document"];

// ODS, XLS, XLSX, XML
var dataset = ["vnd.oasis.opendocument.spreadsheet", "vnd.ms-excel", "vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xml"];

// ODP, PPT, PPTX
var presentation = ["vnd.oasis.opendocument.presentation", "vnd.ms-powerpoint", "vnd.openxmlformats-officedocument.presentationml.presentation"];

// Linux executable and windows EXE
var executable = ["x-elf", "vnd.microsoft.portable-executable"];

// Sourcecode files
var sourcecode = ["x-java", "x-python", "x-perl", "x-shellscript", "javascript", "x-c++", "x-c", "x-makefile"];

var content_array = "";


function classify_content(mime) {
	mime_split = mime.split("/");

	// image audio video 
	
	switch(mime_split[0]) {
		case 'application':
			if($.inArray(mime_split[1], rendered_doc) > -1) {
				return 1;
			} else if($.inArray(mime_split[1], wordprocessor) > -1) {
				return 1;
			} else if($.inArray(mime_split[1], dataset) > -1) {
				return 9;
			} else if($.inArray(mime_split[1], presentation) > -1) {
				return 11;
			} else if($.inArray(mime_split[1], executable) > -1) {
				return 12;
			}
			break;
		case 'audio':
			return 11;
		case 'image':
			return 11;
		case 'text':
			if($.inArray(mime_split[1], sourcecode) > -1) {
				return 12;
			}
		case 'video':
			return 11;
		default:
			return 14;
	}
	return 14;
}

function search_repositories() {
	// Array filled with zeros
	content_array = Array(14).fill(0);
	
	$('.dynamic-element').each(function() {
		if($(this).find('#fileUse').val() == 'output') {
			var content = classify_content($(this).find('#fileMime').val());
			content_array[content-1] += parseInt($(this).find('#fileCount').val());
		}
	});
	
	var content_sorted = Array(14);
	for(var i = 0; i < 14; ++i) { content_sorted[i] = i; }
	content_sorted.sort(function (a, b) { return content_array[a] > content_array[b] ? -1 : content_array[a] < content_array[b] ? 1 : a < b ? -1 : 1; });
	
	var co = $('#countrySelector').find(':selected').data('country-code');
	var ct = "";
	for(var i=0; i<3; i++) {
		if(content_array[content_sorted[i]] > 0) {
			var c = parseInt(content_sorted[i])+parseInt(1);
			if(i > 0)
				ct += ',';
			ct += c;
		}
	}

	// Show spinner
	$('#loadingRepo').show();
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'scripts/opendoar.php',
		data: {'country' : co, 'content' : ct},
		success: function(result) {
			for (var k in result.repository) {
				$('#repoPicker').append('<div class="radio"><label><input type="radio" name="repoRadio" value="'+result.repository[k].name[0]+'" />  '+result.repository[k].name[0]+' (<a target="_blank" href="'+result.repository[k].url[0]+'">more info</a>)</label></div>');
			}
			$('#repoResults').collapse('show');
		},
		error: function(exception) {
			alert("Could not connect to OpenDOAR.");
		},
		complete: function() {
			$('#loadingRepo').hide();
		}
	});
}