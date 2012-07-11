(function() {

  window.is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  if (!is_chrome && !$.browser.mozilla) {
    window.location = "error.html";
  }

}).call(this);
