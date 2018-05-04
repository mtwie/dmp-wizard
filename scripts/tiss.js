function setDetails(id) {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'scripts/tiss_details.php',
		data: { "id" : id },
		success: function(result) {
			$("#inputTitle").val(result.title[0]);
			$("#inputFirstName").val(result.firstname[0]);
			$("#inputLastName").val(result.lastname[0]);
			$("#inputEmail").val(result.email[0]);
			$("#inputInstitute").val(result.institute[0]);
		},
		error: function(exception) {
			alert("Could not get Author details.\nPlease enter manually!");
		},
	});
}

// Cover all cases, generate Dialog in case of multiple TISS entries
function authorDetails(json) {
	switch(json.total_results) {
		case 0:
			alert("No record found on TISS.\nPlease enter author details manually!");
			break;
		case 1:
			setDetails(json.results[0].id);
			break;
		default:
			$sel = $('#selectName').empty();
			var num = ((json.total_results > 15) ? 15 : json.total_results);
			for (i = 0; i < num; i++) { 
				$sel.append('<option value=' + json.results[i].id + '>' + json.results[i].firstname + ' ' + json.results[i].lastname + '</option>');
				$('#selectNameModal').modal('show');
			}
	}
}
