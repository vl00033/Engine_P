
window.reader = {
  readFile: function(file) {
    var reader;
    reader = new FileReader();
    reader.readAsText(file);
    return reader.onload = (function(e) {
      var input, json, node, parsed, tree, vector, _i, _len, _ref;
      input = e.target.result;
      try {
        json = xml2json.parser(input);
        tree = json.transactiontree;
        vector = json.vectorformat;
        if (tree !== void 0) {
          tree.nodes = tree.nodes.node;
          tree.leaves = tree.leaves.leaf;
          _ref = tree.nodes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.children = node.children.id;
          }
          window.fileIn = JSON.stringify(tree);
        } else if (vector !== void 0) {
          json.vectorFormat = json.vectorformat.vector;
          delete json.vectorformat;
          window.fileIn = JSON.stringify(json);
        } else {
          parsed = JSON.parse(json);
          window.fileIn = JSON.stringify(parsed);
        }
        stateHandler.print('File Read');
        return eventHandler.enableProcessing();
      } catch (error) {
        eventHandler.disableProcessing();
        console.log(error);
        return stateHandler.printError("Invalid File");
      }
    });
  },
  readBrowseFile: function(evt) {
    var file, files;
    clearHandler.clearForBrowseFile();
    files = evt.target.files;
    file = files[0];
    els.browseOut.html(file.name);
    return reader.readFile(file);
  },
  readDrop: function(evt) {
    var file, files;
    clearHandler.clearForDrop();
    files = evt.dataTransfer.files;
    file = files[0];
    els.dropOut.html(file.name);
    return reader.readFile(file);
  },
  handleDragOver: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return evt.dataTransfer.dropEffect = 'copy';
  }
};
