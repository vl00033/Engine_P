var fileCreator;

fileCreator = {
  getVectorXML: function(jsonVector) {
    var node, xmlRepr, _i, _len, _ref;
    xmlRepr = '<?xml version="1.0" encoding="UTF-8"?>\n<vectorFormat>\n';
    _ref = jsonVector.vectorFormat;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      xmlRepr += '\t<vector>' + node + '</vector>\n';
    }
    xmlRepr += '</vectorFormat>';
    return xmlRepr;
  },
  formatJsonTree: function(jsonTree) {
    jsonTree.trim();
    jsonTree = jsonTree.replace('{"r', '{\n"r');
    jsonTree = jsonTree.replace('},"no', '}\n ,\n"no');
    jsonTree = jsonTree.replace('}]}', '}]\n}');
    jsonTree = jsonTree.replace(/\[{/g, '[\n\t{');
    jsonTree = jsonTree.replace(/}\],/g, '}],\n');
    jsonTree = jsonTree.replace('"ro', ' "ro');
    jsonTree = jsonTree.replace('"no', ' "no');
    jsonTree = jsonTree.replace('"le', ' "le');
    jsonTree = jsonTree.replace(/,{"i/g, ',\n\t{"i');
    return jsonTree;
  },
  formatJsonVector: function(jsonVector) {
    jsonVector.trim();
    jsonVector = jsonVector.replace('{"v', '{\n "v');
    jsonVector = jsonVector.replace('["', '[\n\t"');
    jsonVector = jsonVector.replace('"]}', '"\n\t]\n}');
    jsonVector = jsonVector.replace(/,"/g, ',\n\t"');
    return jsonVector;
  },
  getTreeXML: function(jsonTree) {
    var child, leaf, node, xmlRepr, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
    xmlRepr = '<?xml version="1.0" encoding="UTF-8"?>\n<transactionTree>\n';
    xmlRepr += '\t<root>\n\t\t<id>' + jsonTree.root.id + '</id>\n\t</root>\n\n';
    xmlRepr += '\t<nodes>\n';
    _ref = jsonTree.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      xmlRepr += '\t\t<node>\n';
      xmlRepr += '\t\t\t<id>' + node.id + '</id>\n';
      xmlRepr += '\t\t\t<type>' + node.type + '</type>\n';
      xmlRepr += '\t\t\t<children>\n';
      _ref2 = node.children;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        child = _ref2[_j];
        xmlRepr += '\t\t\t\t<id>' + child + '</id>\n';
      }
      xmlRepr += '\t\t\t</children>\n';
      xmlRepr += '\t\t</node>\n';
    }
    xmlRepr += '\t</nodes>\n';
    xmlRepr += '\t<leaves>\n';
    _ref3 = jsonTree.leaves;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      leaf = _ref3[_k];
      xmlRepr += '\t\t<leaf>\n';
      xmlRepr += '\t\t\t<id>' + leaf.id + '</id>\n';
      xmlRepr += '\t\t\t<participant>' + leaf.participant + '</participant>\n';
      xmlRepr += '\t\t\t<message>' + leaf.message + '</message>\n';
      xmlRepr += '\t\t</leaf>\n';
    }
    xmlRepr += '\t</leaves>\n';
    xmlRepr += '</transactionTree>';
    return xmlRepr;
  }
};

module.exports = fileCreator;
