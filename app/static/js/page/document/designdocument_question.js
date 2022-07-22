var multichoice = [];

$(document).ready(function () {
    console.log("Ready.");

    $.LoadingOverlay("show");

    initialize_component();

    // data grid
    initialize_data_question();

    $.LoadingOverlay("hide");
});


function initialize_component() {
    $("#question-question-text").val("Change this question.");
    $("#label-question").text("Change this question.");
    refresh_component_preview("1");
    $("#question-preview-area-select").hide(100);
    $(".mandatory-sign").hide();
    $("#freetext-area").show(100);
    $("#multichoice-area").hide(100);
    $("#masterview-area").hide(100);
}


function initialize_data_question() {
    var url = url_designdocument_groupquestions + "/" + $("#documentid-text").val();

    function success_callback(data) {
        $.grid_main("grid-main-question", data.data, "designdocumentquestionid", browse_column_question());
    }

    function error_callback() {
    }

    page.read_data(url, null, 'GET', success_callback, error_callback);
}


/* define the column of the grid  */
browse_column_question = function () {
    return [
        {
            caption: "#",
            width: 150,
            fixed: true,
            headerCellTemplate: function (header, info) {
                $('<a>New</a>')
                    .attr('href', '#')
                    .click(function () {
                        initialize_component();
                        $("#question-modal").modal("show");
                    })
                    .appendTo(header);
            },
            cellTemplate: function (container, info) {
                var $el = $('<div class="row ml-1 mr-1"></div>');
                $('<a class="btn btn-sm btn-dark col"><i class="fa fa-pen" aria-hidden="true"></i> Edit</a>')
                    .attr('href', '#')
                    .click(function () {
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
            dataField: "question",
            caption: "Question",
        },
        {
            dataField: "questiontype",
            caption: "Type",
            cellTemplate: function (container, options) {
                if (options.value == "1") {
                    $('<h6><span class="col">Multiple</span></h6>').appendTo(container);
                }
                else if (options.value == "0") {
                    $('<h6><span class="col">Single</span></h6>').appendTo(container);
                }
            },
        },
        {
            dataField: "questioncondition",
            caption: "Condition",
            cellTemplate: function (container, options) {
                if (options.value == "0") {
                    $('<h6><span class="col">Free Text</span></h6>').appendTo(container);
                }
                else if (options.value == "1") {
                    $('<h6><span class="col">Multiple Custom</span></h6>').appendTo(container);
                }
                else if (options.value == "2") {
                    $('<h6><span class="col">Department</span></h6>').appendTo(container);
                }
                else if (options.value == "3") {
                    $('<h6><span class="col">Division</span></h6>').appendTo(container);
                }
                else if (options.value == "4") {
                    $('<h6><span class="col">PIC</span></h6>').appendTo(container);
                }
            },
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


/* question text on change */
$('#question-question-text').on('keyup', function () {
    $("#label-question").text(this.value);
});
/* question text on change */


/* question condition select on change */
function refresh_component_preview_select(statuscondition) {
    if (statuscondition == 1) {
        var $options = $("#question-multichoice-select > option").clone();
        $('#question-preview-copy-select').children().remove().end();
        $('#question-preview-copy-select').append($options);
    }
    else if (statuscondition == 2) {
        // copy from master view select
        var $options = $("#question-masterview-select > option").clone();
        $('#question-preview-copy-select').children().remove().end();
        $('#question-preview-copy-select').append($options);
    }

    $("#question-preview-area").hide(100);
    $("#question-preview-area-select").show(100);
}

function questioncondition_onchange(value, statuscondition) {
    // status condition
    $("#freetext-area").hide(100);
    $("#multichoice-area").hide(100);
    $("#masterview-area").hide(100);
    if (statuscondition == 0) { // free text
        $("#freetext-area").show(100);
        $("#question-preview-area").show(100);
        $("#question-preview-area-select").hide(100);
    }
    else if (statuscondition == 1) { // multi choice
        // show the data
        // TODO: create select multichoice
        $("#multichoice-area").show(100);
        refresh_component_preview_select(statuscondition);
    }
    else if (statuscondition == 2) { // master
        // show the data
        $.LoadingOverlay("show");
        function success_callback(data) {
            if (data.success == "1") {
                $('#question-masterview-select').children().remove().end();
                data.data.forEach(element => {
                    $("#question-masterview-select").append('<option value=' + element.code + '>' + element.value + '</option>');
                });
                $("#masterview-area").show(100);
                refresh_component_preview_select(statuscondition);
            }
            $.LoadingOverlay("hide");
        }
        function error_callback() {
            $.LoadingOverlay("hide");
        }
        var url = url_designdocument_questioncondition + "/" + $("#documentid-text").val() + "/" + value + "/" + statuscondition;
        page.read_data(url, null, 'GET', success_callback, error_callback);
    }
}


$('#question-questioncondition-select').on('change', function () {
    questioncondition_onchange(this.value, $(this).find(':selected').attr('data-statuscondition'));
});
/* question condition select on change */


/* question component select on change */
function refresh_component_preview(type_component) {
    if (type_component == "1") {
        script_component = '<input type="text" class="form-control">';
    }
    else if (type_component == "2") {
        script_component = '<textarea class="form-control" row="5"></textarea>';
    }
    $("#question-preview-area").html(script_component);
}
$('#freetext-component-select').on('change', function () {
    refresh_component_preview(this.value);
});
/* question component select on change */


/* mandatory on change */
$('#question-mandatory-check').on('change', function () {
    var value = $(this).is(":checked");
    if (value) {
        $(".mandatory-sign").show();
    }
    else {
        $(".mandatory-sign").hide();
    }
});
/* mandatory on change */


/* multichoice */
function clone_multichoice() {
    var $options = $("#question-multichoice-select > option").clone();
    $('#question-preview-copy-select').children().remove().end();
    $('#question-preview-copy-select').append($options);
}

$(document).on("click", ".btn-add-multichoice", function () {
    var value = $("#question-multichoice-text").val();
    var data = {
        "code": uuidv4(),
        "value": value
    }
    multichoice.push(data);
    $("#question-multichoice-select").append('<option value=' + data.code + '>' + data.value + '</option>');
    $("#question-multichoice-text").val("");
    $("#question-multichoice-select").val(data.code);
    clone_multichoice();
});

$(document).on("click", ".btn-remove-multichoice", function () {
    var code = $("#question-multichoice-select").val();

    var index = -1;
    var pos = 0;
    multichoice.forEach(element => {
        if (element.code == code) {
            index = pos;
        }
        pos++;
    });
    if (index !== -1) {
        multichoice.splice(index, 1);
    }

    $('#question-multichoice-select').children().remove().end();
    multichoice.forEach(element => {
        $("#question-multichoice-select").append('<option value=' + element.code + '>' + element.value + '</option>');
    });
    clone_multichoice();
});
/* multichoice */


/* save */
$(document).on("click", ".btn-save-question", function () {
    var url = url_insert_designdocument_question;

    // check for mandatory
    var mandatory_check = "0";
    if ($('#authorization-mandatory-check').is(":checked"))
    {
        mandatory_check = "1";
    }

    var params = {
        "questionid": $("#questionid-text").val(),
        "groupquestionid": $("#question-groupquestionid-text").val(),
        "documentid": $("#question-documentid-text").val(),
        "question": $("#question-question-text").val(),
        "questiontype": $("#question-questiontype-select").val(),
        "questioncondition": $("#question-questioncondition-select").val(),
        "mandatory": mandatory_check,
        "questiontypecomponent": $("#freetext-component-select").val()
    }

    $.LoadingOverlay("show");
    function success_callback(data) {
        if (data.success == "1") {
            initialize_data_question();
            $("#question-modal").modal('hide');
        }
        $.LoadingOverlay("hide");
    }

    function error_callback() {
        $.LoadingOverlay("hide");
    }

    page.read_data(url, params, 'POST', success_callback, error_callback);
});
/* save */