
window.printer = {
  printResponse: function(data) {
    var curVec, i, j, jsonVector, sortedVectors, sub, subVectors, tempStr, vec, vector, _i, _j, _len, _len2, _ref;
    els.vectors.html(data.num_vectors);
    if (data.setType.value === 0) {
      els.type.css('top', '15');
      els.type.html(data.setType.name);
    } else if (data.setType.value === 1) {
      els.type.css('top', '15');
      els.type.html(data.setType.name);
    } else {
      els.type.css('top', '3');
      els.type.html(data.setType.name);
    }
    els.participants.html(data.num_participants);
    sortedVectors = '';
    i = 0;
    jsonVector = {
      vectorFormat: []
    };
    _ref = data.orderedList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vector = _ref[_i];
      sortedVectors += 'Level ' + i + '</br>';
      for (_j = 0, _len2 = vector.length; _j < _len2; _j++) {
        vec = vector[_j];
        subVectors = data.vectorsList[vec].subVectors;
        sortedVectors += '&nbsp&nbsp&nbsp(';
        j = 0;
        curVec = '(';
        while (j < subVectors.length) {
          sub = subVectors[j];
          if (j === subVectors.length - 1) {
            sortedVectors += sub + ')';
            curVec += sub + ')';
          } else {
            if (sub.length > 1) {
              tempStr = '' + sub;
              tempStr = tempStr.replace(/,/g, '');
            } else {
              tempStr = '' + sub;
            }
            sortedVectors += tempStr + ' ,';
            curVec += tempStr + ' ,';
          }
          j++;
        }
        jsonVector.vectorFormat.push(curVec);
        sortedVectors += '</br>';
      }
      i++;
    }
    client.vectorFormatJSON = JSON.stringify(jsonVector);
    return els.vectorbox.html(sortedVectors);
  },
  printStructuredTree: function(json) {
    var child, children, getLeaf, getNode, leaf, leaves, node, nodes, treeStructured, _i, _j, _len, _len2;
    if ((nodes = json.nodes) !== null && nodes !== void 0 && (leaves = json.leaves) !== null && leaves !== void 0) {
      getLeaf = function(id) {
        var leaf, _i, _len;
        for (_i = 0, _len = leaves.length; _i < _len; _i++) {
          leaf = leaves[_i];
          if (leaf.id === id) return leaf;
        }
        return -1;
      };
      getNode = function(id) {
        var node, _i, _len;
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          if (node.id === id) return node;
        }
        return -1;
      };
      treeStructured = '';
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        treeStructured += 'Node:' + node.id + ' ' + node.type + '</br>';
        children = node.children;
        for (_j = 0, _len2 = children.length; _j < _len2; _j++) {
          child = children[_j];
          if (child.id.charAt(0) === 'l') {
            leaf = getLeaf(child.id);
            treeStructured += '&nbsp&nbsp&nbspLeaf:&nbsp&nbspp' + leaf.participant + ' ' + leaf.message + '</br>';
          } else {
            node = getNode(child.id);
            treeStructured += '&nbsp&nbsp&nbspNode:&nbsp' + node.id + ' ' + node.type + '</br>';
          }
        }
      }
      return els.treebox.html(treeStructured);
    } else {
      throw 'Invalid File';
    }
  }
};
