(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.getVFDetails = function(vectorFormat) {
    var MSGTYPE, allMessages, asyncMessages, convertToOrderedList, createVectors, maxLevel, maxNodes, num_participants, num_vectors, orderVectors, orderedList, pat, pat2, setMessageType, setType, syncMessages, vectorsList;
    console.log('VectorFormat\n' + vectorFormat);
    String.prototype.endsWith = function(suffix) {
      return this[this.length - 1] === suffix;
    };
    num_vectors = vectorFormat.length;
    console.log('Set num_vectors');
    maxNodes = 0;
    maxLevel = 0;
    syncMessages = new list();
    allMessages = new list();
    asyncMessages = new list();
    vectorsList = new list();
    orderedList = new list();
    num_participants = 0;
    setType = MSGTYPE;
    MSGTYPE = {
      ASYNC: {
        name: "Asynchronous",
        value: 0
      },
      SYNC: {
        name: "Synchronous",
        value: 1
      },
      SYNC_ASYNC: {
        name: "Synchronous and Asynchronous",
        value: 2
      }
    };
    pat = new RegExp("m\\d+[!?]?", "g");
    pat.compile(pat);
    pat2 = new RegExp("m\\d+$", "g");
    pat2.compile(pat2);
    setMessageType = function() {
      var match, matches, msg, node, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _results;
      for (_i = 0, _len = vectorFormat.length; _i < _len; _i++) {
        node = vectorFormat[_i];
        matches = node.match(pat);
        if (matches !== null) {
          for (_j = 0, _len2 = matches.length; _j < _len2; _j++) {
            match = matches[_j];
            if (match.endsWith('!')) {
              if (_ref = match.replace('!', '?'), __indexOf.call(matches, _ref) >= 0) {
                allMessages.add(match.replace('!', ''));
              } else {
                allMessages.add(match.replace('!', ''));
                asyncMessages.add(match.replace('!', ''));
              }
            } else if (match.replace('!', '').match(pat2)) {
              asyncMessages.add(match);
            }
          }
        }
      }
      if (allMessages.isEmpty()) {
        return setType = MSGTYPE.ASYNC;
      } else if (asyncMessages.isEmpty()) {
        return setType = MSGTYPE.SYNC;
      } else {
        setType = MSGTYPE.SYNC_ASYNC;
        syncMessages = allMessages;
        _ref2 = asyncMessages.items;
        _results = [];
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          msg = _ref2[_k];
          _results.push(syncMessages.remove(msg));
        }
        return _results;
      }
    };
    createVectors = function() {
      var node, v, _i, _len;
      for (_i = 0, _len = vectorFormat.length; _i < _len; _i++) {
        node = vectorFormat[_i];
        v = new CalcVector.create(node, asyncMessages);
        vectorsList.add(v);
      }
      return num_participants = v.num_participants;
    };
    orderVectors = function() {
      var arList, array, i, vector, _i, _len, _ref, _results;
      arList = new list();
      i = 0;
      _ref = vectorsList.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vector = _ref[_i];
        if ((array = orderedList.get(vector.LEVEL)) !== -1) {
          arList.items = array;
          arList.add(i);
          if (maxNodes < arList.items.length) {
            maxNodes = arList.items.length;
            maxLevel = vector.LEVEL;
          }
          orderedList.insert(arList.items, vector.LEVEL);
        } else {
          arList = new list();
          arList.add(i);
          orderedList.insert(arList.items, vector.LEVEL);
        }
        _results.push(i++);
      }
      return _results;
    };
    convertToOrderedList = function() {
      setMessageType();
      console.log('Set Message Type');
      createVectors();
      console.log('Created Vectos');
      orderVectors();
      console.log('Ordered Vectors');
      return {
        "num_vectors": num_vectors,
        "orderedList": orderedList.items,
        "num_participants": num_participants,
        "setType": setType,
        "vectorsList": vectorsList.items,
        "maxLevel": maxLevel
      };
    };
    return convertToOrderedList();
  };

}).call(this);
