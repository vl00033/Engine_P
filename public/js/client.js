(function() {
  var url;

  url = window.location.href;

  window.client = {
    transactionTreeJSON: '',
    vectorFormatJSON: '',
    autoGraph: '',
    exportType: 'json',
    sample: 1,
    processVectorFormat: function(vectorFormat) {
      var orderedList, structure, type, vectorsList, vfValues;
      try {
        vfValues = getVFDetails(vectorFormat);
        printer.printResponse(vfValues);
        vectorsList = vfValues.vectorsList;
        orderedList = vfValues.orderedList;
        type = vfValues.setType.value;
        structure = graphStruct.extractStructure(vectorsList, orderedList, type);
        client.autoGraph = '';
        graph.createAutomaton(structure, vfValues.maxLevel);
        return animator.alertRun = false;
      } catch (error) {
        console.log(error);
        return stateHandler.printError('Vector Processing Error\nPlease Check File');
      }
    },
    processInput: function() {
      var input, leveledTree, vectorFormat;
      if (eventHandler.checkAvailability()) {
        stateHandler.printWarning('Processing ...');
        input = JSON.parse(window.fileIn);
        eventHandler.enableProcessing();
        if (input.nodes !== void 0) {
          try {
            client.transactionTreeJSON = window.fileIn;
            leveledTree = treeToLevels(input);
            client.autoGraph = '';
            treeGraph.createTreeGraph(leveledTree);
            printer.printStructuredTree(input);
            vectorFormat = treeToVector(input);
          } catch (error) {
            if (error.error !== void 0) {
              stateHandler.printError("Processing Error:\n" + error.error);
            } else {
              console.log(error);
              stateHandler.printError("Processing Error\nPlease check file");
            }
          }
        } else {
          els.treebox.html('');
          client.transactionTreeJSON = "";
          treeGraph.clear();
          vectorFormat = input.vectorFormat;
        }
        if (vectorFormat !== null & vectorFormat !== void 0) {
          client.processVectorFormat(vectorFormat);
          return eventHandler.enableGraphBtn();
        } else {
          return stateHandler.printError('Vector Format was not produced,\nPlease Check File');
        }
      }
    },
    getSample: function() {
      var reEnable, reqObj;
      if (eventHandler.checkAvailability()) {
        els.sample.css({
          opacity: 0.5
        });
        els.sample.attr('disabled', true);
        els.sample.mouseout();
        reEnable = function() {
          els.sample.css({
            opacity: 1
          });
          return els.sample.attr('disabled', false);
        };
        setTimeout(reEnable, 1000);
        if (eventHandler.checkAvailability()) {
          stateHandler.print('Processing ...');
          reqObj = {
            id: client.sample
          };
          return $.ajax({
            url: url + 'requestSample',
            type: 'POST',
            timeout: 2000,
            contentType: 'application/json',
            data: JSON.stringify(reqObj),
            accepts: 'application/json',
            success: function(data) {
              var leveledTree, transactionTree, vectorFormat;
              transactionTree = JSON.parse(data);
              if (data.error !== void 0 && data.error !== null) {
                return stateHandler.printError(data.error);
              } else {
                client.transactionTreeJSON = JSON.stringify(transactionTree);
                try {
                  leveledTree = treeToLevels(transactionTree);
                  client.autoGraph = '';
                  treeGraph.createTreeGraph(leveledTree);
                  printer.printStructuredTree(transactionTree);
                  vectorFormat = treeToVector(transactionTree);
                  client.processVectorFormat(vectorFormat);
                  return eventHandler.enableGraphBtn();
                } catch (error) {
                  if (error.error !== void 0) {
                    return stateHandler.printError("Processing Error:" + error.error);
                  } else {
                    console.log(error);
                    return stateHandler.printError("Processing Error\nPlease check file");
                  }
                }
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              return stateHandler.printError(textStatus.charAt(0).toUpperCase() + textStatus.slice(1) + ' ' + errorThrown);
            }
          });
        }
      }
    },
    exportFile: function(action, button, file) {
      var reEnable, str, type;
      type = client.exportType;
      els.exportType.val(type);
      if (file === 1) {
        client.transactionTreeJSON.replace(/^\s+|\s+$/g, "");
        els.exportFile.val(client.transactionTreeJSON);
      } else {
        els.exportFile.val(client.vectorFormatJSON.trim());
      }
      str = els.exportFile.val();
      if (str.length !== void 0 && str.length > 0) {
        button.css({
          opacity: 0.5
        });
        button.attr('disabled', true);
        reEnable = function() {
          button.css({
            opacity: 1
          });
          return button.attr('disabled', false);
        };
        els.exportForm.attr("action", action);
        els.exportForm.submit();
        return setTimeout(reEnable, 2000);
      }
    },
    exportGraph: function(button, type) {
      var reEnable, str;
      els.exportFile.val(client.autoGraph);
      str = els.exportFile.val();
      if (str.length !== void 0 && str.length > 0) {
        button.css({
          opacity: 0.5
        });
        button.attr('disabled', true);
        reEnable = function() {
          button.css({
            opacity: 1
          });
          return button.attr('disabled', false);
        };
        els.exportForm.attr("action", "exportGraph");
        els.exportForm.submit();
        return setTimeout(reEnable, 2000);
      }
    },
    switchExportType: function() {
      if (client.exportType === 'json') {
        client.exportType = 'xml';
        els.json.css({
          'border': '3px outset #FFFFFF'
        });
        els.xml.css({
          'border': '3px inset #FFFFFF'
        });
        els.xml.attr('disabled', true);
        els.json.attr('disabled', false);
        return eventHandler.switchTo = 1;
      } else {
        client.exportType = 'json';
        els.xml.css({
          'border': '3px outset #FFFFFF'
        });
        els.json.css({
          'border': '3px inset #FFFFFF'
        });
        els.json.attr('disabled', true);
        return els.xml.attr('disabled', false);
      }
    },
    getGuideFile: function(action, button) {
      var reEnable;
      button.css({
        opacity: 0.5
      });
      button.attr('disabled', true);
      reEnable = function() {
        button.css({
          opacity: 1
        });
        return button.attr('disabled', false);
      };
      els.guideForm.attr("action", action);
      els.guideForm.submit();
      return setTimeout(reEnable, 2000);
    }
  };

}).call(this);
