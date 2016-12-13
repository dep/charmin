Mousetrap.bind(['-'], function(e) {
    inject(['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) - 1;',
            '$(".ui-slider").slider("option", "value", slider_val);'].join('\n'));
});
Mousetrap.bind(['+'], function(e) {
    inject(['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) + 1;',
            '$(".ui-slider").slider("option", "value", slider_val);'].join('\n'));
});
Mousetrap.bind(['l'], function(e) {
    $('.tau-icon-search').click();
    $('.i-role-search-string').select();
    $('.i-role-search-string').val('').select();
}, 'keyup');
Mousetrap.bind(['u'], function(e) {
    if ($(".tau-selected").length) {
        make_action_container();
        var title = "https://" + document.domain + "/entity/" + get_active_id();
        $(".action_container input").prop("readonly", true);
        $(".action_container input").val(title);
        $(".action_container input").select();

        setTimeout(function() {
            destroy_action_container();
        }, 1500);
    }
});
Mousetrap.bind(['t'], function(e) {
    if ($(".tau-selected").length) {
        make_action_container();
        var title = "TP #" + get_active_id() + ": " + $(".tau-board .tau-selected").first().find(".tau-entity-full-name").html()
        $(".action_container input").prop("readonly", true);
        $(".action_container input").val(title);
        $(".action_container input").select();

        setTimeout(function() {
            destroy_action_container();
        }, 1500);
    }
});
Mousetrap.bind(['c'], function(e) {
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
});
Mousetrap.bind(['e'], function(e) {
    destroy_action_container();
    $(".tau-collapsed button[role='collapser']").click();
});
Mousetrap.bind(['m'], function(e) {
    $(".tau-app-secondary-pane button[role='collapser']").click();
    inject('$(".selected_item").trigger("mouseout")');
});
Mousetrap.bind(['esc'], function(e) {
    destroy_action_container();
    $("div[role=card]").fadeIn();
});

$("div[role=card]").live("click", function(event) {
    destroy_action_container();
});

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

function get_active_id() {
    return $(".tau-board .tau-selected").first().data("entity-id");
}
