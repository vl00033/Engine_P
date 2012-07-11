(function() {
  var height, minHeight, trans, width, zoom;

  width = window.screen.width;

  height = window.screen.height;

  if (width < height) {
    zoom = 85;
  } else {
    zoom = width * 0.027 + 33.01;
  }

  if ($.browser.msie) {
    $('body').css({
      'zoom': zoom + '%'
    });
  } else {
    trans = zoom / 100;
    minHeight = 2000;
    $('body').css({
      'transform': 'scale(' + trans + ')',
      'transform-origin': 'center top'
    });
    $('body').css({
      '-webkit-transform': 'scale(' + trans + ')',
      '-webkit-transform-origin': 'center top'
    });
    $('body').css({
      '-o-transform': 'scale(' + trans + ')',
      '-o-transform-origin': 'center top'
    });
    $('body').css({
      '-ms-transform': 'scale(' + trans + ')',
      '-ms-transform-origin': 'center top'
    });
    $('#wrap').css({
      'min-height': minHeight + 'px'
    });
  }

}).call(this);
