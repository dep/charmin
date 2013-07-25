function set_defaults() {
    if(!localStorage.getItem("charmin_tp2_redirect")) {
        localStorage.setItem("charmin_tp2_redirect", "yes");
    }
}

function save_options() {
    if($("#tp2_redirect").is(":checked")) {
        localStorage.setItem("charmin_tp2_redirect", "yes");
    } else {
        localStorage.setItem("charmin_tp2_redirect", "no");
    }
}

function load_options() {
    if(localStorage.getItem("charmin_tp2_redirect") == "yes") {
        $("#tp2_redirect").prop("checked", true);
    } else {
        $("#tp2_redirect").prop("checked", false);
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
