(function() {
  var noFile;

  noFile = 'No file chosen';

  window.clearHandler = {
    clearing: false,
    clear: function() {
      var clearingFalse;
      if (graph.drawing || treeGraph.drawing) {
        return stateHandler.printWarning('Drawing, Please Wait');
      } else if (clearHandler.clearing) {
        return stateHandler.printWarning('Clearing, Please Wait');
      } else {
        stateHandler.printWarning('Clearing');
        clearingFalse = function() {
          clearHandler.clearing = false;
          if (els.transactionTree.is(":visible") || els.automaton.is(":visible")) {
            eventHandler.disableGraph(1);
          }
          return stateHandler.print('Waiting for File');
        };
        clearHandler.clearing = true;
        graph.reset();
        animator.clear();
        graph.clear();
        eventHandler.screenZoom(screen.width, true, 0);
        treeGraph.clear();
        window.fileIn = null;
        eventHandler.disableProcessing();
        els.browseFile.val('');
        els.browseOut.html(noFile);
        els.dropOut.html(noFile);
        els.treebox.html('');
        els.vectorbox.html('');
        els.type.html('');
        els.participants.html('');
        els.vectors.html('');
        client.transactionTreeJSON = "";
        client.vectorFormatJSON = "";
        eventHandler.disableGraphBtn();
        return setTimeout(clearingFalse, animTime);
      }
    },
    clearForBrowseFile: function() {
      window.fileIn = null;
      return els.dropOut.html(noFile);
    },
    clearForDrop: function() {
      window.fileIn = null;
      els.browseFile.val('');
      return els.browseOut.html(noFile);
    }
  };

}).call(this);
