Mousetrap.bind(['-'], function(e) {
    inject(['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) - 1;',
            '$(".ui-slider").slider("option", "value", slider_val);'].join('\n'));
});
Mousetrap.bind(['+'], function(e) {
    inject(['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) + 1;',
            '$(".ui-slider").slider("option", "value", slider_val);'].join('\n'));
});
Mousetrap.bind(['l'], function(e) {
    if (in_case()) {
        $('.close').click();
    }
    $('.tau-icon-search').click();
    $('.i-role-search-string').select();
    $('.i-role-search-string').val('').select();
}, 'keyup');
Mousetrap.bind(['n'], function(e) {
    $(".tau-btn-quick-add").click();
});
Mousetrap.bind(['u'], function(e) {
    if (in_case()) {
        $(".tau-sharelink__trigger").click();
    } else {
        if ($(".tau-boardclipboard__holder .tau-selected").length) {
            make_action_container();
            var title = "https://" + document.domain + "/entity/" + get_active_id();
            $(".action_container input").prop("readonly", true);
            $(".action_container input").val(title);
            $(".action_container input").select();

            setTimeout(function() {
                destroy_action_container();
            }, 1500);
        }
    }
});
Mousetrap.bind(['t'], function(e) {
    if (in_case()) {
        $(".ui-tags__editor > *").click();
        setTimeout('$(".ui-tags__editor__input").val("")', 1);
        $(".ui-tags__editor__input").focus();
    } else {
        if ($(".tau-boardclipboard__holder .tau-selected").length) {
            make_action_container();
            var title = "TP #" + get_active_id() + ": " + $(".tau-selected .tau-name").html()
            $(".action_container input").prop("readonly", true);
            $(".action_container input").val(title);
            $(".action_container input").select();

            setTimeout(function() {
                destroy_action_container();
            }, 1500);
        }
    }
});
Mousetrap.bind(['c'], function(e) {
    if (in_case()) {
        inject(['$(".add-link.i-role-actionadd").click()']);
    } else {
        $('.warning').remove();
        $('body').append('<div class="warning">All swimlanes collapsed (undo with "<strong>e</strong>" keystroke)</div>');
        $('.warning').slideDown();
        setTimeout(function() {
            $('.warning').slideUp();
        }, 3000);

        $("li[role='cellholder']").each(function() {
            if (!$(this).hasClass("tau-collapsed")) {
                $(this).find("button[role='collapser']").click();
            }
        });
    }
});
Mousetrap.bind(['m'], function(e) {
    $(".tau-app-secondary-pane button[role='collapser']").click();
    inject('$(".selected_item").trigger("mouseout")');
});
Mousetrap.bind(['e'], function(e) {
    destroy_action_container();
    $(".tau-collapsed button[role='collapser']").click();
});
Mousetrap.bind(['?'], function(e) {
    if ($("#advanced_shortcuts").is(":visible") == true) {
        $("#advanced_shortcuts").hide();
    } else {
        $("#advanced_shortcuts").show();
    }
});
Mousetrap.bind(['esc'], function(e) {
    if (!in_case()) {
        $(".tau-icon-small-close").click();
        destroy_action_container();
        $("div[role=card]").fadeIn();
    }
});

$("div[role=card]").live("click", function(event) {
    destroy_action_container();
});

// Generate help modal
make_help();

// Action modal (for leaping, etc)
function make_action_container(placeholder) {
    if (!placeholder) {
        placeholder = ""
    }
    destroy_action_container();
    $("body").before("<div class='action_container'><input type='text' placeholder='" + placeholder + "'></div>");
    $(".action_container").slideDown(100, function() {
        $(".action_container input").focus();
    });
    $(".action_container input").keyup(function(event) {
        if (event.keyCode == 27) {
        }
    });
}
function destroy_action_container() {
    $(".close").click();
    $(".action_container").slideUp(100, function() {
        $(this).remove();
    });
}

// Code injection
function inject(code) {
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}

// Search trigger
function search_for(id) {
    $(".i-role-search-string").val(id);
    inject(['$(".i-role-search-string").trigger($.Event( "keypress", { which: 13 } ))']);
}

function in_case() {
    return $(".ui-popup-content").is(":visible") || $(".tau-page-single").is(":visible");
}

function make_help() {
    $("body").append(["<div style='display:none' id='advanced_shortcuts' class='general'>",
                        "<strong>Charmin:</strong><br>",
                        "? = show/hide this window<br><br>",
                        "<strong>Navigation</strong><br>",
                        "l = focus the search box<br>",
                        "m = Toggle side <strong>m</strong>enu expand/collapse<br>",
                        "- = zoom out cards<br>",
                        "+ = zoom in cards<br>",
                        "n = add a <strong>n</strong>ew case<br>",
                        "e = <strong>e</strong>xpand all horizontal/vertical groups<br>",
                        "c = <strong>c</strong>ollapse all horizontal/vertical groups<br><br>",
                        "<strong>Selected Item:</strong><br>",
                        "t = expose the ID/<strong>t</strong>itle of selected card<br>",
                        "u = expose the <strong>U</strong>RL of the selected card<br><br>",
                        "<strong>From Within a Case:</strong><br>",
                        "c = add a <strong>c</strong>omment<br>",
                        "n = add a <strong>n</strong>ew case<br>",
                        "t = add a <strong>t</strong>ag<br>",
                        "u = expose the <strong>U</strong>RL of the open case",
                      "</div>"].join('\n'));
}

function get_active_id() {
    return $(".tau-boardclipboard__holder > div").first().data("entity-id");
}
