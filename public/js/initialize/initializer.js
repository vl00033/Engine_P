(function() {
  var availPixels, catchError, setVideo;

  eventRegistry.registerEvents();

  els.autoEnable.attr('disabled', false);

  els.autoDisable.attr('disabled', false);

  graph.autoWidth = 900;

  treeGraph.treeWidth = 900;

  eventHandler.screenZoom(window.screen.width, false, -1);

  eventHandler.nativeZoom = eventHandler.zoom;

  availPixels = 4.477 * screen.width + 21.649 * eventHandler.zoom - 0.0394 * eventHandler.zoom * screen.width - 1864.288;

  availPixels -= 1164;

  eventHandler.initPos = availPixels / 2;

  eventHandler.disableGraphBtn();

  catchError = function(errorMsg, url, lineNumber) {
    return console.log(errorMsg);
  };

  window.onerror = catchError;

  setVideo = function() {
    if (!eventHandler.sourceLoaded) {
      els.demoVideo.attr({
        src: "../../video/demo.webm",
        type: "video/webm"
      });
      return eventHandler.sourceLoaded = true;
    }
  };

  setTimeout(setVideo, 2000);

  window.onresize = function() {
    if (els.automaton.is(':visible')) {
      return eventHandler.screenZoom(900 + screen.width - graph.autoWidth, false, 1);
    } else if (els.transactionTree.is(':visible')) {
      return eventHandler.screenZoom(900 + screen.width - treeGraph.treeWidth, false, 2, 750 + screen.height - treeGraph.treeHeight);
    } else {
      return eventHandler.screenZoom(window.screen.width, false, -1);
    }
  };

}).call(this);
