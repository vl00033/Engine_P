(function() {

  window.treeToLevels = function(tree) {
    var addChildren, addToLevels, headers, leveled;
    addChildren = function() {
      var child, contains, elements, findLeaf, findNode, i, leaf, messages, newNode, node, _i, _len, _ref, _results;
      elements = [];
      messages = [];
      contains = function(arr, el, type) {
        var curr, _i, _len;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          curr = arr[_i];
          if (type === 1) {
            if (curr.id === el.id) {
              return true;
            }
          } else {
            if (curr.message === el.message) {
              return true;
            }
          }
        }
        return false;
      };
      findLeaf = function(id) {
        var leaf, _i, _len, _ref;
        _ref = tree.leaves;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          leaf = _ref[_i];
          if (id === leaf.id) {
            return leaf;
          }
        }
        throw {
          error: "Leaf " + id + " not Found\nPlease check file"
        };
      };
      findNode = function(id) {
        var node, _i, _len, _ref;
        _ref = tree.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          if (id === node.id) {
            return node;
          }
        }
        throw {
          error: "Node " + id + " not Found\nPlease check file"
        };
      };
      _ref = tree.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        i = 0;
        if (tree.root.id === node.id) {
          tree.root = node;
        }
        _results.push((function() {
          var _results1;
          _results1 = [];
          while (i < node.children.length) {
            child = node.children.pop();
            if (child.charAt(0) === 'n') {
              newNode = findNode(child);
              if (contains(elements, newNode, 1)) {
                throw {
                  error: "Node " + newNode.id + " repeatedly called\nPlease check file"
                };
              }
              elements.push(newNode);
              node.children.unshift(newNode);
            } else {
              leaf = findLeaf(child);
              if (contains(elements, leaf, 1)) {
                throw {
                  error: "Leaf " + leaf.id + " repeatedly called\nPlease check file"
                };
              }
              if (contains(messages, leaf, 2)) {
                throw {
                  error: "Message " + leaf.message + " repeatedly called\nPlease check file"
                };
              }
              elements.push(leaf);
              messages.push(leaf);
              node.children.unshift(leaf);
            }
            _results1.push(i++);
          }
          return _results1;
        })());
      }
      return _results;
    };
    addToLevels = function(headers, leveled) {
      var child, children, getNodes, header, newHeaders, node, nodes, tempArr, _i, _j, _k, _len, _len1, _len2;
      getNodes = function(arr) {
        var el, temp, _i, _len;
        temp = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          el = arr[_i];
          if (el.id.charAt(0) === 'n') {
            temp.push(el);
          }
        }
        return temp;
      };
      tempArr = [];
      newHeaders = [];
      for (_i = 0, _len = headers.length; _i < _len; _i++) {
        header = headers[_i];
        children = header.children;
        for (_j = 0, _len1 = children.length; _j < _len1; _j++) {
          child = children[_j];
          tempArr.push(child);
        }
        nodes = getNodes(header.children);
        for (_k = 0, _len2 = nodes.length; _k < _len2; _k++) {
          node = nodes[_k];
          newHeaders.push(node);
        }
      }
      leveled.push(tempArr);
      if (newHeaders.length > 0) {
        return addToLevels(newHeaders, leveled);
      }
    };
    addChildren();
    headers = [tree.root];
    leveled = [];
    leveled[0] = [tree.root];
    addToLevels(headers, leveled);
    return leveled;
  };

}).call(this);
