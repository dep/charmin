var tp_active_item = "";
var tp_first_item = "";
var tp_last_item = "";
var active_class = "";

$(document).ready(function() {
    active_class = "selected_item"
    refresh_items();
    tp_first_item.addClass(active_class);

    $("body").live("keypress", function(event) {
        code = event.keyCode;
        tp_active_item = $(".selected_item");
        prev_item = tp_active_item.prev(".tp_wrap");
        next_item = tp_active_item.next(".tp_wrap");

        var active_el = $(document.activeElement);
        if (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA"  && !active_el.hasClass("cke_wysiwyg_div")) {
            /* n or ] */
            if (code == "110" || code == "93") {
                navigate(next_item);
            /* p or [ */
            } else if (code == "112" || code == "91") {
                navigate(prev_item);
                if (tp_active_item.length < 1) {
                    tp_last_item.addClass(active_class);
                    refresh_items();
                    tp_first_item.removeClass(active_class);
                }
            /* - */
            } else if (code == "45") {
                var actualCode = ['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) - 1;',
                                  '$(".ui-slider").slider("option", "value", slider_val);'].join('\n');
                var script = document.createElement('script');
                script.textContent = actualCode;
                (document.head||document.documentElement).appendChild(script);
                script.parentNode.removeChild(script);
            /* + */
            } else if (code == "43") {
                var actualCode = ['var slider_val = parseFloat($(".ui-slider").slider("option", "value")) + 1;',
                                  '$(".ui-slider").slider("option", "value", slider_val);'].join('\n');
                var script = document.createElement('script');
                script.textContent = actualCode;
                (document.head||document.documentElement).appendChild(script);
                script.parentNode.removeChild(script);
            } else if (code == "117") {
                if ($(".tai-id-text")) {
                    make_action_container();
                    var title = "http://analyte.tpondemand.com/entity/" + $(".tau-selected .tau-id-text").html();
                    $(".action_container input").prop("readonly", true);
                    $(".action_container input").val(title);
                    $(".action_container input").select();
                }
            /* t */
            } else if (code == "116") {
                if ($(".tau-selected").length) {
                    make_action_container();
                    var title = "#" + $(".tau-selected .tau-id-text").html() + ": " + $(".tau-selected .tau-name").html()
                    $(".action_container input").prop("readonly", true);
                    $(".action_container input").val(title);
                    $(".action_container input").select();
                }
            } else if (code == "111") {
                if ($(".tau-selected").length) {
                    $(".tau-selected").each(function() {
                        chrome.extension.sendMessage({url: "http://analyte.tpondemand.com/entity/" + $(this).find(".tau-id-text").html()}, function(response) { });
                    });
                }
            } else if (code == "108") {
                make_action_container('enter bug/story ID (comma separated IDs open in tabs)');
                $(".action_container input").keyup(function(event) {
                    event.preventDefault();
                    if (event.keyCode == 13) {
                        ids = $(".action_container input").val();
                        if (event.shiftKey == true || ids.match(",")) {
                            var url_array = ids.split(",");
                            for (var x=0; x < url_array.length; x++) {
                                chrome.extension.sendMessage({url: "http://analyte.tpondemand.com/entity/" + url_array[x]}, function(response) { });
                            }
                            destroy_action_container();
                        } else {
                            var opened=null;
                            $("div[role=card]").each(function() {
                                if ($(this).find(".tau-id").html().match(ids)) {
                                    $("div[role=card]").removeClass("tau-selected")
                                                       .removeClass("tau-card_selectedasdouble_true");
                                    $(this).addClass("tau-selected");
                                    var actualCode = ['$(".tau-selected a").click();'].join('\n');
                                    var script = document.createElement('script');
                                    script.textContent = actualCode;
                                    (document.head||document.documentElement).appendChild(script);
                                    script.parentNode.removeChild(script);
                                    opened=true;
                                }
                            });
                            if (!opened) {
                                var url = "http://analyte.tpondemand.com/entity/" + ids;
                                window.location.href = url;
                            }
                        }
                    }
                });
            /* / */
            } else if (code == "47" && event.shiftKey != true) {
                $("div[role=card]").fadeIn();
                make_action_container('Start typing to find a card by title');
                $(".action_container input").keyup(function(event) {
                    if (event.keyCode != 27) {
                        $("div[role=card]").each(function() {
                            if($(this).find(".tau-name").html().toLowerCase().match($(".action_container input").val().toLowerCase()) || $(this).find(".tau-id").html().match($(".action_container input").val().toLowerCase())) {
                                $(this).fadeIn();
                            } else {
                                $(this).fadeOut();
                            }
                        });
                    } else {
                        $("div[role=card]").fadeIn();
                    }
                });
            } else if (code == "109") {
                $("button[role='collapser']").click();
            /* ? */
            } else if (code == "63" && event.shiftKey == true) {
                if ($("#advanced_shortcuts").is(":visible") == true) {
                    $("#advanced_shortcuts").hide();
                } else {
                    $("#advanced_shortcuts").show();
                }
            }
            /* Enter/shift-enter */
            if (code == "13" || (code == "13" && event.shiftKey == true)) {
                if (tp_active_item.find("a").length) {
                    window.location.href=tp_active_item.find("a").attr("href");
                }
            }
        }
    });

    $("body, .action_container input").live("keyup", function(event) {
        code = event.keyCode;
        if (code == "27") {
            destroy_action_container();
            $("div[role=card]").fadeIn();
        }
    });
    $("div[role=card]").live("click", function(event) {
        destroy_action_container();
    });

    make_help();
});

