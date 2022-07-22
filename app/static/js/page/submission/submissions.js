$(document).ready(function () {
    console.log("Ready.");

    $.LoadingOverlay("show");

    prepare_form_filter();

    // data grid
    initialize_data();

    $.LoadingOverlay("hide");
});


function prepare_form_filter() {
}


function initialize_data() {
    var data = {
        "pengajuanid": "",
        "documentname": "",
        "notes": "",
        "createddate": "",
    }
    $.grid_main("grid-main", data, "pengajuanid", browse_column());
}


$(document).on("click", ".btn-filter", function () {
    var status = $("#select-status-approval").val();
    var url = url_transaction_submissions + "/" + status;

    $.LoadingOverlay("show");
    function success_callback(data) {
        $.grid_main("grid-main", data.data, "pengajuanid", browse_column());
        $.LoadingOverlay("hide");
    }

    function error_callback() {
        $.LoadingOverlay("hide");
    }

    page.read_data(url, null, 'GET', success_callback, error_callback);
});


/* define the column of the grid  */
browse_column = function () {
    return [
        {
            caption: "#",
            width: 100,
            fixed: true,
            cellTemplate: function (container, info) {
                var $el = $('<div class="row ml-1 mr-1"></div>');
                $('<a class="btn btn-sm btn-dark col-md-12"><i class="fa fa-eye" aria-hidden="true"></i> View</a>')
                    .attr('href', '#')
                    .click(function () {
                    }
                    )
                    .appendTo($el);
                container.append($el);
            },
        },
        {
            dataField: "pengajuanid",
            caption: "Request Id"
        },
        {
            dataField: "documentname",
            caption: "Document Name"
        },
        {
            dataField: "notes",
            caption: "Notes"
        },
        {
            dataField: "createddate",
            caption: "Created Date",
            dataType: "date",
            format: "yyyy-MM-dd",
            alignment: 'center',
        },
    ];
}