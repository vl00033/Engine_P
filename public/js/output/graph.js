(function() {
  var autoHeight, autoWidth, defaultHeight, defaultWidth, distX, distY, eheight, elanimTime, ewidth, height, marginBottom, marginLeft, marginRight, marginTop, offsetX, rheight, rwidth, width;

  defaultWidth = 800;

  defaultHeight = 550;

  width = defaultWidth;

  height = defaultHeight;

  autoHeight = defaultHeight + 200;

  autoWidth = defaultWidth + 100;

  rwidth = 120;

  rheight = 25;

  ewidth = 2 * rwidth;

  eheight = 2 * rheight;

  distY = 120;

  distX = 100;

  marginLeft = 30;

  marginRight = 30;

  marginTop = 15;

  marginBottom = 15;

  offsetX = 0;

  elanimTime = 400;

  window.graph = {
    initButtons: function() {
      els.drawCanvas.hide();
      els.clearCanvas.show();
      els.nontransparent.hide();
      els.transparent.show();
      els.automaton.css({
        opacity: 1
      });
      eventHandler.disableRunMod();
      els.runButton.attr('disabled', false);
      els.runButton.css({
        opacity: 1
      });
      els.runButton.show();
      els.reset.attr('disabled', false);
      els.reset.css({
        opacity: 1
      });
      els.faster.attr('disabled', false);
      els.faster.css({
        opacity: 1
      });
      els.slower.attr('disabled', false);
      els.slower.css({
        opacity: 1
      });
      els.pauseButton.attr('disabled', false);
      els.pauseButton.css({
        opacity: 1
      });
      els.pauseButton.hide();
      els.resumeButton.attr('disabled', false);
      els.resumeButton.css({
        opacity: 1
      });
      return els.resumeButton.hide();
    },
    paper: Raphael(document.getElementById('canvasContainer'), width, height),
    positions: [],
    topVector: 0,
    paths: [],
    ellipses: [],
    drawing: false,
    drawn: false,
    unleveledStruct: [],
    clear: function() {
      eventHandler.disableRunMod();
      animator.clear();
      animator.pathComb = [];
      this.initButtons();
      width = defaultWidth;
      height = defaultHeight;
      autoHeight = defaultHeight + 200;
      autoWidth = defaultWidth + 100;
      graph.autoWidth = autoWidth;
      graph.autoHeight = autoHeight;
      offsetX = 0;
      this.paper.clear();
      this.paper.setSize(width, height);
      if (!els.automaton.is(':hidden') && eventHandler.switchTo === 1) {
        this.animateSize();
      } else {
        this.setSize();
      }
      this.drawing = false;
      this.drawn = false;
      this.positions = [];
      this.unleveledStruct = [];
      this.ellipses = [];
      this.paths = [];
      return this.topVector = 0;
    },
    setHeight: function(numLevels) {
      var margins, spacePerLevel, tempHeight;
      spacePerLevel = eheight + distY;
      margins = marginTop + marginBottom;
      tempHeight = numLevels * spacePerLevel + margins - distY;
      if (tempHeight > height) {
        autoHeight += tempHeight - height;
        this.paper.setSize(width, tempHeight);
        return height = tempHeight;
      }
    },
    setYPositions: function(graphStruct) {
      var i, level, startingY, vector, vectorPos, _i, _j, _len, _len1, _results;
      startingY = marginTop + rheight;
      i = 0;
      _results = [];
      for (_i = 0, _len = graphStruct.length; _i < _len; _i++) {
        level = graphStruct[_i];
        for (_j = 0, _len1 = level.length; _j < _len1; _j++) {
          vector = level[_j];
          vectorPos = {
            X: 0,
            Y: i * (eheight + distY) + startingY
          };
          this.positions[vector.vector] = vectorPos;
        }
        _results.push(i++);
      }
      return _results;
    },
    setMaxPositions: function(graphStruct, level) {
      var i, size, startingX, startingY, vectors, _results;
      vectors = graphStruct[level];
      size = vectors.length;
      i = 0;
      startingX = marginLeft + rwidth;
      startingY = marginTop + rheight;
      _results = [];
      while (i < size) {
        this.positions[vectors[i].vector].X = i * (ewidth + distX) + startingX;
        _results.push(i++);
      }
      return _results;
    },
    findVectorByVector: function(vector, vectorArray) {
      var vect, _i, _len;
      for (_i = 0, _len = vectorArray.length; _i < _len; _i++) {
        vect = vectorArray[_i];
        if (vect.vector === vector) {
          return vect;
        }
      }
      return -1;
    },
    setParentsSharing: function(parents, shared) {
      var i, j, par, sumX, temp, _i, _len, _results;
      sumX = 0;
      i = -1;
      j = 0;
      temp = new list();
      _results = [];
      for (_i = 0, _len = parents.length; _i < _len; _i++) {
        par = parents[_i];
        this.positions[par.vector].X = this.positions[shared.vector].X + (i * (rwidth + distX));
        i *= -1;
        j++;
        if (j % 2 === 0) {
          _results.push(i++);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    setParBasedChildren: function(vector) {
      var child, sumX, _i, _len, _ref;
      sumX = 0;
      _ref = vector.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        sumX += this.positions[child.vector].X;
      }
      return this.positions[vector.vector].X = sumX / vector.children.length;
    },
    checkForCollision: function(vec1, vec2) {
      var currX, lastX, sum;
      currX = graph.positions[vec1.vector].X;
      lastX = graph.positions[vec2.vector].X;
      if (lastX !== 0) {
        if (lastX >= currX) {
          sum = lastX + ewidth + distX;
          return graph.positions[vec1.vector].X = lastX + ewidth + distX;
        } else if (lastX < currX && (sum = currX - lastX) < ewidth + distX) {
          return graph.positions[vec1.vector].X += ewidth + distX - sum;
        }
      }
    },
    setUpperLevel: function(graphStruct, upperLevel) {
      var basisVectors, curPos, firstParent, i, lastParent, lastParentX, par, parents, shared, sharing, size, sum, temp, upperVectors, vect, _i, _len, _results;
      upperVectors = graphStruct[upperLevel];
      basisVectors = graphStruct[upperLevel + 1];
      size = upperVectors.length;
      i = 0;
      temp = new list();
      lastParentX = 0;
      lastParent = null;
      _results = [];
      while (i < size) {
        vect = upperVectors[i];
        if (this.positions[vect.vector].X === 0) {
          sharing = vect.sharing;
          if (sharing.length > 0) {
            shared = sharing[0];
            parents = shared.parents;
            if (lastParentX !== 0) {
              firstParent = parents[0];
              lastParent = parents[parents.length - 1];
              this.setParentsSharing(parents, shared);
              if ((sum = this.positions[firstParent.vector].X - lastParentX) < (ewidth + distX)) {
                for (_i = 0, _len = parents.length; _i < _len; _i++) {
                  par = parents[_i];
                  this.positions[par.vector].X += ewidth + distX - sum;
                }
                lastParentX = this.positions[lastParent.vector].X;
              }
            } else {
              this.setParentsSharing(parents, shared);
              lastParent = parents[parents.length - 1];
              lastParentX = this.positions[lastParent.vector].X;
            }
          } else if (vect.children.length === 1) {
            if (i >= size / 2) {
              this.positions[vect.vector].X = this.positions[vect.children[0].vector].X + rwidth + distX;
              if (lastParent !== null) {
                this.checkForCollision(vect, lastParent);
              }
              lastParent = vect;
            } else {
              this.positions[vect.vector].X = this.positions[vect.children[0].vector].X - rwidth - distX;
              if (lastParent !== null) {
                this.checkForCollision(vect, lastParent);
              }
              lastParent = vect;
            }
          } else if (vect.children.length > 0) {
            this.setParBasedChildren(vect);
            curPos = this.positions[vect.vector].X;
            if (lastParent !== null) {
              this.checkForCollision(vect, lastParent);
            }
            lastParent = vect;
          } else {
            this.positions[vect.vector].X = marginLeft + rwidth + i * (distX + rwidth);
            if (lastParent !== null) {
              this.checkForCollision(vect, lastParent);
            }
            lastParent = vect;
          }
        }
        _results.push(i++);
      }
      return _results;
    },
    setChildBasedParents: function(vector) {
      var par, sumX, _i, _len, _ref;
      sumX = 0;
      _ref = vector.parents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        par = _ref[_i];
        sumX += this.positions[par.vector].X;
      }
      return this.positions[vector.vector].X = sumX / vector.parents.length;
    },
    setChildren: function(parent) {
      var baseX, child, i, moveX, size, _i, _len, _ref, _results;
      baseX = this.positions[parent.vector].X;
      size = parent.children.length;
      moveX = baseX - (size - 1) * (ewidth + distX) / 2;
      i = 0;
      _ref = parent.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this.positions[child.vector].X = moveX + i * (ewidth + distX);
        _results.push(i++);
      }
      return _results;
    },
    setLowerLevel: function(graphStruct, lowerLevel) {
      var basisVect, basisVectors, i, lowerVectors, parents, sharedVectX, size, sum, vect, _results;
      lowerVectors = graphStruct[lowerLevel];
      basisVectors = graphStruct[lowerLevel - 1];
      size = lowerVectors.length;
      i = 0;
      sharedVectX = 0;
      _results = [];
      while (i < size) {
        vect = lowerVectors[i];
        basisVect = vect.parents[0];
        if (this.positions[vect.vector].X === 0) {
          parents = vect.parents;
          if (parents.length > 1) {
            if (sharedVectX !== 0) {
              this.setChildBasedParents(vect);
              if ((sum = this.positions[vect.vector].X - sharedVectX) < (ewidth + distX)) {
                this.positions[vect.vector].X += ewidth + distX - sum;
                sharedVectX = this.positions[vect.vector].X;
              }
            } else {
              this.setChildBasedParents(vect);
              sharedVectX = this.positions[vect.vector].X;
            }
          } else if (basisVect.children.length === 1) {
            if (i >= size / 2) {
              this.positions[vect.vector].X = this.positions[basisVect.vector].X + rwidth + distX;
            } else {
              this.positions[vect.vector].X = this.positions[basisVect.vector].X - rwidth - distX;
            }
          } else {
            this.setChildren(basisVect);
          }
        }
        _results.push(i++);
      }
      return _results;
    },
    addWidth: function(toAdd) {
      width += toAdd;
      autoWidth += toAdd;
      graph.autoWidth = autoWidth;
      graph.autoHeight = autoHeight;
      return this.paper.setSize(width, height);
    },
    draw: function(animation, autoZoom) {
      var callback, drawingFalse;
      if (this.unleveledStruct.length > 0) {
        this.drawing = true;
        eventHandler.enableRunMod();
        if (autoZoom === void 0 || autoZoom) {
          eventHandler.screenZoom(900 + screen.width - autoWidth, true, 1, 750 + screen.height - autoHeight);
        }
        drawingFalse = function() {
          var canvas, rect, svgSer;
          graph.drawing = false;
          graph.drawn = true;
          stateHandler.printSuccess('Done');
          if (client.autoGraph === '') {
            rect = graph.paper.rect(0, 0, width, height).attr({
              fill: '#C3C3C5'
            }).toBack();
            svgSer = els.canvasContainer.html();
            canvas = document.getElementById('canvas');
            canvg(canvas, svgSer);
            client.autoGraph = canvas.toDataURL("image/png");
            rect.remove();
          }
          return animator.highlightSelection();
        };
        stateHandler.printWarning('Drawing...');
        callback = function() {
          var callback2, vec, _i, _len, _ref;
          _ref = graph.unleveledStruct;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            vec = _ref[_i];
            callback2 = function(vector) {
              return graph.drawPaths(graph.paths[vector], animation);
            };
            graph.drawEllipse(vec.vector, animation, callback2);
          }
          if (animation) {
            return setTimeout(drawingFalse, 2 * elanimTime);
          } else {
            drawingFalse();
            return animator.highlightSelection();
          }
        };
        if (animation) {
          return this.animateSize(callback);
        } else {
          this.setSize();
          return callback();
        }
      }
    },
    drawEllipse: function(vector, animation, callback) {
      var ellipse;
      ellipse = this.ellipses[vector];
      if (animation) {
        ellipse.ellipse.attr({
          opacity: 0
        }).animate({
          opacity: 1
        }, elanimTime, function() {
          return callback(vector);
        });
        ellipse.text1.attr({
          opacity: 0
        });
        ellipse.text1.animate({
          opacity: 1
        }, elanimTime, true);
        ellipse.text2.attr({
          opacity: 0
        });
        return ellipse.text2.animate({
          opacity: 1
        }, elanimTime, true);
      } else {
        ellipse.ellipse.attr({
          opacity: 1
        });
        ellipse.text1.attr({
          opacity: 1
        });
        ellipse.text2.attr({
          opacity: 1
        });
        return callback(vector);
      }
    },
    drawPaths: function(paths, animation) {
      var path, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        if (animation) {
          _results.push(path.path.attr({
            opacity: 1,
            'path': 'M' + path.from
          }).animate({
            'path': 'M' + path.from + 'L' + path.to
          }, elanimTime));
        } else {
          _results.push(path.path.attr({
            opacity: 1,
            'path': 'M' + path.from + 'L' + path.to
          }));
        }
      }
      return _results;
    },
    recalculateSize: function() {
      var currPos, leftInc, maxposX, minX, minposX, pos, rightInc, totalInc, _i, _len, _ref;
      minX = marginLeft + rwidth;
      maxposX = minX;
      minposX = minX;
      _ref = this.positions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        currPos = _ref[_i];
        pos = currPos;
        if (pos.X > maxposX) {
          maxposX = pos.X;
        }
        if (pos.X < minposX) {
          minposX = pos.X;
        }
      }
      leftInc = minX - minposX;
      offsetX = leftInc;
      rightInc = maxposX + marginRight + rwidth - width;
      totalInc = rightInc + leftInc;
      if (totalInc > 0) {
        return this.addWidth(totalInc);
      }
    },
    addOffsetAndCreateView: function() {
      var vec, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.unleveledStruct;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vec = _ref[_i];
        this.positions[vec.vector].X += offsetX;
        this.ellipses[vec.vector] = this.createEllipse(vec);
      }
      offsetX = 0;
      _ref1 = this.unleveledStruct;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        vec = _ref1[_j];
        _results.push(this.paths[vec.vector] = this.createPaths(vec));
      }
      return _results;
    },
    createPaths: function(vector) {
      var child, fromX, fromY, ind, path, temp, toX, toY, _i, _len, _ref;
      fromX = graph.positions[vector.vector].X;
      fromY = graph.positions[vector.vector].Y;
      temp = [];
      ind = 0;
      _ref = vector.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        toX = graph.positions[child.vector].X;
        toY = graph.positions[child.vector].Y;
        path = this.paper.path();
        path.attr({
          'path': 'M' + fromX + ' ' + fromY + 'L' + toX + ' ' + toY,
          opacity: 0
        }).toBack();
        temp[temp.length] = {
          path: path,
          tempPath: 0,
          fromVector: vector.vector,
          toVector: child.vector,
          from: fromX + ' ' + fromY,
          to: toX + ' ' + toY,
          index: ind,
          state: 0,
          animate: function(color, reverse) {
            var delTemp, fromVector, index, tempFrom, tempTo;
            if (animator.animState !== 'stop') {
              fromVector = this.fromVector;
              if (reverse) {
                tempTo = this.from;
                tempFrom = this.to;
                this.state = 1;
              } else {
                tempTo = this.to;
                tempFrom = this.from;
                this.state = 2;
              }
              this.tempPath = graph.paper.path();
              this.tempPath.attr({
                'path': 'M' + tempFrom,
                'stroke-width': 5,
                'stroke': color
              });
              graph.ellipses[this.fromVector].ellipse.toFront();
              graph.ellipses[this.toVector].ellipse.toFront();
              graph.ellipses[this.fromVector].text1.toFront().attr({
                'font-size': 14
              });
              graph.ellipses[this.toVector].text1.toFront().attr({
                'font-size': 14
              });
              fromVector = this.fromVector;
              index = this.index;
              delTemp = function() {
                var curPath;
                path = graph.paths[fromVector];
                if (path.length > 0) {
                  curPath = path[index];
                  if (curPath.tempPath !== 0) {
                    curPath.path.remove();
                    curPath.path = curPath.tempPath;
                    return curPath.tempPath = 0;
                  }
                }
              };
              return this.tempPath.animate({
                'path': 'M' + tempFrom + 'L' + tempTo
              }, animator.pathAnimTime, function() {
                return delTemp();
              });
            }
          }
        };
        ind++;
      }
      return temp;
    },
    createEllipse: function(vector, alt) {
      var X, Y, el, i, inSub, newText, outSub, subVectors, temp, text1, text2, _i, _j, _len, _len1;
      X = this.positions[vector.vector].X;
      Y = this.positions[vector.vector].Y;
      temp = vector;
      el = this.paper.ellipse().attr({
        cx: X,
        cy: Y,
        rx: rwidth,
        ry: rheight,
        fill: "white",
        opacity: 0
      }).click(function() {
        return eventHandler.checkAndFill(temp);
      });
      newText = '';
      i = 0;
      subVectors = vector.subVectors;
      newText += '(';
      for (_i = 0, _len = subVectors.length; _i < _len; _i++) {
        outSub = subVectors[_i];
        for (_j = 0, _len1 = outSub.length; _j < _len1; _j++) {
          inSub = outSub[_j];
          newText += inSub;
        }
        if (i < subVectors.length - 1) {
          newText += ',';
        }
        i++;
      }
      newText += ')';
      text1 = this.paper.text(X, Y + 1, newText);
      text1.attr({
        'font-size': 14,
        'cursor': 'default',
        opacity: 0
      }).click(function() {
        return eventHandler.checkAndFill(temp);
      }).toFront();
      text2 = this.paper.text(X + rwidth, rheight, 'v' + vector.vector);
      text2.attr({
        y: Y + rheight,
        'font-size': 15,
        'cursor': 'default',
        opacity: 0
      }).toFront();
      return this.ellipses[vector.vector] = {
        ellipse: el,
        text1: text1,
        text2: text2,
        state: 0,
        vector: vector.vector,
        glowObj: 0,
        glow: function() {
          this.glowObj = this.ellipse.glow();
          return this.state += 10;
        },
        unglow: function() {
          if (this.glowObj !== 0) {
            this.glowObj.remove();
            this.state -= 10;
            return this.glowObj = 0;
          }
        },
        fill: function(color, stateTo) {
          if (this.state !== stateTo) {
            this.state = stateTo;
            if (stateTo === 2 && this.state !== 1 || stateTo !== 2) {
              vector = this.vector;
              return this.ellipse.animate({
                fill: color
              }, animator.elAnimTime, "linear");
            }
          }
        }
      };
    },
    animateSize: function(callback) {
      var bar;
      els.canvasContainer.animate({
        height: height
      }, {
        duration: animTime,
        queue: false
      });
      els.automaton.animate({
        height: autoHeight
      }, {
        duration: animTime,
        queue: false
      });
      els.canvasContainer.animate({
        width: width
      }, {
        duration: animTime,
        queue: false
      });
      bar = width - 10;
      els.canvasBar.animate({
        width: bar
      }, {
        duration: animTime,
        queue: false
      });
      return els.automaton.animate({
        width: autoWidth
      }, {
        duration: animTime,
        queue: false,
        complete: function() {
          if (callback !== void 0) {
            return callback();
          }
        }
      });
    },
    setSize: function() {
      var bar;
      els.canvasContainer.height(height);
      els.automaton.height(autoHeight);
      els.canvasContainer.width(width);
      bar = width - 10;
      els.canvasBar.width(bar);
      return els.automaton.width(autoWidth);
    },
    getUnleveled: function(graphStruct) {
      var level, vec, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = graphStruct.length; _i < _len; _i++) {
        level = graphStruct[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = level.length; _j < _len1; _j++) {
            vec = level[_j];
            _results1.push(this.unleveledStruct[vec.vector] = vec);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    reset: function() {
      var ellipse, p, path, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      _ref = this.ellipses;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ellipse = _ref[_i];
        ellipse.ellipse.stop();
      }
      _ref1 = this.paths;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        path = _ref1[_j];
        if (path.length > 0) {
          for (_k = 0, _len2 = path.length; _k < _len2; _k++) {
            p = path[_k];
            if (p.tempPath !== 0) {
              p.tempPath.stop();
            }
          }
        }
      }
      this.paper.clear();
      this.addOffsetAndCreateView();
      return this.draw(false, false);
    },
    createAutomaton: function(graphStruct, maxLevel) {
      var finished, i, lowerLevel, upperLevel;
      this.clear();
      this.getUnleveled(graphStruct);
      this.setHeight(graphStruct.length);
      this.setYPositions(graphStruct);
      this.setMaxPositions(graphStruct, maxLevel);
      i = 1;
      this.topVector = graphStruct[0][0];
      while (finished !== 2) {
        finished = 0;
        upperLevel = maxLevel - i;
        lowerLevel = maxLevel + i;
        if (upperLevel >= 0) {
          this.setUpperLevel(graphStruct, upperLevel, 2);
        } else {
          finished++;
        }
        if (lowerLevel < graphStruct.length) {
          this.setLowerLevel(graphStruct, lowerLevel, 1);
        } else {
          finished++;
        }
        i++;
      }
      this.recalculateSize();
      animator.getAltComb(this.topVector, []);
      animator.makeSelection(1);
      stateHandler.printSuccess('Generated Automaton');
      if (els.automaton.is(':visible')) {
        this.addOffsetAndCreateView();
        return this.draw(true);
      }
    }
  };

}).call(this);
