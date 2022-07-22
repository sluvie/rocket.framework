$(document).ready(function () {
    console.log("Ready.");

    $.LoadingOverlay("show");

    prepare_form_filter();

    // data grid
    initialize_data();

    $.LoadingOverlay("hide");
});


function prepare_form_filter() {
    var current_year = new Date().getFullYear();
    for (var i = current_year; i >= 2022; i--) {
        $("#select-year-filter").append('<option value='+ i +'>'+ i +'</option>');
    }
}


function initialize_data() {
    var data = {
        "documentid": "",
        "documentname": "",
        "notes": "",
        "latestapproval": "",
        "createdby": "",
        "division": "",
        "modifieddate": "",
    }
    $.grid_main("grid-main", data, "documentid", browse_column());
}


$(document).on("click", ".btn-filter", function () {
    var period = $("#select-year-filter").val();
    var status = $("#select-status-approval").val();
    var url = url_monitoring_trackingworkflow + "/" + period + "/" + status;

    $.LoadingOverlay("show");
    function success_callback(data) {
        $.grid_main("grid-main", data.data, "documentid", browse_column());
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
            dataField: "documentid",
            caption: "Document Id"
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
            dataField: "latestapproval",
            caption: "Latest Approval"
        },
        {
            dataField: "name",
            caption: "Created By"
        },
        {
            dataField: "division",
            caption: "Division"
        },
        {
            dataField: "modifieddate",
            caption: "Modif Date",
            dataType: "date",
            format: "yyyy-MM-dd",
            alignment: 'center',
        },
    ];
}