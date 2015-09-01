// keypress listeners
$("body").live("keypress", function(event) {
    code = event.keyCode;

    if (nothing_focused()) {
        /* - */
        if (code == "45") {
            inject(['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) - 1;',
                    '$(".ui-slider").slider("option", "value", slider_val);'].join('\n'));
        /* + */
        } else if (code == "43") {
            inject(['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) + 1;',
                    '$(".ui-slider").slider("option", "value", slider_val);'].join('\n'));
        /* n */
        } else if (code == "110") {
            if (in_case()) {
                $(".tau-view-quick-add").click();
            } else {
                $(".tau-quick-add").click();
            }
        /* u */
        } else if (code == "117") {
            if (in_case()) {
                $(".tau-button-link").click();
            } else {
                if ($(".tau-boardclipboard__holder .tau-selected").length) {
                    make_action_container();
                    var title = "http://" + document.domain + "/entity/" + get_active_id();
                    $(".action_container input").prop("readonly", true);
                    $(".action_container input").val(title);

                    $(".action_container input").select();
                }
            }
        /* esc */
        } else if (code == "127") {
        /* t */
        } else if (code == "116") {
            if (in_case()) {
                $(".ui-tags__editor > *").click();
                $(".ui-tags__editor input").focus();
                setTimeout('$(".ui-tags__editor-active input").val("")', 1);
            } else {
                if ($(".tau-boardclipboard__holder .tau-selected").length) {
                    make_action_container();
                    var title = "TP #" + get_active_id() + ": " + $(".tau-selected .tau-name").html()
                    $(".action_container input").prop("readonly", true);
                    $(".action_container input").val(title);
                    $(".action_container input").select();
                }
            }
        /* o */
        } else if (code == "111") {
            if ($(".tau-boardclipboard__holder .tau-selected").length) {
                search_for(get_active_id());
            }
        /* shift-o */
        } else if (code == "79") {
            if ($(".tau-boardclipboard__holder > div").length) {
                $(".tau-boardclipboard__holder > div").each(function() {
                    if (event.shiftKey == true) {
                        chrome.extension.sendMessage({url: "http://" + document.domain + "/entity/" + $(this).attr("data-entity-id") }, function(response) { });
                    }
                });
            }
        } else if (code == "108") {
            make_action_container('enter bug/story ID (comma separated IDs open in tabs)');
            var id_array = new Array();
            $("div[role=card]").each(function() {
                id_array.push($(this).attr("data-entity-id"));
            });
            $(".action_container input").keyup(function(event) {
                action_input = $(this);
                action_input.val(action_input.val().replace(/[^0-9.,]/g, ""));
                event.preventDefault();
                if (event.keyCode == 13) {
                    ids = $(".action_container input").val();
                    if (event.shiftKey == true || ids.match(",")) {
                        var url_array = ids.split(",");
                        for (var x=0; x < url_array.length; x++) {
                            chrome.extension.sendMessage({url: "http://" + document.domain + "/entity/" + url_array[x]}, function(response) { });
                        }
                    } else {
                        search_for(ids);
                    }
                    destroy_action_container();
                } else {
                    var search = action_input.autocomplete({
                        source: id_array
                    });
                }
            });
        /* / */
        } else if (code == "47" && event.shiftKey != true) {
            $("div[role=card]").fadeIn();
            make_action_container('Start typing to find a card by title');
            var name_array = new Array();
            $("div[role=card] .tau-name").each(function() {
                name_array.push($(this).html());
            });
            $(".action_container input").keyup(function(event) {
                if (event.keyCode != 27) {
                    var search = $(this).autocomplete({
                        source: name_array
                    });
                    $("div[role=card]").each(function() {
                        card = $(this);
                        if(card.data("card-data").name.toLowerCase().match($(".action_container input").val().toLowerCase()) || card.attr("data-entity-id").match($(".action_container input").val().toLowerCase())) {
                            card.fadeIn();
                        } else {
                            card.fadeOut();
                        }
                    });
                } else {
                    $("div[role=card]").fadeIn();
                }
                if (event.keyCode == 13) {
                    $("div[role=card]").each(function() {
                        if ($(this).is(":visible")) {
                            $(this).addClass("tau-selected");
                        }
                    });
                    search_for(get_active_id());
                    $("div[role=card]").removeClass("tau-selected");
                }
            });
        } else if (code == "109") {
            $(".tau-app-secondary-pane button[role='collapser']").click();
            inject('$(".selected_item").trigger("mouseout")');
        /* expand/collapse */
        /* c */
        } else if (code == "99") {
            if (in_case() == true) {
                $(".ui-comments-add-link").click();
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
        /* e */
        } else if (code == "101") {
            destroy_action_container();
            $(".tau-collapsed button[role='collapser']").click();
        /* ? */
        } else if (code == "63" && event.shiftKey == true) {
            if ($("#advanced_shortcuts").is(":visible") == true) {
                $("#advanced_shortcuts").hide();
            } else {
                $("#advanced_shortcuts").show();
            }
        }
    }
});

// keyup listener, for aborting searches, etc.
$("body, .action_container input").live("keyup", function(event) {
    code = event.keyCode;
    if (code == "67" || code == "91") {
        if ($(".action_container input").prop("readonly") == true) {
            destroy_action_container();
        }
    }
    /* esc */
    if (code == "27") {
        if (!in_case()) {
            $(".tau-clear-selection").click();
            destroy_action_container();
            $("div[role=card]").fadeIn();
        }
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

// Check for focused elements
function nothing_focused() {
    var active_el = $(document.activeElement);
    if (document.activeElement.tagName == "BODY") {
        return true;
    }
}

// Search trigger
function search_for(id) {
    $(".i-role-search-string").val(id);
    inject(['$(".i-role-search-string").submit()']);
}

// Grab url param
function getVal(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null ) {
        return "";
    } else {
        return results[1];
    }
}

function in_case() {
    return $(".ui-popup-content").is(":visible") || $(".tau-page-single").is(":visible");
}

function make_help() {
    $("body").append(["<div style='display:none' id='advanced_shortcuts' class='general'>",
                        "<strong>Charmin:</strong><br>",
                        "? = show/hide this window<br><br>",
                        "<strong>Navigation</strong><br>",
                        "l = <strong>l</strong>eap to a specific case (comma separated IDs open in tabs)<br>",
                        "/ = enter type-ahead mode<br>",
                        "m = Toggle side <strong>m</strong>enu expand/collapse<br>",
                        "- = zoom out cards<br>",
                        "+ = zoom in cards<br>",
                        "n = add a <strong>n</strong>ew case<br>",
                        "e = <strong>e</strong>xpand all horizontal/vertical groups<br>",
                        "c = <strong>c</strong>ollapse all horizontal/vertical groups<br><br>",
                        "<strong>Selected Item:</strong><br>",
                        "[enter] = open selected board<br>",
                        "t = expose the ID/<strong>t</strong>itle of selected card<br>",
                        "u = expose the <strong>U</strong>RL of the selected card<br>",
                        "o = <strong>o</strong>pen first selected card<br>",
                        "shift-o = <strong>O</strong>pen selected cards in tabs<br><br>",
                        "<strong>From Within a Case:</strong><br>",
                        "c = add a <strong>c</strong>omment<br>",
                        "n = add a <strong>n</strong>ew case<br>",
                        "t = add a <strong>t</strong>ag<br>",
                        "u = expose the <strong>U</strong>RL of the open case<br>",
                        "[esc] = clear selected cards",
                      "</div>"].join('\n'));
}

function get_active_id() {
    return $(".tau-boardclipboard__holder > div").first().data("entity-id");
}
