var key_active = "";
var clp_active_bookmark = "";
var clp_first_bookmark = "";
var clp_last_bookmark = "";

$(document).ready(function() {

    $(".generalTable tr:odd").addClass("odd");

    active_class = "selected_clipping"
    refresh_bookmarks();
    clp_first_bookmark.addClass(active_class);

    // Click to make clicked active
    $(".microbookmark-container").live("click", function() {
      $(".clp_item_wrap").removeClass(active_class);
      $(this).addClass(active_class);
      refresh_bookmarks();
    });

    $("body").live("keypress", function(event) {
      code = event.keyCode;
      clp_active_bookmark = $(".selected_clipping");
      prev_bookmark = clp_active_bookmark.prev(".clp_item_wrap");
      next_bookmark = clp_active_bookmark.next(".clp_item_wrap");

      if (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA") {
        /* n or ] */
        if (code == "110" || code == "93") {
          if (clp_active_bookmark.length > 0) {
            if (next_bookmark.hasClass("clp_item_wrap")) {
              next_bookmark.addClass(active_class);
              clp_active_bookmark.removeClass(active_class);
            } else {
              //clp_first_bookmark.addClass(active_class);
              clp_active_bookmark.removeClass(active_class);
            }
          } else {
            clp_first_bookmark.addClass(active_class);
          }
          refresh_bookmarks();
          scroll_to(clp_active_bookmark);
        /* p or [ */
        } else if (code == "112" || code == "91") {
          if (clp_active_bookmark.length > 0) {
            if (prev_bookmark.hasClass("clp_item_wrap")) {
              prev_bookmark.addClass(active_class);
              clp_active_bookmark.removeClass(active_class);
            } else {
              //clp_last_bookmark.addClass(active_class);
              clp_active_bookmark.removeClass(active_class);
            }
          } else {
            clp_first_bookmark.addClass(active_class);
          }
          refresh_bookmarks();
          scroll_to(clp_active_bookmark.first());
        /* ? */
        } else if (code == "63" && event.shiftKey == true) {
          if ($("#advanced_shortcuts").is(":visible") == true) {
            $("#advanced_shortcuts").hide();
          } else {
            $("#advanced_shortcuts").show();
          }
        /* x */
        } else if (code == "120") {
        /* esc */
        } else if (code == "27") {
          /* TODO: How to get focus back? */
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
            find_tab("User Stories");
        } else if (code == "68" && key_active) {
            find_tab("Dashboard");
        } else if (code == "66" && key_active) {
            find_tab("Bugs");
        } else if (code == "73" && key_active) {
            find_tab("Iteration Plan");
        } else if (code == "78" && key_active) {
        } else if (code == "191" && event.shiftKey != true) {
            $("#topSearch input[type='text']").focus();
        } else {
          key_active = null;
        }

        /* Enter/shift-enter */
        if (code == "13" || (code == "13" && event.shiftKey == true)) {
            /* shift-enter */
            var url;
            if (clp_active_bookmark.find("a.list-name").length > 0) {
                url = clp_active_bookmark.find("a.list-name").attr("href")
            } else if (clp_active_bookmark.find("a.h3").length > 0) {
                url = clp_active_bookmark.find("a.h3").attr("href")
            }

            if (url) {
                if (event.shiftKey == true) {
                chrome.extension.sendMessage({url: "http://" + window.location.hostname + url}, function(response) { });
                /* enter */
                } else {
                window.location.href = url;
                }
            }
        /* v */
        } else if (code == "86") {
        /* e */
        } else if (code == "69") {
        /* r */
        } else if (code == "82") {
          clp_active_bookmark.find(".icon-comment span").trigger("click");
        /* Bookmark Type-ahead */
        } else if (code == "220") {
        /* c */
        } else if (code == "67") {
        }
      } else {
        /* Default [enter] action */
        //if (code == "13" && document.activeElement.tagName == "INPUT") {
        //  $("input.submit").trigger("click");
        //}
      }
    });

    $("body").append("<div style='display:none' id='advanced_shortcuts' class='general'><strong>Charmin:</strong><br><br>? = show/hide this window<br><br><strong>Navigation</strong><br>n or ] = next story<br>p or [ = previous story<br>/ = Focus search box<br>g, d = Go to Dashboard<br>g, u = Go to User Stories<br>g, b = Go to Bugs<br>g, i = Go to Iteration Plan<br><br><strong>Selected Item</strong><br>[enter] = open selected<br>[shift-enter] = open selected in new tab");
});

function scroll_to(bookmark) {
  if (bookmark.length > 0) {
    scroll_bookmark = bookmark.find(".clp_item_scrollto");

    scrollTo(scroll_bookmark);
  }
}

function find_tab(sub_string) {
    $(".tabPlace").each(function() {
        if ($(this).find("a").text().match(sub_string)) {
            window.location.href = $(this).find("a").attr("href");
        }
    });
}

function refresh_bookmarks() {
  $("#main .generalTable tr").each(function() {
    $(this).addClass("clp_item_wrap");
  });
  $("#main .generalTable tr:first-child").each(function() {
    $(this).addClass("clp_item_scrollto");
  });

  clp_first_bookmark = $("body").find(".clp_item_wrap").first();
  clp_last_bookmark = $("body").find(".clp_item_wrap").last();
}
