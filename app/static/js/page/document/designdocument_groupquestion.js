$(document).ready(function () {
    console.log("Ready.");

    $.LoadingOverlay("show");

    initialize_component();

    // data grid
    initialize_data();

    $.LoadingOverlay("hide");
});


function initialize_component() {

}


function initialize_data() {
    var url = url_designdocument_groupquestions + "/" + $("#documentid-text").val();

    function success_callback(data) {
        $.grid_main("grid-main", data.data, "designdocumentgroupquestionid", browse_column());
    }

    function error_callback() {
    }

    page.read_data(url, null, 'GET', success_callback, error_callback);
}


/* define the column of the grid  */
browse_column = function () {
    return [
        {
            caption: "#",
            width: 150,
            fixed: true,
            headerCellTemplate: function (header, info) {
                $('<a>New</a>')
                    .attr('href', '#')
                    .click(function () {
                        $("#groupquestionid-text").val("-1");
                        $("#groupquestion-title-text").val("");
                        $("#groupquestion-modal").modal('show');
                    })
                    .appendTo(header);
            },
            cellTemplate: function (container, info) {
                var $el = $('<div class="row ml-1 mr-1"></div>');
                $('<a class="btn btn-sm btn-dark col"><i class="fa fa-pen" aria-hidden="true"></i> Edit</a>')
                    .attr('href', '#')
                    .click(function () {
                        $("#groupquestionid-text").val(info.data.designdocumentgroupquestionid);
                        $("#groupquestion-title-text").val(info.data.grouptitle);
                        $("#groupquestion-modal").modal('show');
                    }
                    )
                    .appendTo($el);
                $('<a class="btn btn-sm btn-danger col"><i class="fa fa-trash" aria-hidden="true"></i> Delete</a>')
                    .attr('href', '#')
                    .click(function () {
                        Swal.fire({
                            title: 'Do you want to delete the data?',
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: 'Delete',
                            denyButtonText: `Don't delete`,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                delete_groupquestion(info.data.designdocumentgroupquestionid);
                            } else if (result.isDenied) {
                                Swal.fire('Data are not deleted', '', 'info')
                            }
                        })
                    }
                    )
                    .appendTo($el);

                container.append($el);
            },
        },
        {
            dataField: "grouptitle",
            caption: "Title",
        },
    ];
}


function delete_groupquestion(groupquestionid) {
    var url = url_delete_designdocument_groupquestion;
    var params = {
        "groupquestionid": groupquestionid
    }

    function success_callback(data) {
        if (data.success == '1') {
            Swal.fire('Delete!', '', 'success').then(function () {
                initialize_data();
            });
        }
    }

    function error_callback() {
    }

    page.read_data(url, params, 'POST', success_callback, error_callback);
}


$(document).on("click", ".btn-save-groupquestion", function () {
    var url = url_insert_designdocument_groupquestion;

    var params = {
        "documentid": $("#documentid-text").val(),
        "groupquestionid": $("#groupquestionid-text").val(),
        "grouptitle": $("#groupquestion-title-text").val(),
    }

    $.LoadingOverlay("show");
    function success_callback(data) {
        if (data.success == "1") {
            initialize_data();
            $("#groupquestion-modal").modal('hide');
        }
        $.LoadingOverlay("hide");
    }

    function error_callback() {
        $.LoadingOverlay("hide");
    }

    page.read_data(url, params, 'POST', success_callback, error_callback);
});