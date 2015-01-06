function set_defaults() {
    /*if(!localStorage.getItem("charmin_tp2_redirect")) {
        localStorage.setItem("charmin_tp2_redirect", "yes");
    }*/
}

function save_options() {
    // Project Name
    localStorage.setItem("charmin_tp3_project", $("#tp3_project").val());
}

function load_options() {
    // Project Name
    if (localStorage.getItem("charmin_tp3_project")) {
        $("#tp3_project").val(localStorage.getItem("charmin_tp3_project"));
    }
}

$(document).ready(function() {
    set_defaults();
    load_options();

    $("button").click(function() {
        save_options();
        $("#status").html("Saved!");
        $("#status").slideDown();
    });
});
