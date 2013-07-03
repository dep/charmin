var key_active = "";
var tp_active_item = "";
var tp_first_item = "";
var tp_last_item = "";
var active_class = "";

$(document).ready(function() {
    active_class = "selected_item"
    refresh_items();
    tp_first_item.addClass(active_class);
    //stripe();
    //bug_grid();

    // Catch slow-loading items
    //setTimeout('refresh_items();stripe()', 1000);
    //setInterval('bug_grid()', 3000);

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
                scroll_to(tp_active_item);
            /* p or [ */
            } else if (code == "112" || code == "91") {
                navigate(prev_item);
                scroll_to(tp_active_item.first());
            /* s */
            } else if (code == "115") {
                //$(".tau-sharelink button").trigger("click");
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

    $("body").live("keyup", function(event) {
        code = event.keyCode;

        var active_el = $(document.activeElement);
        if (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA" && !active_el.hasClass("cke_wysiwyg_div")) {
            /* go to */
            if (code == "71") {
                key_active = code;
            } else if (code == "85" && key_active) {
            } else if (code == "68" && key_active) {
            } else if (code == "66" && key_active) {
            } else if (code == "73" && key_active) {
            } else if (code == "76" && key_active) {
                $("body").append("<div class='special_modal' id='leap'><input type='text' placeholder='enter bug/story ID'></div>");
                $("#leap input").focus();
                $("#leap input").keyup(function(event) {
                    event.preventDefault();
                    if (event.keyCode == 13) {
                        var url = "http://analyte.tpondemand.com/entity/" + $("#leap input").val();
                        if (event.shiftKey == true) {
                            chrome.extension.sendMessage({url: url}, function(response) { });
                            $("#leap").remove();
                        } else {
                            window.location.href = url;
                        }
                    } else if (event.keyCode == 27) {
                        $("#leap").remove();
                    }
                });
            /* / */
            } else if (code == "191" && event.shiftKey != true) {
                $("body").append("<div class='special_modal' id='leap'><input type='text' placeholder='Start typing to find a card by title'></div>");
                $("div[role=card]").fadeIn();
                $("#leap input").focus();
                $("#leap input").keyup(function(event) {
                    if (event.keyCode != 27) {
                        $("div[role=card]").each(function() {
                            if($(this).find(".tau-name").html().toLowerCase().match($("#leap input").val().toLowerCase())) {
                                $(this).fadeIn();
                            } else {
                                $(this).fadeOut();
                            }
                        });
                    } else {
                        $("#leap").remove();
                    }
                });
            } else {
                key_active = null;
            }

            /* Enter/shift-enter */
            if (code == "13" || (code == "13" && event.shiftKey == true)) {
                /* shift-enter */
                var url;
                if (tp_active_item.find("a.list-name").length > 0) {
                    url = tp_active_item.find("a.list-name").attr("href")
                } else if (tp_active_item.find("a.h3").length > 0) {
                    url = tp_active_item.find("a.h3").attr("href")
                }

                if (url) {
                    if (event.shiftKey == true) {
                        chrome.extension.sendMessage({url: "http://" + window.location.hostname + url}, function(response) { });
                    /* enter */
                    } else {
                        window.location.href = url;
                    }
                }
            }
        }
    });

    $("body").append("<div style='display:none' id='advanced_shortcuts' class='general'><strong>Charmin:</strong><br><br>? = show/hide this window<br><br><strong>Navigation</strong><br>g, l = Leap to a specific case<br>/ = enter type-ahead mode");
});

function scroll_to(item) {
    $('html, body').animate({
        scrollTop: $(".selected_item").offset().top-350
    }, 150);
}

function find_tab(sub_string) {
    $(".tabPlace").each(function() {
        if ($(this).find("a").text().match(sub_string)) {
            window.location.href = $(this).find("a").attr("href");
        }
    });
}

function refresh_items() {
    $("#main .generalTable tr").each(function() {
        if ($(this).is(":visible")) {
            $(this).addClass("tp_wrap");
        }
    });
    $("#main .generalTable tr:first-child").each(function() {
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
