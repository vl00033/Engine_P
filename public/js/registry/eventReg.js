(function() {

  window.eventRegistry = {
    registerEvents: function() {
      try {
        els.zoomIn.mousedown(eventHandler.zoomIn);
        els.zoomOut.mousedown(eventHandler.zoomOut);
        els.closeVideo.click(eventHandler.hideVideo);
        els.sampleJSON.click(function() {
          return client.getGuideFile("sampleJSON", els.sampleJSON);
        });
        els.guide.click(function() {
          return client.getGuideFile("guideJson", els.guide);
        });
        els.ttSampleXML.click(function() {
          return client.getGuideFile("ttSampleXML", els.ttSampleXML);
        });
        els.ttXMLSchema.click(function() {
          return client.getGuideFile("ttXMLSchema", els.ttXMLSchema);
        });
        els.vfSampleXML.click(function() {
          return client.getGuideFile("vfSampleXML", els.vfSampleXML);
        });
        els.vfXMLSchema.click(function() {
          return client.getGuideFile("vfXMLSchema", els.vfXMLSchema);
        });
        els.vfSampleJSON.click(function() {
          return client.getGuideFile("vfSampleJSON", els.vfSampleJSON);
        });
        eventHandler.disableProcessing();
        els.browseFile.change(reader.readBrowseFile);
        els.processInput.click(client.processInput);
        els.processInput.mouseover(function() {
          return eventHandler.inputHint(els.processInput, 'Process Input File');
        });
        els.processInput.mouseout(function() {
          return eventHandler.inputHintHide('Process Input File');
        });
        els.dropBox.addEventListener('dragover', reader.handleDragOver);
        els.dropBox.addEventListener('drop', reader.readDrop);
        els.clearB.click(clearHandler.clear);
        els.clearB.mouseover(function() {
          return eventHandler.mainHint(els.clearB, 'Clears everything');
        });
        els.clearB.mouseout(function() {
          return eventHandler.mainHintHide('Clears everything');
        });
        els.sample.click(client.getSample);
        els.sample.mouseover(function() {
          return eventHandler.mainHint(els.sample, 'Request sample from server');
        });
        els.sample.mouseout(function() {
          return eventHandler.mainHintHide('Request sample from server');
        });
        els.next.click(eventHandler.nextSample);
        els.next.mouseover(function() {
          return eventHandler.mainHint(els.next, 'Next sample');
        });
        els.next.mouseout(function() {
          return eventHandler.mainHintHide('Next sample');
        });
        els.previous.click(eventHandler.previousSample);
        els.previous.mouseover(function() {
          return eventHandler.mainHint(els.previous, 'Previous Sample');
        });
        els.previous.mouseout(function() {
          return eventHandler.mainHintHide('Previous Sample');
        });
        els.demonstrate.click(eventHandler.showVideo);
        els.demonstrate.mouseover(function() {
          return eventHandler.mainHint(els.demonstrate, 'Tutorial on how it works');
        });
        els.demonstrate.mouseout(function() {
          return eventHandler.mainHintHide('Tutorial on how it works');
        });
        els.about.click(eventHandler.about);
        els.about.mouseover(function() {
          return eventHandler.mainHint(els.about, 'Shows about information');
        });
        els.about.mouseout(function() {
          return eventHandler.mainHintHide('Shows about information');
        });
        els.closeAbout.click(function() {
          return els.aboutBox.slideUp({
            duration: animTime,
            complete: function() {
              var button, _i, _len, _ref;
              els.body2.css({
                opacity: 1
              });
              _ref = eventHandler.disabledButtons;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                button = _ref[_i];
                button.attr('disabled', false);
              }
              return eventHandler.disabledButtons = [];
            }
          });
        });
        els.descrButton.click(function() {
          if (!els.description.is(":visible")) {
            if (els.references.is(":visible")) {
              els.references.hide();
              els.description.show();
              els.refButton.css({
                'border': ''
              });
              return els.descrButton.css({
                'border': '3px inset #FFFFFF'
              });
            } else {
              els.descrButton.attr("disabled", true);
              els.refButton.attr("disabled", true);
              els.descrButton.css({
                'border': '3px inset #FFFFFF'
              });
              return els.aboutBox.animate({
                width: 1000
              }, {
                duration: animTime,
                queue: false,
                complete: function() {
                  els.description.show();
                  els.descrButton.attr("disabled", false);
                  return els.refButton.attr("disabled", false);
                }
              });
            }
          } else {
            els.description.hide();
            els.descrButton.attr("disabled", true);
            els.descrButton.css({
              'border': ''
            });
            return els.aboutBox.animate({
              width: 445
            }, {
              duration: animTime,
              queue: false,
              complete: function() {
                return els.descrButton.attr("disabled", false);
              }
            });
          }
        });
        els.refButton.click(function() {
          if (!els.references.is(":visible")) {
            if (els.description.is(":visible")) {
              els.description.hide();
              els.descrButton.css({
                'border': ''
              });
              els.references.show();
              return els.refButton.css({
                'border': '3px inset #FFFFFF'
              });
            } else {
              els.refButton.attr("disabled", true);
              els.descrButton.attr("disabled", true);
              els.refButton.css({
                'border': '3px inset #FFFFFF'
              });
              return els.aboutBox.animate({
                width: 1000
              }, {
                duration: animTime,
                queue: false,
                complete: function() {
                  els.references.show();
                  els.refButton.attr("disabled", false);
                  return els.descrButton.attr("disabled", false);
                }
              });
            }
          } else {
            els.references.hide();
            els.refButton.attr("disabled", true);
            els.refButton.css({
              'border': ''
            });
            return els.aboutBox.animate({
              width: 445
            }, {
              duration: animTime,
              queue: false,
              complete: function() {
                return els.refButton.attr("disabled", false);
              }
            });
          }
        });
        els.exportVF.click(function() {
          return client.exportFile('downloadVector', els.exportVF, 2);
        });
        els.exportTree.click(function() {
          return client.exportFile('downloadTree', els.exportTree, 1);
        });
        els.xml.click(client.switchExportType);
        els.json.click(client.switchExportType);
        els.autoEnable.click(eventHandler.enableGraph);
        els.autoDisable.click(eventHandler.disableGraph);
        els.switchToTree.click(eventHandler.switchToTree);
        els.switchToAuto.click(eventHandler.switchToAuto);
        els.runAlert.click(function() {
          var button, _i, _len, _ref;
          animator.alertRun = true;
          els.alertSel.hide();
          els.body2.css({
            opacity: 1
          });
          _ref = eventHandler.disabledButtons;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            button = _ref[_i];
            button.attr('disabled', false);
          }
          eventHandler.disabledButtons = [];
          return eventHandler.startAnimation();
        });
        els.cancelAlert.click(function() {
          var button, _i, _len, _ref;
          els.body2.css({
            opacity: 1
          });
          _ref = eventHandler.disabledButtons;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            button = _ref[_i];
            button.attr('disabled', false);
          }
          eventHandler.disabledButtons = [];
          els.alertSel.hide();
          return animator.alertRun = true;
        });
        els.transparent.click(eventHandler.makeTransparent);
        els.transparent.mouseover(function() {
          return eventHandler.autoHint(els.transparent, 'Makes automaton transparent');
        });
        els.transparent.mouseout(function() {
          return eventHandler.autoHintHide('Makes automaton transparent');
        });
        els.nontransparent.click(eventHandler.unmakeTransparent);
        els.nontransparent.mouseover(function() {
          return eventHandler.autoHint(els.nontransparent, 'Makes automaton non-transparent');
        });
        els.nontransparent.mouseout(function() {
          return eventHandler.autoHintHide('Makes automaton non-transparent');
        });
        els.runButton.click(eventHandler.startAnimation);
        els.runButton.mouseover(function() {
          return eventHandler.autoHint(els.runButton, 'Starts animation');
        });
        els.runButton.mouseout(function() {
          return eventHandler.autoHintHide('Starts animation');
        });
        els.incRun.click(eventHandler.incRun);
        els.incRun.mouseover(function() {
          return eventHandler.autoHint(els.incRun, 'Select next path');
        });
        els.incRun.mouseout(function() {
          return eventHandler.autoHintHide('Select next path');
        });
        els.decRun.click(eventHandler.decRun);
        els.decRun.mouseover(function() {
          return eventHandler.autoHint(els.decRun, 'Select previous path');
        });
        els.decRun.mouseout(function() {
          return eventHandler.autoHintHide('Select previous path');
        });
        els.pauseButton.click(eventHandler.pauseAnimation);
        els.pauseButton.mouseover(function() {
          return eventHandler.autoHint(els.pauseButton, 'Pauses animation');
        });
        els.pauseButton.mouseout(function() {
          return eventHandler.autoHintHide('Pauses animation');
        });
        els.resumeButton.click(eventHandler.resumeAnimation);
        els.resumeButton.mouseover(function() {
          return eventHandler.autoHint(els.resumeButton, 'Resumes animation');
        });
        els.resumeButton.mouseout(function() {
          return eventHandler.autoHintHide('Resumes animation');
        });
        els.clearCanvas.click(eventHandler.clearCanvas);
        els.clearCanvas.mouseover(function() {
          return eventHandler.autoHint(els.clearCanvas, 'Clears the canvas');
        });
        els.clearCanvas.mouseout(function() {
          return eventHandler.autoHintHide('Clears the canvas');
        });
        els.drawCanvas.click(eventHandler.drawCanvas);
        els.drawCanvas.mouseover(function() {
          return eventHandler.autoHint(els.drawCanvas, 'Draws automaton');
        });
        els.drawCanvas.mouseout(function() {
          return eventHandler.autoHintHide('Draws automaton');
        });
        els.reset.click(eventHandler.reset);
        els.reset.mouseover(function() {
          return eventHandler.autoHint(els.reset, 'Resets animation');
        });
        els.reset.mouseout(function() {
          return eventHandler.autoHintHide('Resets animation');
        });
        els.faster.click(eventHandler.faster);
        els.faster.mouseover(function() {
          return eventHandler.autoHint(els.faster, 'Increases animation speed');
        });
        els.faster.mouseout(function() {
          return eventHandler.autoHintHide('Increases animation speed');
        });
        els.slower.click(eventHandler.slower);
        els.slower.mouseover(function() {
          return eventHandler.autoHint(els.slower, 'Decreases animation speed');
        });
        els.slower.mouseout(function() {
          return eventHandler.autoHintHide('Decreases animation speed');
        });
        els.help.click(eventHandler.showHelp);
        els.help.mouseover(function() {
          if (els.helpMenu.is(':hidden')) {
            return eventHandler.autoHint(els.help, 'Shows help');
          } else {
            return eventHandler.autoHint(els.help, 'Hides help');
          }
        });
        els.help.mouseout(function() {
          return eventHandler.autoHintHide();
        });
        els.exportAutoGraph.click(function() {
          return client.exportGraph(els.exportAutoGraph, "auto");
        });
        els.closeAuto.click(eventHandler.disableGraph);
        els.treeTransparent.click(eventHandler.treeMakeTransparent);
        els.treeTransparent.mouseover(function() {
          return eventHandler.treeHint(els.treeTransparent, 'Makes graph transparent');
        });
        els.treeTransparent.mouseout(function() {
          return eventHandler.treeHintHide('Makes graph transparent');
        });
        els.treeNontransparent.click(eventHandler.treeUnmakeTransparent);
        els.treeNontransparent.mouseover(function() {
          return eventHandler.treeHint(els.treeNontransparent, 'Makes graph non-transparent');
        });
        els.treeNontransparent.mouseout(function() {
          return eventHandler.treeHintHide('Makes graph non-transparent');
        });
        els.treeClearCanvas.click(eventHandler.treeClearCanvas);
        els.treeClearCanvas.mouseover(function() {
          return eventHandler.treeHint(els.treeClearCanvas, 'Clears the canvas');
        });
        els.treeClearCanvas.mouseout(function() {
          return eventHandler.treeHintHide('Clears the canvas');
        });
        els.treeDrawCanvas.click(eventHandler.treeDrawCanvas);
        els.treeDrawCanvas.mouseover(function() {
          return eventHandler.treeHint(els.treeDrawCanvas, 'Draws graph');
        });
        els.treeDrawCanvas.mouseout(function() {
          return eventHandler.treeHintHide('Draws graph');
        });
        els.treeHelp.click(eventHandler.showTreeHelp);
        els.treeHelp.mouseover(function() {
          if (els.helpMenu.is(':hidden')) {
            return eventHandler.treeHint(els.treeHelp, 'Shows Legend');
          } else {
            return eventHandler.treeHint(els.treeHelp, 'Hides Legend');
          }
        });
        els.treeHelp.mouseout(function() {
          return eventHandler.treeHintHide();
        });
        return els.closeTree.click(eventHandler.disableGraph);
      } catch (error) {
        if (error.error !== void 0) {
          return stateHandler.printError(error.error);
        } else {
          console.log(error);
          return stateHandler.printError('Something went wrong\nPlease refresh');
        }
      }
    }
  };

}).call(this);