function refresh_items() {
    $(".tau-boardselector__item").each(function() {
        if ($(this).is(":visible")) {
            $(this).addClass("tp_wrap");
        }
    });
    $(".tau-boardselector__item").first(function() {
        $(this).addClass("tp_item_scrollto");
    });

    tp_first_item = $("body").find(".tp_wrap").first();
    tp_last_item = $("body").find(".tp_wrap").last();
}

function stripe() {
    $(".generalTable tr.tp_wrap:odd").addClass("odd");
}

function bug_grid() {
    $(document).ready(function() {
        $(".show-states-dialog-link").each(function() {
            var row_class;
            if ($(this).html().match("Code Review")) {
                row_class = "in_review";
            }
            if ($(this).html().match("New")) {
                row_class = "new_case";
            }
            if ($(this).html().match("Active")) {
                row_class = "is_active";
            }
            if ($(this).html().match("QA") || $(this).html().match("Demo")) {
                row_class = "in_qa";
            }
            if ($(this).html().match("UAT")) {
                row_class = "test_passed";
            }
            if ($(this).html().match("Resolved") || $(this).html().match("Closed")) {
                row_class = "resolved";
            }
            $(this).parents("tr").first().addClass(row_class);
        });
    });
}

function navigate(item) {
    if (tp_active_item.length > 0) {
        if (item.hasClass("tp_wrap")) {
            item.addClass(active_class);
            tp_active_item.removeClass(active_class);
        } else {
            tp_active_item.removeClass(active_class);
        }
    } else {
        tp_first_item.addClass(active_class);
    }
    refresh_items();
}

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

function make_help() {
    $("body").append(["<div style='display:none' id='advanced_shortcuts' class='general'>",
                        "<strong>Charmin:</strong><br>",
                        "? = show/hide this window<br><br>",
                        "<strong>Navigation</strong><br>",
                        "[ or p = <strong>P</strong>revious Board<br>",
                        "] or n = <strong>N</strong>ext Board<br>",
                        "l = <strong>L</strong>eap to a specific case (comma separated IDs open in tabs)<br>",
                        "/ = enter type-ahead mode<br>",
                        "m = Toggle side <strong>m</strong>enu expand/collapse<br>",
                        "- = zoom out cards<br>",
                        "+ = zoom in cards<br><br>",
                        "<strong>Selected Item:</strong><br>",
                        "[enter] = open selected board<br>",
                        "t = Expose the ID/<strong>t</strong>itle of selected card<br>",
                        "u = Expose the <strong>U</strong>RL of the selected card<br>",
                        "o = <strong>O</strong>pen selected cards in tabs<br>",
                      "</div>"].join('\n'));
}

function destroy_action_container() {
    $(".action_container").slideUp(100, function() {
        $(this).remove();
    });
}
