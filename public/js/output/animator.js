(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.animator = {
    elAnimTime: 300,
    retryTime: 600,
    pathAnimTime: 1000,
    speed: 3,
    pathComb: [],
    alertRun: false,
    runSelection: 1,
    animState: 'stop',
    pausedArray: [],
    pausedReverseArray: [],
    errorArray: [],
    animationSpeed: function(speed) {
      if (speed === 5) {
        this.retryTime = 400;
        this.elAnimTime = 100;
        this.pathAnimTime = 500;
        els.speed.html('5X');
      } else if (speed === 4) {
        this.retryTime = 500;
        this.elAnimTime = 300;
        this.pathAnimTime = 700;
        els.speed.html('4X');
      } else if (speed === 3) {
        this.retryTime = 600;
        this.elAnimTime = 500;
        this.pathAnimTime = 1000;
        els.speed.html('3X');
      } else if (speed === 2) {
        this.elAnimTime = 600;
        this.pathAnimTime = 1300;
        this.retryTime = 800;
        els.speed.html('2X');
      } else if (speed === 1) {
        this.retryTime = 900;
        this.elAnimTime = 800;
        this.pathAnimTime = 1500;
        els.speed.html('1X');
      }
      return this.speed = speed;
    },
    clear: function() {
      this.animState = 'stop';
      this.pausedArray = [];
      this.pausedReverseArray = [];
      return this.errorArray = [];
    },
    makeSelection: function(sel) {
      this.runSelection = sel;
      els.runButton.html('Run&#160;&#160;&#160;' + sel);
      els.pauseButton.html('Pause&#160;&#160;&#160;' + sel);
      return els.resumeButton.html('Resume&#160;&#160;&#160;' + sel);
    },
    highlightSelection: function() {
      var conc, concEl, el, node, _i, _len, _ref, _results;
      _ref = this.pathComb[this.runSelection - 1];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        el = graph.ellipses[node];
        if (el.state < 10) {
          el.glow();
        }
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = graph.unleveledStruct[node].concVectors;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            conc = _ref1[_j];
            concEl = graph.ellipses[conc.vector];
            if (concEl.state < 10) {
              _results1.push(concEl.glow());
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    },
    removeHighlight: function() {
      var conc, concEl, el, node, _i, _len, _ref, _results;
      _ref = this.pathComb[this.runSelection - 1];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        el = graph.ellipses[node];
        if (el.state > 9) {
          el.unglow();
        }
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = graph.unleveledStruct[node].concVectors;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            conc = _ref1[_j];
            concEl = graph.ellipses[conc.vector];
            if (concEl.state > 9) {
              _results1.push(concEl.unglow());
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    },
    getAltComb: function(header, arr) {
      var altCh, checkConc, child, children, firstNotAlt, last, lastEl, _i, _len;
      arr = arr.slice(0, arr.length);
      arr.push(header.vector);
      children = header.children;
      if (children.length === 0) {
        last = animator.pathComb[animator.pathComb.length - 1];
        if (last !== void 0) {
          lastEl = last[last.length - 1];
          if (arr.length < last.length && graph.positions[lastEl].X > graph.positions[arr[arr.length - 1]].X) {
            return animator.pathComb.unshift(arr);
          } else {
            return animator.pathComb.push(arr);
          }
        } else {
          return animator.pathComb.push(arr);
        }
      } else if (children.length === 1) {
        return animator.getAltComb(children[0], arr);
      } else {
        checkConc = function(vec1, vec2) {
          var conc, _i, _len, _ref;
          _ref = vec1.concVectors;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            conc = _ref[_i];
            if (conc.vector === vec2.vector) {
              return true;
            }
          }
          return false;
        };
        firstNotAlt = null;
        altCh = null;
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          if (child.alt && (firstNotAlt === null || !checkConc(child, firstNotAlt))) {
            altCh = child;
            animator.getAltComb(child, arr);
          } else {
            if (firstNotAlt === null && (altCh === null || altCh !== null && !checkConc(altCh, child))) {
              firstNotAlt = child;
            }
          }
        }
        if (firstNotAlt !== null) {
          return animator.getAltComb(firstNotAlt, arr);
        }
      }
    },
    fixForwardArr: function(header, visited, forarr, newArr) {
      var added, k, list;
      k = 0;
      added = false;
      while (k < forarr.length) {
        list = forarr[k];
        if (list[list.length - 1].vector === header.vector) {
          forarr.splice(k, 1);
        }
        if (list[list.length - 1].vector === visited.vector) {
          added = true;
          list.unshift(header);
        }
        k++;
      }
      if (!added) {
        return forarr.push(newArr);
      }
    },
    recoveryVisit: function(arr, forarr, errArr) {
      var conc, el, fillWhite, header, newArr, par, timedVisit, visArr, visited, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
      try {
        if (this.checkStatus(arr, forarr, errArr)) {
          newArr = arr.pop();
          header = newArr[0];
          visited = newArr[1];
          if (!(_ref = header.vector, __indexOf.call(animator.pathComb[animator.runSelection - 1], _ref) >= 0)) {
            return animator.recoveryVisit(arr, forarr, errArr);
          } else {
            this.fixForwardArr(header, visited, forarr, newArr);
            if (arr.length === 0) {
              el = graph.ellipses[visited.vector];
              fillWhite = function() {
                if (el.state !== 12) {
                  return el.fill('#ffffff', 0);
                }
              };
              setTimeout(fillWhite, this.elAnimTime + this.pathAnimTime - 200);
            }
            visArr = [];
            visArr[0] = visited;
            if (header.parents.length > 1) {
              _ref1 = header.parents;
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                par = _ref1[_i];
                this.visitReverseNode(header, par);
                visArr[visArr.length] = par;
              }
            }
            if (header.concVectors.length > 0) {
              _ref2 = header.concVectors;
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                conc = _ref2[_j];
                if (conc.parents.length > 1) {
                  _ref3 = conc.parents;
                  for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                    par = _ref3[_k];
                    this.visitReverseNode(conc, par);
                    visArr[visArr.length] = par;
                  }
                } else {
                  this.visitReverseNode(conc, conc.parents[0]);
                  visArr[visArr.length] = conc.parents[0];
                }
              }
            }
            this.visitReverseNode(header, visited);
            timedVisit = function() {
              var added, changed, changed2, combArr, containsObject, curNew, currSelection, index, lastArr, removeAndProceed, toBecome, vis, _l, _len3;
              try {
                if (animator.animState === 'pbackVisit') {
                  toBecome = 'pvisit';
                } else {
                  toBecome = 'visit';
                }
                for (_l = 0, _len3 = visArr.length; _l < _len3; _l++) {
                  vis = visArr[_l];
                  el = graph.ellipses[vis.vector];
                  if (el.state === 12) {
                    added = false;
                    el.unglow();
                    animator.animState = toBecome;
                  }
                }
                if (animator.animState === 'visit' || animator.animState === 'pvisit') {
                  containsObject = function(listToCheck, obj) {
                    var node, _len4, _m;
                    for (_m = 0, _len4 = listToCheck.length; _m < _len4; _m++) {
                      node = listToCheck[_m];
                      if (node === obj) {
                        return true;
                      }
                    }
                    return false;
                  };
                  changed = false;
                  changed2 = false;
                  index = 0;
                  currSelection = animator.runSelection - 1;
                  while (index < animator.pathComb.length && !changed) {
                    if (index !== currSelection) {
                      lastArr = forarr[forarr.length - 1];
                      combArr = animator.pathComb[index];
                      if (containsObject(combArr, errArr[errArr.length - 1].vector) && !containsObject(combArr, errArr[0].vector)) {
                        animator.makeSelection(index + 1);
                        changed = true;
                      } else if (!changed2 && !containsObject(combArr, errArr[0].vector) && containsObject(combArr, lastArr[lastArr.length - 1].vector)) {
                        animator.makeSelection(index + 1);
                        changed2 = true;
                      }
                    }
                    index++;
                  }
                  if (changed || changed2) {
                    forarr = forarr.slice(0, forarr.length - 1);
                    curNew = visited.children.slice(0, visited.children.length);
                    curNew.push(visited);
                    forarr.push(curNew);
                    animator.highlightSelection();
                    removeAndProceed = function() {
                      animator.removeHighlight();
                      return animator.visit(forarr, arr);
                    };
                    return setTimeout(removeAndProceed, animator.retryTime);
                  } else {
                    return animator.visit(forarr, arr);
                  }
                } else {
                  return animator.recoveryVisit(arr, forarr, errArr);
                }
              } catch (error) {

              }
            };
            return setTimeout(timedVisit, this.elAnimTime + this.pathAnimTime - 200);
          }
        }
      } catch (error) {

      }
    },
    visitNode: function(from, to) {
      var el, fill, p, path, paths, _i, _len;
      paths = graph.paths[from.vector];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (p.toVector === to.vector) {
          path = p;
        }
      }
      el = graph.ellipses[to.vector];
      path.animate('#008000', false);
      if (el.state === 0) {
        fill = function() {
          if (animator.animState !== 'stop' && el.state !== 1) {
            return el.fill('#008000', 2);
          }
        };
        return setTimeout(fill, this.pathAnimTime - 200);
      }
    },
    visitReverseNode: function(from, to) {
      var el1, el2, p, path, pathAn, paths, _i, _len;
      paths = graph.paths[to.vector];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (p.toVector === from.vector) {
          path = p;
        }
      }
      el1 = graph.ellipses[from.vector];
      el2 = graph.ellipses[to.vector];
      if (this.animState !== 'stop') {
        el1.fill('#ffffff', 0);
        pathAn = function() {
          return path.animate('#ffffff', true);
        };
        return setTimeout(pathAn, this.elAnimTime);
      }
    },
    sliceAndCheckChildren: function(newArr, arr, visited) {
      newArr = newArr.slice(1);
      if (newArr.length === 1) {
        arr = arr.slice(0, arr.length - 1);
      } else {
        arr[arr.length - 1] = newArr;
      }
      if (visited.children.length > 0) {
        newArr = visited.children.slice(0, visited.children.length);
        newArr[newArr.length] = visited;
        arr[arr.length] = newArr;
        return arr;
      } else {
        return arr;
      }
    },
    checkStatus: function(arr, arr2, errArr) {
      if (this.animState === 'pvisit') {
        this.pausedArray = arr;
        this.pausedReverseArray = arr2;
        eventHandler.pauseFromAnim();
        return false;
      } else if (this.animState === 'pbackVisit') {
        this.pausedArray = arr2;
        this.pausedReverseArray = arr;
        this.errorArray = errArr;
        eventHandler.pauseFromAnim();
        return false;
      } else if (arr.length === 0 || this.animState === 'stop') {
        this.animState = 'stop';
        this.pausedArray = [];
        this.pausedReverseArray = [];
        this.errorArray = [];
        eventHandler.stopAnimation();
        animator.highlightSelection();
        return false;
      } else {
        return true;
      }
    },
    visit: function(arr, revArr) {
      var conc, header, newArr, par, parent, temp, timedVisit, visArr, visited, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
      try {
        if (this.checkStatus(arr, revArr)) {
          newArr = arr[arr.length - 1];
          header = newArr[newArr.length - 1];
          visited = newArr[0];
          visArr = [];
          visArr[0] = visited;
          if (graph.ellipses[visited.vector].state === 2 || !(_ref = visited.vector, __indexOf.call(animator.pathComb[animator.runSelection - 1], _ref) >= 0)) {
            newArr = newArr.slice(1);
            if (newArr.length === 1) {
              arr = arr.slice(0, arr.length - 1);
            } else {
              arr[arr.length - 1] = newArr;
            }
            return this.visit(arr, revArr);
          } else {
            temp = [];
            temp[0] = visited;
            temp[1] = header;
            revArr[revArr.length] = temp;
            this.visitNode(header, visited);
            if (visited.concVectors.length > 0) {
              _ref1 = visited.concVectors;
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                conc = _ref1[_i];
                _ref2 = conc.parents;
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  par = _ref2[_j];
                  this.visitNode(par, conc);
                  visArr[visArr.length] = conc;
                }
              }
            }
            if (visited.parents.length > 1) {
              _ref3 = visited.parents;
              for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                parent = _ref3[_k];
                this.visitNode(parent, visited);
              }
            }
            arr = this.sliceAndCheckChildren(newArr, arr, visited);
            timedVisit = function() {
              var toBecome, vis, _l, _len3;
              try {
                if (animator.animState === 'pvisit') {
                  toBecome = 'pbackVisit';
                } else {
                  toBecome = 'backVisit';
                }
                for (_l = 0, _len3 = visArr.length; _l < _len3; _l++) {
                  vis = visArr[_l];
                  if (graph.ellipses[vis.vector].state === 1) {
                    animator.animState = toBecome;
                  }
                }
                if (animator.animState === 'backVisit' || animator.animState === 'pbackVisit') {
                  return animator.recoveryVisit(revArr, arr, revArr[revArr.length - 1]);
                } else {
                  return animator.visit(arr, revArr);
                }
              } catch (error) {

              }
            };
            return setTimeout(timedVisit, this.elAnimTime + this.pathAnimTime - 200);
          }
        }
      } catch (error) {

      }
    },
    pause: function() {
      if (this.animState === 'visit') {
        return this.animState = 'pvisit';
      } else if (this.animState === 'backVisit') {
        return this.animState = 'pbackVisit';
      }
    },
    resume: function() {
      if (this.animState === 'pvisit') {
        this.animState = 'visit';
        return animator.visit(this.pausedArray, this.pausedReverseArray);
      } else if (this.animState = 'pbackVisit') {
        this.animState = 'backVisit';
        return animator.recoveryVisit(this.pausedReverseArray, this.pausedArray, this.errorArray);
      }
    },
    start: function() {
      var arr, header, initVector, timedVisit;
      if (this.alertRun) {
        eventHandler.disableRunMod();
        graph.reset();
        this.removeHighlight();
        this.animState = 'visit';
        header = graph.topVector;
        eventHandler.disableRunMod();
        initVector = function(header) {
          var arr, initEl, tempArr;
          tempArr = header.children.slice(0, header.children.length);
          tempArr[tempArr.length] = header;
          arr = [];
          arr[0] = tempArr;
          initEl = graph.ellipses[header.vector];
          initEl.fill("#008000", 2);
          return arr;
        };
        arr = initVector(header);
      }
      timedVisit = function() {
        return animator.visit(arr, []);
      };
      return setTimeout(timedVisit, this.elAnimTime);
    }
  };

}).call(this);
