(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.animTime = 800;

  window.eventHandler = {
    scroll: function(sel, animTimePar) {
      var animTimeUse, availPixels, bodyPixels, constBodyWidth, marginMove, move, widthConst;
      widthConst = window.innerWidth;
      if (widthConst > 1920) {
        widthConst = 1920;
      }
      if (is_chrome) {
        availPixels = 4.477 * widthConst + 21.649 * eventHandler.zoom - 0.0394 * eventHandler.zoom * widthConst - 1864.288;
        constBodyWidth = -0.00037 * (widthConst * widthConst) + 1.319608 * widthConst - 144.744;
        bodyPixels = 4.477 * constBodyWidth + 21.649 * eventHandler.zoom - 0.0394 * eventHandler.zoom * constBodyWidth - 1864.288;
        if (availPixels < 1120 && sel !== 0 && sel !== 1 && sel !== 2) {
          $('#wrap').css({
            'margin-left': 0
          });
          return eventHandler.lastMove = 0;
        } else {
          availPixels -= bodyPixels;
          if (sel === -1) {
            $('#wrap').css({
              'margin-left': availPixels / 2
            });
            return eventHandler.lastMove = availPixels / 2;
          } else if (sel === 0) {
            if (availPixels > 0) {
              if (animTimePar === void 0) {
                animTimePar = animTime;
              }
              $('#wrap').animate({
                'margin-left': availPixels / 2
              }, animTimePar);
              return eventHandler.lastMove = availPixels / 2;
            } else {
              $('#wrap').animate({
                'margin-left': 0
              }, animTimePar);
              return eventHandler.lastMove = 0;
            }
          } else if (sel === 1 || sel === 2) {
            if (sel === 2) {
              move = treeGraph.treeWidth - 900;
            } else {
              move = graph.autoWidth - 900;
            }
            if (move > availPixels) {
              marginMove = -10;
            } else if (move > availPixels / 2) {
              marginMove = availPixels / 2 - (move - availPixels / 2);
            } else {
              marginMove = availPixels / 2;
            }
            if (marginMove < -10) {
              marginMove = -10;
            }
            if (marginMove !== eventHandler.lastMove) {
              if (animTimePar !== void 0) {
                animTimeUse = animTimePar;
              } else {
                animTimeUse = animTime;
              }
              $('#wrap').animate({
                'margin-left': marginMove + 'px'
              }, {
                duration: animTimeUse,
                queue: false
              });
              return eventHandler.lastMove = marginMove;
            }
          }
        }
      }
    },
    zoom: 0,
    screenZoom: function(width, anim, sel, height) {
      var callback, trans, zoom;
      if (height !== void 0) {
        height = screen.width - (screen.height - height);
        if (height < width) {
          width = height;
        }
      }
      zoom = width * 0.027 + 33.01;
      if (width < 1024 || zoom < 60) {
        zoom = 60;
      }
      eventHandler.zoom = zoom;
      eventHandler.scroll(sel);
      if (anim) {
        $('#body2').animate({
          'zoom': zoom + '%'
        }, animTime);
      } else {
        $('#body2').css({
          'zoom': zoom + '%'
        });
      }
      $('#newWindow').css({
        'zoom': zoom + '%'
      });
      if (!is_chrome) {
        trans = zoom / 100;
        if (anim) {
          $('#body2').css({
            "-moz-transition": "-moz-transform 0.4s"
          });
          $('#body2').css({
            '-moz-transform': 'scale(' + trans + ')',
            '-moz-transform-origin': 'center top'
          });
          callback = function() {
            return $('#body2').css({
              "-moz-transition": null
            });
          };
          setTimeout(callback, animTime);
        } else {
          $('#body2').css({
            '-moz-transform': 'scale(' + trans + ')',
            '-moz-transform-origin': 'center top'
          });
        }
        return $('#newWindow').css({
          '-moz-transform': 'scale(' + trans + ')',
          '-moz-transform-origin': 'center top'
        });
      }
    },
    zoomIn: function() {
      var callback, zoom;
      zoom = eventHandler.zoom + 15;
      if (zoom < 140 || isNaN(zoom)) {
        eventHandler.zoom += 15;
        if (is_chrome) {
          $('#body2').animate({
            'zoom': zoom + '%'
          }, {
            duration: 300,
            complete: callback
          });
          $('#newWindow').css({
            'zoom': zoom + '%'
          });
          if (!els.automaton.is(":visible") && !els.transactionTree.is(":visible")) {
            return eventHandler.scroll(0, 300);
          } else if (els.transactionTree.is(':visible')) {
            return eventHandler.scroll(2, 300);
          } else {
            return eventHandler.scroll(1, 300);
          }
        } else {
          $('#body2').css({
            "-moz-transition": "-moz-transform 0.4s"
          });
          $('#body2').css({
            '-moz-transform': 'scale(' + zoom / 100 + ')',
            '-moz-transform-origin': 'center top'
          });
          $('#newWindow').css({
            '-moz-transform': 'scale(' + zoom / 100 + ')',
            '-moz-transform-origin': 'center top'
          });
          callback = function() {
            $('#body2').css({
              "-moz-transition": null
            });
            return callback();
          };
          return setTimeout(callback, 500);
        }
      }
    },
    zoomOut: function() {
      var callback, zoom;
      zoom = eventHandler.zoom - 15;
      if (zoom > 40 || isNaN(zoom)) {
        eventHandler.zoom -= 15;
        if (is_chrome) {
          $('#body2').animate({
            'zoom': zoom + '%'
          }, 300);
          $('#newWindow').css({
            'zoom': zoom + '%'
          });
          if (!els.automaton.is(":visible") && !els.transactionTree.is(":visible")) {
            return eventHandler.scroll(0, 300);
          } else if (els.transactionTree.is(':visible')) {
            return eventHandler.scroll(2, 300);
          } else {
            return eventHandler.scroll(1, 300);
          }
        } else {
          $('#body2').css({
            "-moz-transition": "-moz-transform 0.4s"
          });
          $('#body2').css({
            '-moz-transform': 'scale(' + zoom / 100 + ')',
            '-moz-transform-origin': 'center top'
          });
          $('#newWindow').css({
            '-moz-transform': 'scale(' + zoom / 100 + ')',
            '-moz-transform-origin': 'center top'
          });
          callback = function() {
            return $('#body2').css({
              "-moz-transition": null
            });
          };
          return setTimeout(callback, 500);
        }
      }
    },
    sourceLoaded: false,
    showVideo: function() {
      els.closeVideo.attr('disabled', true);
      els.closeVideo.css({
        opacity: 0.5
      });
      if (!eventHandler.sourceLoaded) {
        els.demoVideo.attr({
          src: "../../video/demo.webm",
          type: "video/webm"
        });
        eventHandler.sourceLoaded = true;
      }
      return els.videoContainer.slideDown({
        duration: animTime,
        complete: function() {
          els.body2.hide();
          els.closeVideo.attr('disabled', false);
          els.closeVideo.css({
            opacity: 1
          });
          return document.getElementById('demoVideo').play();
        }
      });
    },
    hideVideo: function() {
      els.body2.show();
      document.getElementById('demoVideo').pause();
      return els.videoContainer.slideUp('normal');
    },
    disableProcessing: function() {
      els.processInput.attr('disabled', true);
      els.processInput.mouseout();
      return els.processInput.css({
        opacity: 0.5
      });
    },
    enableProcessing: function() {
      els.processInput.attr('disabled', false);
      return els.processInput.css({
        opacity: 1
      });
    },
    inputHint: function(button, msg) {
      var buttonWidth, move, pXPerLetter, pos;
      pos = button.position();
      els.inputHint.html(msg);
      buttonWidth = button.innerWidth();
      pXPerLetter = 5;
      move = (buttonWidth - msg.length * pXPerLetter) / 2;
      return els.inputHint.css({
        position: "absolute",
        top: pos.top - 22 + "px",
        left: pos.left + move + "px"
      }).show();
    },
    inputHintHide: function(msg) {
      if (msg === void 0 || msg === els.inputHint.html()) {
        return els.inputHint.hide();
      }
    },
    nextSample: function() {
      if (client.sample < 7) {
        client.sample += 1;
        els.sample.html('Sample' + client.sample);
      }
      if (client.sample === 2) {
        els.previous.attr('disabled', false);
        els.previous.css({
          opacity: 1
        });
      }
      if (client.sample === 7) {
        els.next.attr('disabled', true);
        els.next.mouseout();
        return els.next.css({
          opacity: 0.5
        });
      }
    },
    previousSample: function() {
      if (client.sample > 1) {
        client.sample -= 1;
        els.sample.html('Sample' + client.sample);
      }
      if (client.sample === 1) {
        els.previous.attr('disabled', true);
        els.slower.mouseout();
        els.previous.css({
          opacity: 0.5
        });
      }
      if (client.sample === 6) {
        els.next.attr('disabled', false);
        return els.next.css({
          opacity: 1
        });
      }
    },
    mainHint: function(button, msg) {
      var buttonWidth, move, pXPerLetter, pos;
      pos = button.position();
      els.mainHint.html(msg);
      buttonWidth = button.innerWidth();
      pXPerLetter = 6;
      move = (buttonWidth - msg.length * pXPerLetter) / 2;
      if (is_chrome) {
        return els.mainHint.css({
          position: "absolute",
          top: pos.top + 82 + "px",
          left: pos.left + 50 + move + "px"
        }).show();
      }
    },
    mainHintHide: function(msg) {
      if (msg === void 0 || msg === els.mainHint.html()) {
        return els.mainHint.hide();
      }
    },
    about: function() {
      els.body2.css({
        opacity: 0.5
      });
      eventHandler.mainHintHide();
      $('#wrap :input').each(function() {
        if (!$(this).is(':disabled')) {
          $(this).attr('disabled', true);
          $(this).mouseout();
          return eventHandler.disabledButtons.push($(this));
        }
      });
      return els.aboutBox.slideDown({
        duration: animTime
      });
    },
    switchTo: 1,
    enablingGraph: false,
    disablingGraph: false,
    checkAvailability: function() {
      if (graph.drawing || treeGraph.drawing) {
        stateHandler.printWarning('Drawing, Please Wait');
        return false;
      } else if (this.enablingGraph) {
        stateHandler.printWarning('Enabling, Please Wait');
        return false;
      } else if (this.disablingGraph) {
        stateHandler.printWarning('Disabling, Please Wait');
        return false;
      } else if (clearHandler.clearing) {
        stateHandler.printWarning('Clearing, Please Wait');
        return false;
      } else {
        return true;
      }
    },
    disableGraph: function(modifier) {
      if (eventHandler.checkAvailability() || modifier === 1) {
        if (els.pauseButton.is(':visible')) {
          eventHandler.pauseAnimation();
        }
        eventHandler.screenZoom(screen.width, true, 0);
        els.autoDisable.attr('disabled', true);
        eventHandler.disablingGraph = true;
        if (eventHandler.switchTo === 1) {
          els.automaton.slideUp({
            duration: animTime,
            complete: function() {
              els.autoDisable.hide();
              els.autoEnable.show();
              els.autoEnable.attr('disabled', false);
              els.help.attr("disabled", false);
              eventHandler.disablingGraph = false;
              els.nontransparent.hide();
              els.transparent.show();
              els.automaton.css({
                opacity: 1
              });
              stateHandler.print('Automaton');
              if (modifier === 1) {
                eventHandler.disableGraphBtn();
                return stateHandler.print('Waiting for File');
              }
            }
          });
          if (!els.helpMenu.is(':hidden')) {
            els.help.attr("disabled", true);
            els.help.mouseout();
            els.help.css({
              'border': ''
            });
            return els.helpMenu.css({
              left: 307,
              'display': 'none'
            });
          }
        } else {
          els.transactionTree.slideUp({
            duration: animTime,
            complete: function() {
              els.autoDisable.hide();
              els.autoEnable.show();
              els.autoEnable.attr('disabled', false);
              els.treeHelp.attr("disabled", false);
              eventHandler.disablingGraph = false;
              els.treeNontransparent.hide();
              els.treeTransparent.show();
              els.transactionTree.css({
                opacity: 1
              });
              stateHandler.print('Transaction Tree');
              if (modifier === 1) {
                eventHandler.disableGraphBtn();
                return stateHandler.print('Waiting for File');
              }
            }
          });
          if (!els.treeHelpMenu.is(':hidden')) {
            els.treeHelp.attr("disabled", true);
            els.treeHelp.mouseout();
            els.treeHelp.css({
              'border': ''
            });
            return els.treeHelpMenu.css({
              left: 307,
              'display': 'none'
            });
          }
        }
      }
    },
    disableGraphBtn: function() {
      els.autoEnable.attr('disabled', true);
      els.autoDisable.attr('disabled', true);
      els.autoEnable.css({
        opacity: 0.5
      });
      els.autoDisable.css({
        opacity: 0.5
      });
      els.switchToTree.attr('disabled', true);
      els.switchToAuto.attr('disabled', true);
      els.switchToTree.css({
        opacity: 0.5
      });
      return els.switchToAuto.css({
        opacity: 0.5
      });
    },
    enableGraphBtn: function() {
      els.autoEnable.attr('disabled', false);
      els.autoDisable.attr('disabled', false);
      els.autoEnable.css({
        opacity: 1
      });
      els.autoDisable.css({
        opacity: 1
      });
      els.switchToTree.attr('disabled', false);
      els.switchToAuto.attr('disabled', false);
      els.switchToTree.css({
        opacity: 1
      });
      return els.switchToAuto.css({
        opacity: 1
      });
    },
    enableGraph: function() {
      if (eventHandler.checkAvailability()) {
        eventHandler.enablingGraph = true;
        els.autoEnable.attr('disabled', true);
        if (eventHandler.switchTo === 1) {
          eventHandler.screenZoom(900 + screen.width - graph.autoWidth, true, 1);
          return els.automaton.slideDown({
            duration: animTime,
            complete: function() {
              if (graph.paths.length === 0 && graph.positions.length > 0) {
                graph.addOffsetAndCreateView();
                graph.draw(true);
              }
              els.autoEnable.hide();
              els.autoDisable.show();
              els.autoDisable.attr('disabled', false);
              eventHandler.enablingGraph = false;
              return stateHandler.print('Automaton');
            }
          });
        } else {
          eventHandler.screenZoom(900 + screen.width - treeGraph.treeWidth, true, 2, 750 + screen.height - treeGraph.treeHeight);
          return els.transactionTree.slideDown({
            duration: animTime,
            complete: function() {
              if (treeGraph.nodePaths.length === 0 && treeGraph.nodePositions.length > 0) {
                treeGraph.addOffsetAndCreateView();
                treeGraph.draw(true);
              }
              els.autoEnable.hide();
              els.autoDisable.show();
              els.autoDisable.attr('disabled', false);
              eventHandler.enablingGraph = false;
              return stateHandler.print('Transaction Tree');
            }
          });
        }
      }
    },
    switchToAuto: function() {
      if (eventHandler.checkAvailability()) {
        if (els.transactionTree.is(':visible')) {
          els.autoDisable.attr('disabled', true);
          els.transactionTree.slideUp({
            duration: animTime,
            complete: function() {
              var enableTree;
              enableTree = function() {
                return els.switchToTree.attr('disabled', false);
              };
              eventHandler.screenZoom(900 + screen.width - graph.autoWidth, true, 1, 750 + screen.height - graph.autoHeight);
              return els.automaton.slideDown({
                duration: animTime,
                complete: function() {
                  els.autoDisable.attr('disabled', false);
                  if (graph.paths.length === 0 && graph.positions.length > 0) {
                    graph.addOffsetAndCreateView();
                    graph.draw(true);
                    return setTimeout(enableTree, 400);
                  } else {
                    return enableTree();
                  }
                }
              });
            }
          });
        } else {
          els.switchToTree.attr('disabled', false);
        }
        els.switchToTree.css({
          'border': '3px outset #FFFFFF'
        });
        els.switchToAuto.css({
          'border': '3px inset #FFFFFF'
        });
        els.switchToAuto.attr('disabled', true);
        eventHandler.switchTo = 1;
        return stateHandler.print('Automaton');
      }
    },
    switchToTree: function() {
      if (eventHandler.checkAvailability()) {
        if (els.automaton.is(':visible')) {
          els.autoDisable.attr('disabled', true);
          if (els.pauseButton.is(':visible')) {
            eventHandler.pauseAnimation();
          }
          els.automaton.slideUp({
            duration: animTime,
            complete: function() {
              var enableAuto;
              enableAuto = function() {
                return els.switchToAuto.attr('disabled', false);
              };
              eventHandler.screenZoom(900 + screen.width - treeGraph.treeWidth, true, 2, 750 + screen.height - treeGraph.treeHeight);
              return els.transactionTree.slideDown({
                duration: animTime,
                complete: function() {
                  els.autoDisable.attr('disabled', false);
                  if (treeGraph.nodePaths.length === 0 && treeGraph.nodePositions.length > 0) {
                    treeGraph.addOffsetAndCreateView();
                    treeGraph.draw(true);
                    return setTimeout(enableAuto, 400);
                  } else {
                    return enableAuto();
                  }
                }
              });
            }
          });
        } else {
          els.switchToAuto.attr('disabled', false);
        }
        els.switchToAuto.css({
          'border': '3px outset #FFFFFF'
        });
        els.switchToTree.css({
          'border': '3px inset #FFFFFF'
        });
        els.switchToTree.attr('disabled', true);
        eventHandler.switchTo = 2;
        return stateHandler.print('Transaction Tree');
      }
    },
    makeTransparent: function() {
      if (eventHandler.checkAvailability()) {
        els.transparent.hide();
        els.nontransparent.show();
        return els.automaton.fadeTo('normal', 0.5);
      }
    },
    unmakeTransparent: function() {
      if (eventHandler.checkAvailability()) {
        els.nontransparent.hide();
        els.transparent.show();
        return els.automaton.fadeTo('normal', 1);
      }
    },
    disabledButtons: [],
    startAnimation: function() {
      if (graph.drawn && eventHandler.checkAvailability()) {
        if (!animator.alertRun) {
          els.body2.css({
            opacity: 0.5
          });
          eventHandler.autoHintHide();
          $('#wrap :input').each(function() {
            if (!$(this).is(':disabled')) {
              $(this).attr('disabled', true);
              return eventHandler.disabledButtons.push($(this));
            }
          });
          return els.alertSel.show();
        } else {
          stateHandler.printSuccess('Playing...');
          els.runButton.hide();
          els.runButton.mouseout();
          els.pauseButton.attr('disabled', false);
          els.pauseButton.css({
            opacity: 1
          });
          els.pauseButton.show();
          return animator.start(true);
        }
      }
    },
    disableRunMod: function() {
      els.incRun.attr('disabled', true);
      els.incRun.mouseout();
      els.incRun.css({
        opacity: 0.5
      });
      els.decRun.attr('disabled', true);
      els.decRun.mouseout();
      return els.decRun.css({
        opacity: 0.5
      });
    },
    enableRunMod: function() {
      if (animator.pathComb.length > 1) {
        if (animator.runSelection !== animator.pathComb.length) {
          els.incRun.attr('disabled', false);
          els.incRun.mouseout();
          els.incRun.css({
            opacity: 1
          });
        }
        if (animator.runSelection !== 1) {
          els.decRun.attr('disabled', false);
          els.decRun.mouseout();
          return els.decRun.css({
            opacity: 1
          });
        }
      }
    },
    incRun: function() {
      animator.removeHighlight();
      animator.makeSelection(animator.runSelection + 1);
      animator.highlightSelection();
      if (animator.runSelection === animator.pathComb.length) {
        els.incRun.attr('disabled', true);
        els.incRun.mouseout();
        els.incRun.css({
          opacity: 0.5
        });
      }
      if (animator.runSelection === 2) {
        els.decRun.attr('disabled', false);
        return els.decRun.css({
          opacity: 1
        });
      }
    },
    decRun: function() {
      animator.removeHighlight();
      animator.makeSelection(animator.runSelection - 1);
      animator.highlightSelection();
      if (animator.runSelection === 1) {
        els.decRun.attr('disabled', true);
        els.decRun.mouseout();
        els.decRun.css({
          opacity: 0.5
        });
      }
      if (animator.runSelection === animator.pathComb.length - 1) {
        els.incRun.attr('disabled', false);
        return els.incRun.css({
          opacity: 1
        });
      }
    },
    pauseAnimation: function() {
      animator.pause();
      els.pauseButton.attr('disabled', true);
      els.pauseButton.mouseout();
      els.pauseButton.css({
        opacity: 0.5
      });
      els.reset.attr('disabled', true);
      els.reset.mouseout();
      els.reset.css({
        opacity: 0.5
      });
      els.clearCanvas.attr('disabled', true);
      els.clearCanvas.mouseout();
      els.clearCanvas.css({
        opacity: 0.5
      });
      els.pauseButton.html('Pausing');
      return stateHandler.printWarning('Pausing...');
    },
    pauseFromAnim: function() {
      stateHandler.print('Paused');
      els.pauseButton.hide();
      els.pauseButton.html('Pause');
      els.pauseButton.attr('disabled', false);
      els.pauseButton.css({
        opacity: 1
      });
      els.reset.attr('disabled', false);
      els.reset.css({
        opacity: 1
      });
      els.clearCanvas.attr('disabled', false);
      els.clearCanvas.css({
        opacity: 1
      });
      els.resumeButton.attr('disabled', false);
      els.resumeButton.css({
        opacity: 1
      });
      return els.resumeButton.show();
    },
    stopAnimation: function() {
      stateHandler.print('Stopped');
      els.runButton.attr('disabled', false);
      els.runButton.css({
        opacity: 1
      });
      els.runButton.show();
      els.clearCanvas.attr('disabled', false);
      els.clearCanvas.css({
        opacity: 1
      });
      els.reset.attr('disabled', false);
      els.reset.css({
        opacity: 1
      });
      eventHandler.enableRunMod();
      els.pauseButton.hide();
      return els.resumeButton.hide();
    },
    resumeAnimation: function() {
      if (eventHandler.checkAvailability()) {
        stateHandler.printSuccess('Playing...');
        els.resumeButton.hide();
        els.pauseButton.show();
        return animator.resume();
      }
    },
    reset: function() {
      if (graph.drawn && eventHandler.checkAvailability()) {
        if (animator.animState === 'visit' || animator.animState === 'backVisit') {
          els.runButton.attr('disabled', true);
          els.runButton.css({
            opacity: 0.5
          });
          els.clearCanvas.attr('disabled', true);
          els.clearCanvas.css({
            opacity: 0.5
          });
          els.reset.attr('disabled', true);
          els.reset.mouseout();
          els.reset.css({
            opacity: 0.5
          });
        }
        animator.clear();
        els.runButton.show();
        els.pauseButton.hide();
        els.resumeButton.hide();
        graph.reset();
        return stateHandler.print('Stopped');
      }
    },
    clearCanvas: function() {
      if (graph.drawn && eventHandler.checkAvailability()) {
        graph.reset();
        graph.paper.clear();
        animator.clear();
        eventHandler.disableRunMod();
        els.clearCanvas.hide();
        els.drawCanvas.show();
        els.runButton.attr('disabled', false);
        els.pauseButton.hide();
        els.resumeButton.hide();
        els.runButton.show();
        stateHandler.print('Cleared');
        return graph.drawn = false;
      } else if (!graph.drawn && eventHandler.checkAvailability()) {
        return graph.clear();
      }
    },
    drawCanvas: function() {
      if (eventHandler.checkAvailability() && !graph.drawn && graph.positions.length > 0) {
        graph.addOffsetAndCreateView();
        graph.draw(true);
        eventHandler.enableRunMod();
        els.runButton.attr('disabled', false);
        els.runButton.css({
          opacity: 1
        });
        els.reset.attr('disabled', false);
        els.reset.css({
          opacity: 1
        });
        els.drawCanvas.hide();
        return els.clearCanvas.show();
      }
    },
    slower: function() {
      animator.animationSpeed(animator.speed - 1);
      if (animator.speed === 1) {
        els.slower.attr('disabled', true);
        els.slower.mouseout();
        els.slower.css({
          opacity: 0.5
        });
      }
      if (animator.speed === 4) {
        els.faster.attr('disabled', false);
        return els.faster.css({
          opacity: 1
        });
      }
    },
    faster: function() {
      animator.animationSpeed(animator.speed + 1);
      if (animator.speed === 2) {
        els.slower.attr('disabled', false);
        els.slower.css({
          opacity: 1
        });
      }
      if (animator.speed === 5) {
        els.faster.attr('disabled', true);
        els.faster.mouseout();
        return els.faster.css({
          opacity: 0.5
        });
      }
    },
    checkAndFill: function(vector) {
      var conc, el, glow, par, parEl, valid, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
      el = graph.ellipses[vector.vector];
      valid = false;
      if (!(_ref = vector.vector, __indexOf.call(animator.pathComb[animator.runSelection - 1], _ref) >= 0)) {
        _ref1 = vector.concVectors;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          conc = _ref1[_i];
          if (_ref2 = conc.vector, __indexOf.call(animator.pathComb[animator.runSelection - 1], _ref2) >= 0) {
            valid = true;
          }
        }
      } else {
        valid = true;
      }
      if (valid) {
        if ((animator.animState === 'backVisit' || animator.animState === 'pbackVisit') && el.state === 2) {
          glow = true;
          _ref3 = vector.parents;
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            par = _ref3[_j];
            parEl = graph.ellipses[par.vector];
            if (parEl.state !== 2) {
              glow = false;
            }
          }
          if (glow) {
            return el.glow();
          }
        } else if (el.state > 10) {
          return el.unglow();
        } else if (el.state === 1) {
          el.fill('#ffffff', 0);
          return el.state = 0;
        } else if (el.state === 0 && animator.animState !== 'backVisit' && animator.animState !== 'pbackVisit' && animator.animState !== 'stop') {
          el.fill('#B80000', 1);
          return el.state = 1;
        }
      }
    },
    autoHint: function(button, msg) {
      var buttonWidth, move, pXPerLetter, pos;
      pos = button.position();
      buttonWidth = button.innerWidth();
      els.autoHint.html(msg);
      pXPerLetter = 6.65;
      move = (buttonWidth - msg.length * pXPerLetter) / 2;
      if (window.is_chrome) {
        return els.autoHint.css({
          position: "absolute",
          top: pos.top - 22 + "px",
          left: pos.left + move + "px"
        }).show();
      }
    },
    autoHintHide: function(msg) {
      if (msg === void 0 || msg === els.autoHint.html()) {
        return els.autoHint.hide();
      }
    },
    showHelp: function() {
      if (eventHandler.checkAvailability()) {
        els.help.attr("disabled", true);
        els.help.mouseout();
        if (els.helpMenu.is(':hidden')) {
          els.helpMenu.css({
            'display': 'block'
          });
          els.help.css({
            'border': '3px inset #FFFFFF'
          });
          return els.helpMenu.animate({
            left: 2
          }, {
            duration: animTime,
            complete: function() {
              return els.help.attr("disabled", false);
            }
          });
        } else {
          els.help.css({
            'border': ''
          });
          return els.helpMenu.animate({
            left: 307
          }, {
            duration: animTime,
            complete: function() {
              els.helpMenu.css({
                'display': 'none'
              });
              return els.help.attr("disabled", false);
            }
          });
        }
      }
    },
    treeMakeTransparent: function() {
      if (eventHandler.checkAvailability()) {
        els.treeTransparent.hide();
        els.treeNontransparent.show();
        return els.transactionTree.fadeTo('normal', 0.5);
      }
    },
    treeUnmakeTransparent: function() {
      if (eventHandler.checkAvailability()) {
        els.treeNontransparent.hide();
        els.treeTransparent.show();
        return els.transactionTree.fadeTo('normal', 1);
      }
    },
    treeClearCanvas: function() {
      if (treeGraph.drawn && eventHandler.checkAvailability()) {
        stateHandler.print('Cleared');
        treeGraph.paper.clear();
        els.treeClearCanvas.hide();
        els.treeDrawCanvas.show();
        return treeGraph.drawn = false;
      } else if (!treeGraph.drawn && eventHandler.checkAvailability()) {
        return treeGraph.clear();
      }
    },
    treeDrawCanvas: function() {
      if (eventHandler.checkAvailability() && !treeGraph.drawn && treeGraph.leafPositions.length > 0) {
        treeGraph.addOffsetAndCreateView();
        treeGraph.draw(true);
        els.treeDrawCanvas.hide();
        return els.treeClearCanvas.show();
      }
    },
    treeHint: function(button, msg) {
      var buttonWidth, move, pXPerLetter, pos;
      pos = button.position();
      buttonWidth = button.innerWidth();
      els.treeHint.html(msg);
      pXPerLetter = 6.65;
      move = (buttonWidth - msg.length * pXPerLetter) / 2;
      if (window.is_chrome) {
        return els.treeHint.css({
          position: "absolute",
          top: pos.top - 22 + "px",
          left: pos.left + move + "px"
        }).show();
      }
    },
    treeHintHide: function(msg) {
      if (msg === void 0 || msg === els.treeHint.html()) {
        return els.treeHint.hide();
      }
    },
    showTreeHelp: function() {
      if (eventHandler.checkAvailability()) {
        els.treeHelp.attr("disabled", true);
        els.treeHelp.mouseout();
        if (els.treeHelpMenu.is(':hidden')) {
          els.treeHelpMenu.css({
            'display': 'block'
          });
          els.treeHelp.css({
            'border': '3px inset #FFFFFF'
          });
          return els.treeHelpMenu.animate({
            left: 2
          }, {
            duration: animTime,
            complete: function() {
              return els.treeHelp.attr("disabled", false);
            }
          });
        } else {
          els.treeHelp.css({
            'border': ''
          });
          return els.treeHelpMenu.animate({
            left: 307
          }, {
            duration: animTime,
            complete: function() {
              els.treeHelpMenu.css({
                'display': 'none'
              });
              return els.treeHelp.attr("disabled", false);
            }
          });
        }
      }
    }
  };

}).call(this);
