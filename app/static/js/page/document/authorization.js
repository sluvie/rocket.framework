$(document).ready(function () {
    console.log("Ready.");

    $.LoadingOverlay("show");

    initialize_component();

    // data grid
    initialize_data();

    $.LoadingOverlay("hide");
});



function pictype_onchange(value) {
    // pemohon
    if (value == "0") {
        $("#master-pic-select").hide(100);
        $("#free-text-select").show(100);
    }
    else {
        $("#master-pic-select").show(100);
        $("#free-text-select").hide(100);
        
        $("#authorization-picapproval-select").val(0);
        approvaltype_onchange(0);
        prepare_approval("authorization-picid-select", $("#authorization-picdivision-select").val());
    }
}

function approvaltype_onchange(value) {
    if (value == "0") {
        $("#division-pic-select").hide(100);
        $("#free-text-select").show(100);
    }
    else {
        $("#division-pic-select").show(100);
        $("#free-text-select").hide(100);
    }
}

// select approval type
$('#authorization-picapproval-select').on('change', function() {
    approvaltype_onchange(this.value);
});


$('#authorization-pictype-select').on('change', function() {
    pictype_onchange(this.value);
});


function prepare_parentlevel(container) {
    var url = url_pic_parentapproval + "/" + $("#documentid-text").val();
    var params = null;

    function success_callback(data) {
        $('#' + container).children().remove().end();
        data.data.forEach(element => {
            pictype = (element.pictype == "0" ? "Pemohon" : (element.pictype == "1" ? "Mengetahui" : "Menyetujui"))
            $("#" + container).append('<option value='+ element.piclevel +'>' + element.piclevel + ". " + pictype + '</option>');
        });
    }

    function error_callback() {
    }

    page.read_data(url, params, 'GET', success_callback, error_callback);
}


function initialize_component() {
    $("#master-pic-select").hide(100);
    $("#free-text-select").show(100);

    $("#authorization-description-text").val("");

    prepare_division("authorization-picdivision-select");
    prepare_parentlevel("authorization-pic-parentlevel-select");

    // select divison on change
    $('#authorization-picdivision-select').on('change', function() {
        prepare_approval("authorization-picid-select", this.value);
    });
}


function initialize_data() {
    var url = url_master_approvals + "/" + $("#documentid-text").val();

    function success_callback(data) {
        $.grid_main("grid-main", data.data, "masterapproveid", browse_column());
    }

    function error_callback() {
    }

    page.read_data(url, null, 'GET', success_callback, error_callback);
}


function delete_approval(approveid) {
    var url = url_delete_approval;
    var params = {
        "approveid": approveid
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


/* define the column of the grid  */
browse_column = function () {
    return [
        {
            caption: "#",
            width: 100,
            fixed: true,
            headerCellTemplate: function (header, info) {
                $('<a>New</a>')
                    .attr('href', '#')
                    .click(function () {
                        $("#authorization-description-text").val("");
                        $("#authorization-pictype-select").val(0);
                        $("#master-pic-select").hide(100);
                        $("#free-text-select").show(100);
                        $("#authorization-mandatory-check").prop("checked", false);
                        $("#authorization-modal").modal('show');
                    })
                    .appendTo(header);
            },
            cellTemplate: function (container, info) {
                var $el = $('<div class="row ml-1 mr-1"></div>');
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
                                delete_approval(info.data.masterapproveid);
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
            dataField: "pictype",
            caption: "Type",
            alignment: 'center',
            cellTemplate: function (container, options) {
                if (options.value == "0") {
                    $('<span>Pemohon</span>').appendTo(container);
                }
                else if (options.value == "1") {
                    $('<span>Mengetahui</span>').appendTo(container);
                }
                else if (options.value == "2") {
                    $('<span>Menyetujui</span>').appendTo(container);
                }
            },
        },
        {
            dataField: "piclevel",
            caption: "PIC Level",
            alignment: 'center',
        },
        {
            dataField: "picsublevel",
            caption: "PIC Sub Level",
            alignment: 'center',
        },
        {
            dataField: "picid",
            caption: "PIC ID"
        },
        {
            dataField: "picname",
            caption: "PIC Name"
        },
        {
            dataField: "description",
            caption: "Description"
        },
        {
            dataField: "mandatory",
            caption: "Is Mandatory?",
            alignment: 'center',
            cellTemplate: function (container, options) {
                if (options.value == "1") {
                    $('<h6><span class="badge badge-success col">Mandatory</span></h6>').appendTo(container);
                }
                else if (options.value == "0") {
                    $('<h6><span class="badge badge-danger col">Not Mandatory</span></h6>').appendTo(container);
                }
            },
        },
    ];
}


$(document).on("click", ".btn-save", function () {
    var url = url_insert_approval;

    var picid = $("#authorization-picid-select").val();
    if ($("#authorization-pictype-select").val() == "0") {
        picid = "";
    }
    if ($("#authorization-picapproval-select").val() == "0") {
        picid = "";
    }

    // check for mandatory
    var mandatory_check = "0";
    if ($('#authorization-mandatory-check').is(":checked"))
    {
        mandatory_check = "1";
    }

    // check for sublevel
    var sublevel_check = "0";
    if ($('#authorization-sublevel-check').is(":checked"))
    {
        sublevel_check = "1";
    }
    var piclevel = 0;
    if (sublevel_check == "1") {
        piclevel = $("#authorization-pic-parentlevel-select").val();
    }

    var params = {
        "documentid": $("#documentid-text").val(),
        "picid": picid,
        "piclevel": piclevel,
        "pictype": $("#authorization-pictype-select").val(),
        "mandatory": mandatory_check,
        "description": $("#authorization-description-text").val()
    }

    $.LoadingOverlay("show");
    function success_callback(data) {
        if (data.success == "1") {
            initialize_data();
            $("#authorization-modal").modal('hide');
        }
        $.LoadingOverlay("hide");
    }

    function error_callback() {
        $.LoadingOverlay("hide");
    }

    page.read_data(url, params, 'POST', success_callback, error_callback);
});