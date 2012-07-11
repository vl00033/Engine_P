(function() {
  var crad, marginBottom, marginLeft, marginRight, marginTop, rectFullHeight, rectFullWidth, rectHalfHeight, rectHalfWidth, shanimTime, treeCanvasHeight, treeCanvasWidth, treeDefaultHeight, treeDefaultWidth, treeDistX, treeDistY, treeHeight, treeOffsetX, treeWidth;

  treeDefaultWidth = 800;

  treeDefaultHeight = 550;

  treeCanvasWidth = treeDefaultWidth;

  treeCanvasHeight = treeDefaultHeight;

  treeHeight = treeDefaultHeight + 200;

  treeWidth = treeDefaultWidth + 100;

  crad = 30;

  rectHalfHeight = 40;

  rectHalfWidth = 40;

  rectFullWidth = 2 * rectHalfWidth;

  rectFullHeight = 2 * rectHalfHeight;

  treeDistY = 80;

  treeDistX = 100;

  marginLeft = 30;

  marginRight = 30;

  marginTop = 15;

  marginBottom = 15;

  treeOffsetX = 0;

  shanimTime = 400;

  window.treeGraph = {
    initButtons: function() {
      els.treeDrawCanvas.hide();
      els.treeClearCanvas.show();
      els.treeNontransparent.hide();
      els.treeTransparent.show();
      return els.transactionTree.css({
        opacity: 1
      });
    },
    paper: Raphael(document.getElementById('canvasContainer2'), treeCanvasWidth, treeCanvasHeight),
    nodePositions: [],
    leafPositions: [],
    leveledTree: [],
    nodePaths: [],
    leafShapes: [],
    nodeShapes: [],
    drawing: false,
    drawn: false,
    clear: function() {
      treeCanvasWidth = treeDefaultWidth;
      treeCanvasHeight = treeDefaultHeight;
      treeHeight = treeDefaultHeight + 200;
      treeWidth = treeDefaultWidth + 100;
      treeGraph.treeWidth = treeWidth;
      treeGraph.treeHeight = treeHeight;
      treeOffsetX = 0;
      this.initButtons();
      this.paper.clear();
      this.paper.setSize(treeCanvasWidth, treeCanvasHeight);
      if (!els.transactionTree.is(':hidden') && eventHandler.switchTo === 2) {
        this.animateSize();
      } else {
        this.setSize();
      }
      this.drawing = false;
      this.drawn = false;
      this.leafPositions = [];
      this.nodePositions = [];
      this.unleveledStruct = [];
      this.leafShapes = [];
      this.nodeShapes = [];
      this.nodePaths = [];
      return this.leveledTree = [];
    },
    addParents: function(tree) {
      var child, children, level, node, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tree.length; _i < _len; _i++) {
        level = tree[_i];
        _results.push((function() {
          var _j, _len2, _results2;
          _results2 = [];
          for (_j = 0, _len2 = level.length; _j < _len2; _j++) {
            node = level[_j];
            children = node.children;
            if (children !== void 0) {
              _results2.push((function() {
                var _k, _len3, _results3;
                _results3 = [];
                for (_k = 0, _len3 = children.length; _k < _len3; _k++) {
                  child = children[_k];
                  _results3.push(child.parent = node);
                }
                return _results3;
              })());
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        })());
      }
      return _results;
    },
    setSize: function() {
      var bar;
      els.canvasContainer2.height(treeCanvasHeight);
      els.transactionTree.height(treeHeight);
      els.canvasContainer2.width(treeCanvasWidth);
      bar = treeCanvasWidth - 10;
      els.treeCanvasBar.width(bar);
      return els.transactionTree.width(treeWidth);
    },
    setHeight: function(numLevels) {
      var margins, spacePerLevel, tempHeight;
      spacePerLevel = rectFullHeight + treeDistY;
      margins = marginTop + marginBottom;
      tempHeight = numLevels * spacePerLevel + margins - treeDistY;
      if (tempHeight > treeCanvasHeight) {
        treeHeight += tempHeight - treeCanvasHeight;
        this.paper.setSize(treeCanvasWidth, tempHeight);
        return treeCanvasHeight = tempHeight;
      }
    },
    setYPositions: function(leveledTree) {
      var i, level, node, nodePos, startingY, sub, _i, _j, _len, _len2, _results;
      startingY = marginTop + rectHalfHeight;
      i = 0;
      _results = [];
      for (_i = 0, _len = leveledTree.length; _i < _len; _i++) {
        level = leveledTree[_i];
        for (_j = 0, _len2 = level.length; _j < _len2; _j++) {
          node = level[_j];
          nodePos = {
            X: 0,
            Y: i * (rectFullHeight + treeDistY) + startingY
          };
          sub = node.id.substring(1, node.id.length);
          if (node.id.charAt(0) === 'l') {
            this.leafPositions[parseInt(sub)] = nodePos;
            this.leafPositions[parseInt(sub)].type = 'leaf';
          } else {
            this.nodePositions[parseInt(sub)] = nodePos;
            this.nodePositions[parseInt(sub)].type = 'node';
          }
        }
        _results.push(i++);
      }
      return _results;
    },
    setParBasedChildren: function(node) {
      var child, i, sumX, _i, _len, _ref;
      sumX = 0;
      i = 0;
      _ref = node.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (this.getPosition(child.id).X === 0) {
          this.getPosition(child.id).X += marginLeft + rectHalfWidth + i * treeDistX;
        }
        sumX += this.getPosition(child.id).X;
        i++;
      }
      return this.getPosition(node.id).X = sumX / node.children.length;
    },
    setUpperLevel: function(leveledTree, upperLevel) {
      var basisNodes, currID, currX, dist, i, lastID, lastX, node, size, sum, temp, toAdd, upperNodes, _results;
      upperNodes = leveledTree[upperLevel];
      basisNodes = leveledTree[upperLevel + 1];
      size = upperNodes.length;
      i = 0;
      temp = new list();
      lastID = 0;
      currID = 0;
      _results = [];
      while (i < size) {
        node = upperNodes[i];
        if (this.getPosition(node.id).X === 0) {
          if (node.children !== void 0 && node.children.length === 1) {
            if (i >= size / 2) {
              toAdd = this.getPosition(node.children[0].id).X + rectHalfWidth + treeDistX;
              this.getPosition(node.id).X += toAdd;
            } else {
              toAdd = this.getPosition(node.children[0].id).X - rectHalfWidth - treeDistX;
              this.getPosition(node.id).X += toAdd;
            }
            currID = node.id;
          } else if (node.children !== void 0) {
            this.setParBasedChildren(node);
            currID = node.id;
          } else {
            this.getPosition(node.id).X += marginLeft + rectHalfWidth + i * treeDistX;
            currID = node.id;
          }
          if (lastID !== 0 && lastID !== currID) {
            lastX = this.getPosition(lastID).X;
            currX = this.getPosition(currID).X;
            if ((sum = currX - lastX) < (dist = rectFullWidth + treeDistX)) {
              this.getPosition(currID).X += dist - sum;
            }
          }
          lastID = currID;
        }
        _results.push(i++);
      }
      return _results;
    },
    setChildren: function(parent, lastID) {
      var baseX, child, dist, i, lastX, moveX, size, sum, _i, _len, _ref;
      baseX = this.getPosition(parent.id).X;
      size = parent.children.length;
      moveX = baseX - (size - 1) * (rectFullWidth + treeDistX) / 2;
      i = 0;
      if (lastID !== -1) {
        lastX = this.getPosition(lastID).X;
        if ((sum = moveX - lastX) <= (dist = rectFullWidth + treeDistX)) {
          moveX += dist - sum;
        }
      }
      _ref = parent.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this.getPosition(child.id).X = moveX + i * (rectFullWidth + treeDistX);
        i++;
      }
      return this.getPosition(child.id).X;
    },
    setLowerLevel: function(leveledTree, lowerLevel) {
      var basisNode, basisNodes, currID, currX, dist, i, lastID, lastX, lowerNodes, node, parent, size, sum, toAdd, _results;
      lowerNodes = leveledTree[lowerLevel];
      basisNodes = leveledTree[lowerLevel - 1];
      size = lowerNodes.length;
      i = 0;
      currID = 0;
      lastID = -1;
      _results = [];
      while (i < size) {
        node = lowerNodes[i];
        basisNode = node.parent;
        if (this.getPosition(node.id).X === 0) {
          parent = node.parent;
          if (basisNode.children !== void 0 && basisNode.children.length === 1) {
            if (i >= size / 2) {
              toAdd = this.getPosition(basisNode.id).X - marginLeft + rectHalfWidth + treeDistX;
              this.getPosition(node.id).X += toAdd;
            } else {
              toAdd = this.getPosition(basisNode.id).X + marginLeft - rectHalfWidth - treeDistX;
              this.getPosition(node.id).X += toAdd;
            }
            currID = node.id;
          } else {
            this.setChildren(basisNode, lastID);
            currID = -1;
            lastID = basisNode.children[basisNode.children.length - 1].id;
          }
          if (lastID !== -1 && lastID !== currID && currID !== -1) {
            lastX = this.getPosition(lastID).X;
            currX = this.getPosition(currID).X;
            if ((sum = currX - lastX) < (dist = rectFullWidth + treeDistX)) {
              this.getPosition(currID).X += dist - sum;
            }
          }
          if (currID !== -1) lastID = node.id;
        }
        _results.push(i++);
      }
      return _results;
    },
    addWidth: function(toAdd) {
      treeCanvasWidth += toAdd;
      treeWidth += toAdd;
      treeGraph.treeWidth = treeWidth;
      treeGraph.treeHeight = treeHeight;
      return this.paper.setSize(treeCanvasWidth, treeCanvasHeight);
    },
    draw: function(animation) {
      var callback;
      this.drawing = true;
      eventHandler.screenZoom(900 + screen.width - treeWidth, true, 2, 750 + screen.height - treeHeight);
      callback = function() {
        var callback2, drawingFalse, level, node, _i, _j, _len, _len2, _ref;
        stateHandler.printWarning('Drawing...');
        drawingFalse = function() {
          treeGraph.drawing = false;
          treeGraph.drawn = true;
          return stateHandler.printSuccess('Done');
        };
        _ref = treeGraph.leveledTree;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          level = _ref[_i];
          for (_j = 0, _len2 = level.length; _j < _len2; _j++) {
            node = level[_j];
            if (node.id.charAt(0) !== 'l') {
              callback2 = function(id) {
                return treeGraph.drawPaths(treeGraph.getPaths(id), animation);
              };
              treeGraph.drawShape(node.id, animation, callback2);
            } else {
              treeGraph.drawShape(node.id, animation);
            }
          }
        }
        if (animation) {
          return setTimeout(drawingFalse, 2 * shanimTime);
        } else {
          return drawingFalse();
        }
      };
      if (animation) {
        return this.animateSize(callback);
      } else {
        this.setSize();
        return callback();
      }
    },
    drawShape: function(id, animation, callback) {
      var shape;
      shape = this.getShape(id);
      if (animation) {
        shape.shape.attr({
          opacity: 0
        }).animate({
          opacity: 1
        }, shanimTime, function() {
          if (callback !== void 0) return callback(id);
        });
        shape.text1.attr({
          opacity: 0
        });
        shape.text1.animate({
          opacity: 1
        }, shanimTime, true);
        if (shape.text2 !== void 0) {
          shape.text2.attr({
            opacity: 0
          });
          return shape.text2.animate({
            opacity: 1
          }, shanimTime, true);
        }
      } else {
        shape.shape.attr({
          opacity: 1
        });
        shape.text1.attr({
          opacity: 1
        });
        shape.text2.attr({
          opacity: 1
        });
        return callback(id);
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
          }, shanimTime));
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
      var currPos, leftInc, maxposX, minX, minposX, pos, rightInc, totalInc, _i, _j, _len, _len2, _ref, _ref2;
      minX = marginLeft + rectHalfWidth;
      maxposX = minX;
      minposX = minX;
      _ref = this.nodePositions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        currPos = _ref[_i];
        pos = currPos;
        if (pos !== void 0) {
          if (pos.X > maxposX) maxposX = pos.X;
          if (pos.X < minposX) minposX = pos.X;
        }
      }
      _ref2 = this.leafPositions;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        currPos = _ref2[_j];
        pos = currPos;
        if (pos !== void 0) {
          if (pos.X > maxposX) maxposX = pos.X;
          if (pos.X < minposX) minposX = pos.X;
        }
      }
      leftInc = minX - minposX;
      treeOffsetX = leftInc;
      rightInc = maxposX + marginRight + rectHalfWidth - treeCanvasWidth;
      totalInc = rightInc + leftInc;
      if (totalInc > 0) return this.addWidth(totalInc);
    },
    addOffsetAndCreateView: function() {
      var level, node, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _results;
      _ref = this.leveledTree;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        level = _ref[_i];
        for (_j = 0, _len2 = level.length; _j < _len2; _j++) {
          node = level[_j];
          this.getPosition(node.id).X += treeOffsetX;
          this.setShape(node.id, this.createShape(node));
        }
      }
      treeOffsetX = 0;
      _ref2 = this.leveledTree;
      _results = [];
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        level = _ref2[_k];
        _results.push((function() {
          var _l, _len4, _results2;
          _results2 = [];
          for (_l = 0, _len4 = level.length; _l < _len4; _l++) {
            node = level[_l];
            _results2.push(this.setPaths(node.id, this.createPaths(node)));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    },
    createPaths: function(node) {
      var child, fromX, fromY, path, temp, toX, toY, _i, _len, _ref;
      fromX = treeGraph.getPosition(node.id).X;
      fromY = treeGraph.getPosition(node.id).Y;
      if (node.type === 'alt') fromY += 59;
      temp = [];
      if (node.children !== void 0) {
        _ref = node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          toX = treeGraph.getPosition(child.id).X;
          toY = treeGraph.getPosition(child.id).Y;
          path = this.paper.path();
          path.attr({
            'path': 'M' + fromX + ' ' + fromY + 'L' + toX + ' ' + toY,
            opacity: 0
          }).toBack();
          temp[temp.length] = {
            path: path,
            fromNode: node.id,
            toNode: child.id,
            from: fromX + ' ' + fromY,
            to: toX + ' ' + toY
          };
        }
        return temp;
      }
    },
    getPosition: function(id) {
      var sub;
      sub = id.substring(1, id.length);
      if (id.charAt(0) === 'l') {
        return this.leafPositions[parseInt(sub)];
      } else {
        return this.nodePositions[parseInt(sub)];
      }
    },
    getShape: function(id) {
      var sub;
      sub = id.substring(1, id.length);
      if (id.charAt(0) === 'l') {
        return this.leafShapes[parseInt(sub)];
      } else {
        return this.nodeShapes[parseInt(sub)];
      }
    },
    setShape: function(id, shape) {
      var sub;
      sub = id.substring(1, id.length);
      if (id.charAt(0) === 'l') {
        return this.leafShapes[parseInt(sub)] = shape;
      } else {
        return this.nodeShapes[parseInt(sub)] = shape;
      }
    },
    setPaths: function(id, paths) {
      var sub;
      sub = id.substring(1, id.length);
      if (id.charAt(0) !== 'l') return this.nodePaths[parseInt(sub)] = paths;
    },
    getPaths: function(id) {
      var sub;
      sub = id.substring(1, id.length);
      if (id.charAt(0) !== 'l') return this.nodePaths[parseInt(sub)];
    },
    createShape: function(node) {
      var X, Y, addToPos, i, newText, rectX, rectY, shape, temp, text1, text2, text2Y;
      X = this.getPosition(node.id).X;
      Y = this.getPosition(node.id).Y;
      rectX = X - rectFullWidth / 2;
      rectY = Y - rectFullHeight / 2;
      temp = node;
      if (node.id.charAt(0) === 'l') {
        shape = this.paper.image().attr({
          src: '../img/leaf.png',
          x: rectX,
          y: rectY,
          width: rectFullWidth,
          height: rectFullHeight,
          fill: "white",
          opacity: 0
        });
      } else if (node.type === 'alt') {
        shape = this.paper.image().attr({
          src: '../img/alt.png',
          x: rectX,
          y: rectY,
          width: rectFullWidth,
          height: rectFullHeight + 20,
          fill: "white",
          opacity: 0
        });
      } else if (node.type === 'par') {
        shape = this.paper.image().attr({
          src: '../img/par.png',
          x: rectX,
          y: rectY,
          width: rectFullWidth,
          height: rectFullHeight,
          fill: "white",
          opacity: 0
        });
      } else if (node.type === 'seq') {
        shape = this.paper.image().attr({
          src: '../img/seq.png',
          x: rectX,
          y: rectY,
          width: rectFullWidth,
          height: rectFullHeight,
          fill: "white",
          opacity: 0
        });
      }
      newText = '';
      i = 0;
      addToPos = 0;
      if (node.id.charAt(0) === 'l') {
        newText = node.message;
        text2Y = Y + 40;
      } else {
        if (node.type === 'alt') addToPos = -8;
        newText = node.type;
        newText = newText.charAt(0).toUpperCase() + newText.slice(1);
        text2Y = Y + 70;
      }
      text1 = this.paper.text(X, Y + 1 + addToPos, newText);
      text1.attr({
        'font-size': 16,
        'cursor': 'default',
        opacity: 0
      }).toFront();
      text2 = this.paper.text(X + 30, text2Y, node.id);
      text2.attr({
        'font-size': 16,
        'cursor': 'default',
        opacity: 0
      }).toFront();
      return shape = {
        shape: shape,
        text1: text1,
        text2: text2,
        id: node.id
      };
    },
    animateSize: function(callback) {
      var bar;
      els.canvasContainer2.animate({
        height: treeCanvasHeight
      }, {
        duration: animTime,
        queue: false
      });
      els.transactionTree.animate({
        height: treeHeight
      }, {
        duration: animTime,
        queue: false
      });
      els.canvasContainer2.animate({
        width: treeCanvasWidth
      }, {
        duration: animTime,
        queue: false
      });
      bar = treeCanvasWidth - 10;
      els.treeCanvasBar.animate({
        width: bar
      }, {
        duration: animTime,
        queue: false
      });
      return els.transactionTree.animate({
        width: treeWidth
      }, {
        duration: animTime,
        queue: false,
        complete: function() {
          if (callback !== void 0) return callback();
        }
      });
    },
    setMaxPositions: function(leveledTree, level) {
      var i, nodes, size, startingX, startingY, _results;
      nodes = leveledTree[level];
      size = nodes.length;
      i = 0;
      startingX = marginLeft + rectHalfWidth;
      startingY = marginTop + rectHalfHeight;
      _results = [];
      while (i < size) {
        this.getPosition(nodes[i].id).X = i * (rectFullWidth + treeDistX) + startingX;
        _results.push(i++);
      }
      return _results;
    },
    createTreeGraph: function(leveledTree) {
      var X, currentLevel, finished, getMaxLevel, i, lowerLevel, max, maxLevel, upperLevel;
      this.addParents(leveledTree);
      this.clear();
      this.leveledTree = leveledTree;
      this.setHeight(leveledTree.length);
      this.setYPositions(leveledTree);
      max = 0;
      maxLevel = 0;
      getMaxLevel = function() {
        var index, level, _i, _len, _results;
        index = 0;
        _results = [];
        for (_i = 0, _len = leveledTree.length; _i < _len; _i++) {
          level = leveledTree[_i];
          if (level.length > max) {
            maxLevel = index;
            max = level.length;
          }
          _results.push(index++);
        }
        return _results;
      };
      getMaxLevel();
      this.setMaxPositions(leveledTree, maxLevel);
      X = treeCanvasWidth / 2;
      currentLevel = maxLevel - 1;
      i = 1;
      while (finished !== 2) {
        finished = 0;
        upperLevel = maxLevel - i;
        lowerLevel = maxLevel + i;
        if (upperLevel >= 0) {
          this.setUpperLevel(leveledTree, upperLevel, 2);
        } else {
          finished++;
        }
        if (lowerLevel < leveledTree.length) {
          this.setLowerLevel(leveledTree, lowerLevel, 1);
        } else {
          finished++;
        }
        i++;
      }
      this.recalculateSize();
      stateHandler.printSuccess('Generated Tree Graph');
      if (els.transactionTree.is(':visible')) {
        this.addOffsetAndCreateView();
        return this.draw(true);
      }
    }
  };

}).call(this);
