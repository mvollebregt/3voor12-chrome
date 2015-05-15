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

applyAllCssToPrint();
addCss('print.css', 'print');
