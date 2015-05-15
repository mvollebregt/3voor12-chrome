var MONTHS=["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"]

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
  var now = new Date();
  var expected = now.getDate() + " " + MONTHS[now.getMonth()] + " " + now.getFullYear();
  var dateElt = $(".date");
  if (expected != dateElt.text()) {
    dateElt.addClass("error");
  } 
}

function checkLinkTargets() {
  $("#main a[target!='_blank']").addClass("error");
}

function tryUrl(url, fail) {
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState == 4) {  
      if (xhr.status != 200) {  
        fail()
      }  
    }  
  };;
  xhr.open("GET", url, true);
  xhr.send();
  
}

function checkLinkHrefs() {
  $("#main a[rel!='showbox']").each(function (index, elt) {
    var url = $(elt).attr('href');
    tryUrl(url, function() {$(elt).addClass("error")});
  });
}

function word(word) {
  return word.replace(/\W/g, '');
}

function countWords() {
  $(".abstract, div.text p").each(function(index, elt) {
    var clone = $(elt).clone();
    clone.find("br").replaceWith("\n");
    var summary = "";
    $.each(clone.text().split("\n"), function(index, part) {
      var words = part.split(/\s+/).filter(function(w){return w!=''});;
      if (words.length > 4) {
        summary += word(words[0]) + " " + word(words[1]) + "..." + word(words[words.length - 1 ]) + " (" + words.length + " woorden); "
      }
    });
    $(elt).append("<br/><span class='extra'>" + summary.substring(0, summary.length - 2) + "</span>");
  });
}

applyAllCssToPrint();
addCss('print.css', 'print');
addCss('extras.css', 'screen, projection, print');
checkDate();
checkLinkTargets();
checkLinkHrefs();
countWords();