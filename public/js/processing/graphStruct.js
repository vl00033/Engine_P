(function() {

  String.prototype.endsWith = function(suffix) {
    return this[this.length - 1] === suffix;
  };

  window.graphStruct = {
    containsAll: function(inArray, checkedArray) {
      var found, i, item, item2, _i, _len;
      i = 0;
      for (_i = 0, _len = checkedArray.length; _i < _len; _i++) {
        item = checkedArray[_i];
        found = false;
        while (!found && i < inArray.length) {
          item2 = inArray[i];
          i++;
          if (item2 === item) {
            found = true;
            i = 0;
          }
        }
        if (!found) {
          return false;
        }
      }
      return true;
    },
    getRegistered: function(msgs) {
      var msg, regMsgs, _i, _len;
      regMsgs = new list();
      for (_i = 0, _len = msgs.length; _i < _len; _i++) {
        msg = msgs[_i];
        if (msg.endsWith('!?')) {
          regMsgs.add(msg);
        }
      }
      return regMsgs.items;
    },
    getUnregistered: function(msgs) {
      var msg, unrMsgs, _i, _len;
      unrMsgs = new list();
      for (_i = 0, _len = msgs.length; _i < _len; _i++) {
        msg = msgs[_i];
        if (!msg.endsWith('!?') && (msg.endsWith('?') || msg.endsWith('!'))) {
          unrMsgs.add(msg);
        }
      }
      return unrMsgs.items;
    },
    createVectorWithParent: function(vector, calcVector, parent) {
      var msgs;
      msgs = calcVector.messages;
      return {
        parents: [parent],
        vector: vector,
        registeredMsgs: this.getRegistered(msgs),
        unregisteredMsgs: this.getUnregistered(msgs),
        subVectors: calcVector.subVectors,
        concVectors: [],
        children: [],
        sharing: [],
        sharingWith: [],
        alt: false
      };
    },
    addChild: function(vector, child) {
      var vectorList;
      vectorList = new list();
      vectorList.items = vector.children;
      vectorList.addSorted(child);
      return vector.children = vectorList.items;
    },
    addParent: function(vector, parent) {
      var vectorList;
      vectorList = new list();
      vectorList.items = vector.parents;
      vectorList.addSorted(parent);
      return vector.parents = vectorList.items;
    },
    sort: function(arr, comparator) {
      var i, j, _ref, _results;
      i = 0;
      _results = [];
      while (i < arr.length - 1) {
        j = i + 1;
        while (j < arr.length) {
          if (comparator(arr[i]) > comparator(arr[j])) {
            _ref = [arr[j], arr[i]], arr[i] = _ref[0], arr[j] = _ref[1];
          }
          j++;
        }
        _results.push(i++);
      }
      return _results;
    },
    sortBasedOnParents: function(levelList) {
      var i, parentComparator, vectorComparator, vectors, _i, _len, _ref;
      vectorComparator = function(vect) {
        return vect.vector;
      };
      parentComparator = function(vect) {
        var par, parents, str, _i, _len;
        str = '';
        parents = vect.parents;
        if (parents.length === 1) {
          str += parents[0].vector.toString() + '0';
        } else {
          for (_i = 0, _len = parents.length; _i < _len; _i++) {
            par = parents[_i];
            str += par.vector.toString();
          }
        }
        return parseInt(str);
      };
      i = 2;
      _ref = levelList.slice(2);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vectors = _ref[_i];
        this.sort(vectors, parentComparator);
        i++;
      }
      return levelList;
    },
    addVectorsToLevels: function(structure, vectorFormat) {
      var checkForAlt, concatLists, index_1, index_2, level, levelList, levelStructure, prevVector, strVector1, strVector2, vector1, vector2, vectorComparator, _i, _len;
      vectorComparator = function(vect) {
        return vect.vector;
      };
      levelStructure = new list();
      levelList = new list();
      checkForAlt = function(vec1, vec2) {
        var checkConcAlt, contains;
        contains = function(vec, list) {
          var vec2, _i, _len;
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            vec2 = list[_i];
            if (vec === vec2.vector) {
              return true;
            }
          }
          return false;
        };
        checkConcAlt = function(vec) {
          var conc, _i, _len, _ref;
          _ref = vec.concVectors;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            conc = _ref[_i];
            if (conc.alt) {
              return true;
            }
          }
          return false;
        };
        if (vec1.parents[0].vector === vec2.parents[0].vector && !contains(vec2.vector, vec1.concVectors)) {
          if (!checkConcAlt(vec1)) {
            vec1.alt = true;
          }
          if (!checkConcAlt(vec2)) {
            return vec2.alt = true;
          }
        }
      };
      prevVector = null;
      concatLists = function(vector1, vector2) {
        var checkLists, concShared, concurrent, list1, list2, sha1, _i, _len, _ref, _results;
        list1 = vector1.concVectors;
        list2 = vector2.concVectors;
        if (list1.length > 1 || list2.length > 1) {
          concurrent = false;
          checkLists = function(list1, list2) {
            var found, vec1, vec2, _i, _j, _len, _len1;
            found = false;
            for (_i = 0, _len = list2.length; _i < _len; _i++) {
              vec2 = list2[_i];
              for (_j = 0, _len1 = list1.length; _j < _len1; _j++) {
                vec1 = list1[_j];
                if (!concurrent && vec1.vector === vector2.vector) {
                  concurrent = true;
                }
                if (vec2.vector === vec1.vector) {
                  found = true;
                }
              }
              if (!concurrent) {
                return false;
              }
              if (!found && vector1.vector !== vec2.vector) {
                list1.push(vec2);
              }
              found = false;
            }
            return true;
          };
          concurrent = checkLists(list1, list2);
          checkLists(list2, list1);
          if (concurrent) {
            concShared = function(sharing, sharingList) {
              var sha, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = sharingList.length; _i < _len; _i++) {
                sha = sharingList[_i];
                if (sha.vector !== sharing.vector) {
                  sharing.concVectors.push(sha);
                  _results.push(sha.concVectors.push(sharing));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            };
            _ref = vector1.sharing;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sha1 = _ref[_i];
              _results.push(concShared(sha1, vector2.sharing));
            }
            return _results;
          }
        }
      };
      for (_i = 0, _len = vectorFormat.length; _i < _len; _i++) {
        level = vectorFormat[_i];
        index_1 = 0;
        if (level.length === 1) {
          vector1 = level[index_1];
          strVector1 = structure.get(vector1);
          levelList.add(strVector1);
        } else {
          while (index_1 < level.length - 1) {
            index_2 = index_1 + 1;
            vector1 = level[index_1];
            strVector1 = structure.get(vector1);
            levelList.add(strVector1);
            while (index_2 < level.length) {
              vector2 = level[index_2];
              strVector2 = structure.get(vector2);
              if (index_2 === level.length - 1 && index_1 === level.length - 2) {
                levelList.add(strVector2);
              }
              if (strVector1 !== null && strVector1.parents.length === 1) {
                concatLists(strVector1, strVector2);
                checkForAlt(strVector1, strVector2);
              }
              index_2++;
            }
            index_1++;
          }
        }
        levelStructure.add(levelList.items);
        levelList.clear();
      }
      this.sortBasedOnParents(levelStructure.items);
      return levelStructure.items;
    },
    checkParentsMatch: function(vec1, vec2) {
      var findMatch, vec11, vec22, _i, _j, _len, _len1;
      findMatch = function(vec1, vec2) {
        var list1, list2, par1, par2, parents1, parents2, _i, _j, _len, _len1;
        parents1 = vec1.parents;
        parents2 = vec2.parents;
        list1 = new list();
        list2 = new list();
        list1.items = vec1.concVectors;
        list2.items = vec2.concVectors;
        list1.add(vec2);
        list2.add(vec1);
        for (_i = 0, _len = parents1.length; _i < _len; _i++) {
          par1 = parents1[_i];
          for (_j = 0, _len1 = parents2.length; _j < _len1; _j++) {
            par2 = parents2[_j];
            if (par1.vector === par2.vector) {
              return true;
            }
          }
        }
        return false;
      };
      if (vec1.length !== void 0) {
        for (_i = 0, _len = vec1.length; _i < _len; _i++) {
          vec11 = vec1[_i];
          for (_j = 0, _len1 = vec2.length; _j < _len1; _j++) {
            vec22 = vec2[_j];
            if (findMatch(vec11, vec22)) {
              return true;
            }
          }
        }
      } else {
        if (findMatch(vec1, vec2)) {
          return true;
        }
      }
      return false;
    },
    checkForConc: function(structure) {
      var match, newVec, newVec2, shared, sharing, vector, _i, _len, _ref, _results;
      _ref = structure.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vector = _ref[_i];
        if ((sharing = vector.sharingWith).length > 0) {
          _results.push((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (_j = 0, _len1 = sharing.length; _j < _len1; _j++) {
              shared = sharing[_j];
              match = false;
              newVec = vector;
              newVec2 = shared;
              match = this.checkParentsMatch(newVec, newVec2);
              _results1.push((function() {
                var _results2;
                _results2 = [];
                while (!match) {
                  newVec = newVec.parents;
                  newVec2 = newVec2.parents;
                  _results2.push(match = this.checkParentsMatch(newVec, newVec2));
                }
                return _results2;
              }).call(this));
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    extractStructure: function(vectorsList, vectorFormat, type) {
      var calcVector1, calcVector2, cnt, exit, i, index2, innerList1, innerList2, levelStructure, msgs1, msgs2, s, shared, sharing, sharingVector1, sharingVector2, sharingWith, sharingWith2, size, structure, tempArray, tempList, topPar, topParent, vector, vector1, vector2, vectorComparator, vectorPar, _i, _j, _k, _len, _len1;
      console.log('Generating graph structure');
      vectorComparator = function(obj) {
        return obj.vector;
      };
      structure = new list();
      tempArray = [];
      tempList = new list();
      tempList.addAll(vectorFormat[1]);
      topParent = vectorFormat[0][0];
      topPar = this.createVectorWithParent(topParent, vectorsList[topParent]);
      topPar.parents = [];
      structure.insert(topPar, topParent);
      size = vectorFormat.length - 2;
      for (i = _i = 0; 0 <= size ? _i <= size : _i >= size; i = 0 <= size ? ++_i : --_i) {
        innerList1 = vectorFormat[i];
        innerList2 = vectorFormat[i + 1];
        for (_j = 0, _len = innerList1.length; _j < _len; _j++) {
          vector1 = innerList1[_j];
          calcVector1 = vectorsList[vector1];
          msgs1 = calcVector1.messages;
          for (_k = 0, _len1 = innerList2.length; _k < _len1; _k++) {
            vector2 = innerList2[_k];
            calcVector2 = vectorsList[vector2];
            msgs2 = calcVector2.messages;
            if (this.containsAll(msgs2, msgs1) && msgs2.length === (msgs1.length + 1)) {
              cnt = tempArray[vector2];
              if (cnt === void 0 || cnt === null) {
                tempArray[vector2] = -1;
              }
              vectorPar = structure.get(vector1);
              if ((vector = structure.get(vector2)) !== -1) {
                this.addParent(vector, vectorPar);
                this.addChild(vectorPar, vector);
              } else {
                vector = this.createVectorWithParent(vector2, calcVector2, vectorPar);
                structure.insert(vector, vector2);
                this.addChild(vectorPar, vector);
              }
              if ((index2 = tempArray[vector2]) !== -1) {
                sharingVector1 = structure.get(vector1);
                sharingVector2 = structure.get(index2);
                sharing = sharingVector1.sharing;
                sharing[sharing.length] = vector;
                sharingWith = sharingVector1.sharingWith;
                sharingWith2 = sharingVector2.sharingWith;
                if (sharingWith2.length > 0) {
                  sharingWith = sharingWith2;
                }
                sharingWith[sharingWith.length] = sharingVector2;
                sharing = sharingVector2.sharing;
                if (sharing.length === 0) {
                  sharing[0] = vector;
                } else {
                  s = 0;
                  exit = false;
                  while (s < sharing.length && !exit) {
                    shared = sharing[s];
                    if (shared.vector === vector.vector) {
                      exit = true;
                    } else {
                      s++;
                    }
                  }
                  if (s === sharing.length) {
                    sharing[sharing.length] = vector;
                  }
                }
                sharingWith2[sharingWith2.length] = sharingVector1;
              } else {
                tempArray[vector2] = vector1;
              }
            }
          }
        }
      }
      this.checkForConc(structure);
      levelStructure = this.addVectorsToLevels(structure, vectorFormat);
      console.log('Returning structure');
      return levelStructure;
    }
  };

}).call(this);
