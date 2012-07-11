
window.treeToVector = function(tree) {
  var convertToVF, countParticipants, createArray, headers, indexArray, leveled, numPart, vectorFormat;
  console.log('TreeToVector:' + tree);
  indexArray = [];
  countParticipants = function() {
    var contains, el, i, leaf, newArr, _i, _j, _len, _len2, _ref;
    contains = function(arr, obj) {
      var el, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
        if (el === obj) return true;
      }
      return false;
    };
    newArr = [];
    _ref = tree.leaves;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      leaf = _ref[_i];
      if (!contains(newArr, leaf.participant)) {
        if (parseInt(newArr[newArr.length - 1]) < parseInt(leaf.participant)) {
          newArr.push(leaf.participant);
        } else {
          newArr.unshift(leaf.participant);
        }
      }
    }
    i = 0;
    for (_j = 0, _len2 = newArr.length; _j < _len2; _j++) {
      el = newArr[_j];
      indexArray[el] = i;
      i++;
    }
    return newArr.length;
  };
  convertToVF = function() {
    var first, getLeaves, getNodes, getVector, i, mergeMsgs, vectorFormat;
    vectorFormat = [];
    i = 0;
    first = [];
    while (i < numPart) {
      first[i] = 'L';
      i++;
    }
    vectorFormat.push(first);
    getNodes = function(arr) {
      var el, temp, _i, _len;
      temp = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
        if (el.id.charAt(0) === 'n') temp.push(el);
      }
      return temp;
    };
    getLeaves = function(arr) {
      var el, temp, _i, _len;
      temp = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
        if (el.id.charAt(0) === 'l') temp.push(el);
      }
      return temp;
    };
    mergeMsgs = function(msgs) {
      var diff, difference, j, msg1, newMsg;
      newMsg = msgs[0].slice(0, msgs[0].length);
      i = 1;
      difference = function(list1, list2) {
        var diff, el1, el2, j, pat, _i, _len;
        pat = new RegExp("m\\d+", "g");
        pat.compile(pat);
        list1 = list1.match(pat);
        list2 = list2.match(pat);
        diff = [];
        for (_i = 0, _len = list2.length; _i < _len; _i++) {
          el2 = list2[_i];
          j = 0;
          while (j < list1.length) {
            el1 = list1[j];
            if (el1 === el2) {
              j = list1.length;
            } else {
              j++;
              if (j === list1.length) diff.push(el2);
            }
          }
        }
        return diff;
      };
      while (i < msgs.length) {
        msg1 = msgs[i];
        j = 0;
        while (j < msg1.length) {
          if (msg1[j] !== 'L') {
            if (newMsg[j] === 'L') {
              newMsg[j] = msg1[j];
            } else if ((diff = difference(newMsg[j], msg1[j])).length !== 0) {
              newMsg[j] += diff;
            }
          }
          j++;
        }
        i++;
      }
      return newMsg;
    };
    getVector = function(node, headMsg) {
      var children, index, leaf, leaves, msg, msgs, msgs1, msgs2, nodes, temp, _i, _j, _len, _len2;
      children = node.children;
      leaves = getLeaves(children);
      nodes = getNodes(children);
      msgs = [];
      for (_i = 0, _len = leaves.length; _i < _len; _i++) {
        leaf = leaves[_i];
        msg = headMsg.slice(0, headMsg.length);
        index = indexArray[leaf.participant];
        if (msg[index] === 'L') {
          msg[index] = leaf.message;
        } else {
          msg[index] += leaf.message;
        }
        vectorFormat.push(msg);
        msgs.push(msg);
        if (node.type === 'seq') headMsg = msg;
      }
      if (node.type === 'par' && msgs.length > 0) {
        temp = mergeMsgs(msgs);
        msgs = [];
        msgs[0] = temp;
        vectorFormat.push(msgs[0]);
      }
      if (nodes.length > 1 && node.type === 'alt') {
        getVector(nodes[0], headMsg);
        getVector(nodes[1], headMsg);
      } else if (nodes.length > 1 && node.type === 'par') {
        msgs1 = getVector(nodes[0], headMsg);
        msgs2 = getVector(nodes[1], headMsg);
        msgs = [];
        msgs[0] = mergeMsgs(msgs1.concat(msgs2));
        vectorFormat.push(msgs[0]);
      } else if (nodes.length > 1) {
        msgs = getVector(nodes[0], headMsg);
        for (_j = 0, _len2 = msgs.length; _j < _len2; _j++) {
          msg = msgs[_j];
          getVector(nodes[1], msg);
        }
      } else if (nodes.length === 1) {
        getVector(nodes[0], headMsg);
      }
      if (node.type === 'alt' || node.type === 'par') {
        return msgs;
      } else {
        return [headMsg];
      }
    };
    getVector(tree.root, first);
    return vectorFormat;
  };
  createArray = function(inputVectors) {
    var i, msg, str, vectorFormat, _i, _len;
    vectorFormat = [];
    for (_i = 0, _len = inputVectors.length; _i < _len; _i++) {
      msg = inputVectors[_i];
      i = 0;
      str = '(';
      while (i < msg.length) {
        if (i === msg.length - 1) {
          str += msg[i] + ')';
        } else {
          str += msg[i] + ', ';
        }
        i++;
      }
      vectorFormat.push(str);
    }
    return vectorFormat;
  };
  console.log('TreeToVector:Added children');
  numPart = countParticipants();
  vectorFormat = convertToVF();
  console.log('TreeToVector:Created vectorFormat');
  headers = [tree.root];
  leveled = [];
  leveled[0] = [tree.root];
  return createArray(vectorFormat);
};
