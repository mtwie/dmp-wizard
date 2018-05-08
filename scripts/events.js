// selected license
var selected_license = "";

$(function() {
    $('#buttonSelectLicense').licenseSelector({showLabels : true, onLicenseSelected : function (license) {
		selected_license = license;
		$('#licenseField').val(license.name);
	}});
});


// Start Button
$('#buttonStart').on('click', function (e) {
	e.preventDefault();
	$('#formBasic').collapse('show');
	$("html, body").animate({ scrollTop: $('#projectBasics').offset().top }, 500);
});

// Submit basic info, query Tiss
$('#formBasic').on('submit', function (e) {
	e.preventDefault();
	$('#loadingAuthor').show();
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'scripts/tiss_search.php',
		data: { name : $("#inputName").val() },
		success: function(result) {
			authorDetails(result);
		},
		error: function(exception) {
			alert("Could not connect to TISS.\nPlease enter author details manually!");
		},
		complete: function() {
			$('#loadingAuthor').hide();
			$('#formAuthor').collapse('show');
			$("html, body").animate({ scrollTop: $('#authorInfo').offset().top }, 500);
		}
	});
});

// Select Name Button inside Modal
$('#buttonSelectName').on('click', function (e) {
	e.preventDefault();
	setDetails($("#selectName").val());
	$('#selectNameModal').modal('hide');
});

// Submit author info
$('#formAuthor').on('submit', function (e) {
	e.preventDefault();
	$('#formData').collapse('show');
	$("html, body").animate({ scrollTop: $('#data').offset().top }, 500);
});

// Format Size
// by Lan Qingyong - github.com/lanqy
function formatBytes(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

// File Upload
$("#inputUpload").on('change', function() {
	for(var i=0; i<$("#inputUpload")[0].files.length; i++) {
		formdata = new FormData();
		formdata.append("file", $("#inputUpload")[0].files[i]);

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: 'scripts/file_analyze.php',
			data: formdata,
			processData: false,
			contentType: false,
			success: function (result) {
				
				var new_file = $('.dynamic-element').first().clone();
				
				new_file.find('#fileName').val(result.name);
				new_file.find('#fileMime').val(result.mime);
				new_file.find('#fileSize').val(formatBytes(result.size));
				new_file.find('#fileCount').val(1);
				new_file.find('#fileUse').val("output");
				
				new_file.appendTo('#dynamicFiles').show();
		
				$('.file-delete').on('click', function (e) {
					e.preventDefault();
					$(this).closest('.form-group').remove();
				});
			}
		});
	}
});

// Add manually button
$('#buttonAddManually').on('click', function (e) {
	e.preventDefault();
	var new_file = $('.dynamic-element').first().clone();
	new_file.find('#fileName').val("");
	new_file.find('#fileMime').val("");
	new_file.find('#fileSize').val("");
	new_file.find('#fileCount').val(1);
	new_file.find('#fileUse').val("output");
	new_file.appendTo('#dynamicFiles').show();
});

// Submit data
$('#formData').on('submit', function (e) {
	e.preventDefault();
	$('#formRepository').collapse('show');
	$("html, body").animate({ scrollTop: $('#repository').offset().top }, 500);
});

$('#buttonSearchRepo').on('click', function (e) {
	e.preventDefault();
	search_repositories();
});

// Submit repo
$('#formRepository').on('submit', function (e) {
	e.preventDefault();
	$('#formLicense').collapse('show');
	$("html, body").animate({ scrollTop: $('#license').offset().top }, 500);
});

// Submit license
$('#formLicense').on('submit', function (e) {
	e.preventDefault();
	var json_out = {
		'dmp' : {
			'project' : $('#inputProject').val(),
			'author' : {
				'title' : $("#inputTitle").val(),
				'firstname' : $("#inputFirstName").val(),
				'lastname' : $("#inputLastName").val(),
				'email' : $("#inputEmail").val(),
				'institute' : $("#inputInstitute").val()
			},
			'data' : '',
			'repository' : $("input[name='repoRadio']:checked").val(),
			'license' : $('#licenseField').val()
		}
    };
	
	$('#finishedPlan').empty();
	$('#finishedPlan').append('<dl><dt>Project title</dt>');
	$('#finishedPlan').append('<dd>'+json_out.dmp.project+'</dd>');
	$('#finishedPlan').append('<dt>Author</dt>');
	$('#finishedPlan').append('<dd>- <span class="font-weight-light">Title:</span> '+json_out.dmp.author.title+'</dd>');
	$('#finishedPlan').append('<dd>- <span class="font-weight-light">First name:</span>: '+json_out.dmp.author.firstname+'</dd>');
	$('#finishedPlan').append('<dd>- <span class="font-weight-light">Last name:</span> '+json_out.dmp.author.lastname+'</dd>');
	$('#finishedPlan').append('<dd>- <span class="font-weight-light">Email:</span> '+json_out.dmp.author.email+'</dd>');
	$('#finishedPlan').append('<dd>- <span class="font-weight-light">Institute:</span> '+json_out.dmp.author.institute+'</dd>');
	$('#finishedPlan').append('<dt>Data</dt>');
	
	// Get all entries from the data section into a jobj
	var data = [];
	$('.dynamic-element').each(function() {
		var mime = $(this).find('#fileMime').val();
        var count = $(this).find('#fileCount').val();
		var use = $(this).find('#fileUse').val();
		
		if(mime) {
			entry = {};
			entry['mime-type'] = mime;
			entry['count'] = count;
			entry['use'] = use;

			data.push(entry);
		
			$('#finishedPlan').append('<dd>- <span class="font-weight-light">'+use+':</span> '+count+'x '+mime+'</dd>');
		}
    });
	
	json_out.dmp.data = data;
	
	$('#finishedPlan').append('<dl><dt>Repository</dt>');
	$('#finishedPlan').append('<dd>- '+json_out.dmp.repository+'</dd>');
	$('#finishedPlan').append('<dl><dt>License</dt>');
	$('#finishedPlan').append('<dd>- '+json_out.dmp.license+'</dd></dl>');
	
	$('#finishedJSON').text(JSON.stringify(json_out, null, 4));
	
	$('#overviewField').collapse('show');
	$("html, body").animate({ scrollTop: $('#overview').offset().top }, 500);
});
