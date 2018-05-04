// Start Button
$('#buttonStart').on('click', function (e) {
	$('#formBasic').collapse('show');
	$("html, body").animate({ scrollTop: $('#projectBasics').offset().top }, 500);
	e.preventDefault();
});

// Submit basic info, query Tiss
$('#formBasic').on('submit', function (e) {
	$('#loadingAuthor').show();
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'scripts/tiss_search.php',
		data: { "name" : $("#inputName").val() },
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
	e.preventDefault();
});

// Select Name Button inside Modal
$('#buttonSelectName').on('click', function (e) {
	setDetails($("#selectName").val());
	$('#selectNameModal').modal('hide');
	e.preventDefault();
});

// Submit author info
$('#formAuthor').on('submit', function (e) {
	$('#formData').collapse('show');
	$("html, body").animate({ scrollTop: $('#data').offset().top }, 500);
	e.preventDefault();
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
				new_file.find('#fileUse').val("input");
				
				new_file.appendTo('#dynamicFiles').show();
		
				$('.file-delete').on('click', function (e) {
					$(this).closest('.form-group').remove();
					e.preventDefault();
				});
			}
		});
	}
});

// Add manually button
$('#buttonAddManually').on('click', function (e) {
	var new_file = $('.dynamic-element').first().clone();
	new_file.find('#fileName').val("");
	new_file.find('#fileMime').val("");
	new_file.find('#fileSize').val("");
	new_file.find('#fileCount').val(1);
	new_file.find('#fileUse').val("input");
	new_file.appendTo('#dynamicFiles').show();
	e.preventDefault();
});

// Submit author info
$('#formData').on('submit', function (e) {
	//$('#formData').collapse('show');
	$("html, body").animate({ scrollTop: $('#repository').offset().top }, 500);
	e.preventDefault();
});

