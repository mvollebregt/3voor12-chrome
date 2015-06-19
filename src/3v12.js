/*jslint browser: true, unparam: true*/
/*global $, chrome*/

(function () {
    "use strict";

    var MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
        totalWords;

    function applyAllCssToPrint() {
        $("link[rel='stylesheet']").attr("media", "screen, projection, print");
    }

    function addCss(filename, media) {
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.media = media;
        style.href = chrome.extension.getURL(filename);
        $("link[rel='stylesheet']:last").after(style);
    }

    function checkDate() {
        var now = new Date(),
            expected = now.getDate() + " " + MONTHS[now.getMonth()] + " " + now.getFullYear(),
            dateElt = $(".date");
        if (expected !== dateElt.text()) {
            dateElt.addClass("error");
        }
    }

    function checkLinkTargets() {
        $("#main").find("a[target!='_blank']").not("[href^='mailto:']").addClass("error");
    }

    function makeWord(word) {
        return word.replace(/\W/g, '');
    }

    function forEachParagraph(elt, fun) {
        var children = $(elt).children();
        if (children.length === 0) {
            children = $(elt);
        }
        children.each(function (index, child) {
            var clone = $(child).clone();
            clone.find("br").replaceWith("\n");
            $.each(clone.text().split("\n"), fun);
        });
    }

    function addWordCounts(selector, formatter) {
        var totalCount = 0;
        $(selector).each(function (index, text) {
            var wordCountText = "";
            forEachParagraph(text, function (index, paragraph) {
                var words = paragraph.split(/\s+/).filter(function (w) { return w !== ''; });
                if (words.length > 3) {
                    wordCountText += formatter(makeWord(words[0]) + " " + makeWord(words[1]) + "..." + makeWord(words[words.length - 1]), words.length) + "; ";
                }
                totalCount += words.length;
            });
            $(text).append("<p class='extra'>" + wordCountText.substring(0, wordCountText.length - 2) + "</p>");
        });
        return totalCount;
    }

// zorg er (altijd) voor dat de pagina er op de printer goed uit ziet
    applyAllCssToPrint();
    addCss('print.css', 'print');

// voer checks uit en tel woorden, maar alleen indien we op een artikel en niet in de preview zitten
    if (window.location.href.indexOf("mgnlPreview=true") === -1 && $("article").length > 0) {
        addCss('extras.css', 'screen, projection, print');
        checkDate();
        checkLinkTargets();
        totalWords = addWordCounts("#main div.text", function (description, count) { return description + ": " + count + " woorden"; });
        addWordCounts(".abstract", function (description, count) { return "Intro: " + count  + " woorden; artikel: " + totalWords + " woorden"; });
        // checkLinkHrefs();
    }

}());
