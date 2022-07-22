// documents
url_master_documents = "/document/api/1.0/documents";
url_delete_document = "/document/api/1.0/document/delete";

// authorizations
url_master_approvals = "/document/api/1.0/approvals/";
url_insert_approval = "/document/api/1.0/approvals/insert";
url_delete_approval = "/document/api/1.0/approvals/delete";
url_pic_parentapproval = "/document/api/1.0/approval/parent/";

// design documents
url_designdocument_groupquestions = "/document/api/1.0/designdocument/groupquestions/";
url_insert_designdocument_groupquestion = "/document/api/1.0/designdocument/groupquestion/insert";
url_delete_designdocument_groupquestion = "/document/api/1.0/designdocument/groupquestion/delete";
url_insert_designdocument_question = "/document/api/1.0/designdocument/question/insert"

// design documents (question condition)
url_designdocument_questioncondition = "/document/api/1.0/designdocument/question/condition/";

// division
url_master_divisions = "/division/api/1.0/divisions";
url_orange_pic_approvals = "/orange/api/1.0/picapprovals";

// clients
url_master_clients = "/client/api/1.0/clients";
url_profile_client = "/client/api/1.0/profile";

// submissions
url_transaction_submissions = "/submission/api/1.0/submissions";

// monitorings
url_monitoring_documents = "/monitoring/api/1.0/documents";
url_monitoring_trackingworkflow = "/monitoring/api/1.0/trackingworkflow";    


/** GRID **/

/* create the grid and connect the data */
$.grid_main = function (panel, data, key, browse_column) {
    $('#' + panel).dxDataGrid({
        dataSource: data,
        keyExpr: key,
        selection: {
            mode: 'single',
        },
        hoverStateEnabled: true,
        grouping: {
            autoExpandAll: true,
        },
        groupPanel: {
            visible: true,
        },
        columnAutoWidth: true,
        columns: browse_column,
        showBorders: true,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: 'Search...',
        },
        headerFilter: {
            visible: true,
        },
        scrolling: {
            rowRenderingMode: 'virtual',
        },
        paging: {
            pageSize: 20,
        },
        pager: {
            visible: true,
            allowedPageSizes: [10, 20, 50, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        export: {
            enabled: true,
            allowExportSelectedData: true,
            fileName: "excel-" + uuidv4()
        }
    });
}

/** FUNCTIONS **/

// division 
function prepare_division(container) {
    var url = url_master_divisions;
    var params = null;

    function success_callback(data) {
        $('#' + container).children().remove().end();
        data.data.forEach(element => {
            $("#" + container).append('<option value='+ element.divisionid +'>'+ element.divisionname +'</option>');
        });
    }

    function error_callback() {
    }

    page.read_data(url, params, 'GET', success_callback, error_callback);
}


// pic approval based on division 
function prepare_approval(container, divisionid) {
    var url = url_orange_pic_approvals + "/" + divisionid;
    var params = null;

    function success_callback(data) {
        $('#' + container).children().remove().end();
        data.data.forEach(element => {
            $("#" + container).append('<option value='+ element.employeeid +'>'+ element.displayname +'</option>');
        });
    }

    function error_callback() {
    }

    page.read_data(url, params, 'GET', success_callback, error_callback);
}