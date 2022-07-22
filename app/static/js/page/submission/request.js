$(document).ready(function () {
    console.log("Ready.");

    $.LoadingOverlay("show");

    prepare_form();

    $.LoadingOverlay("hide");
});


// division 
function prepare_division() {
    var url = url_master_divisions;
    var params = null;

    function success_callback(data) {
        data.data.forEach(element => {
            $("#select-division-id").append('<option value='+ element.divisionid +'>'+ element.divisionname +'</option>');
        });
    }

    function error_callback() {
    }

    page.read_data(url, params, 'GET', success_callback, error_callback);

    // select on change
    $('#select-division-id').on('change', function() {
        prepare_approval(this.value);
    });
}


// document
function prepare_document() {
    var url = url_master_documents;
    var params = null;

    function success_callback(data) {
        console.log(data.data);
        data.data.forEach(element => {
            $("#select-document-type").append('<option value='+ element.masterdocid +'>'+ element.name +'</option>');
        });
    }

    function error_callback() {
    }

    page.read_data(url, params, 'GET', success_callback, error_callback);
}


function prepare_form() {
    prepare_division();
}