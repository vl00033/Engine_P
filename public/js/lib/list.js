
window.list = function() {
  return {
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
        if (!found) return false;
      }
      return true;
    },
    get: function(index) {
      var item;
      item = void 0;
      item = this.items[index];
      if (item === null || typeof item === "undefined") return -1;
      return item;
    },
    items: [],
    add: function(obj) {
      if ((this.find(obj)) === -1) return this.items[this.items.length] = obj;
    },
    addSorted: function(obj) {
      var _ref;
      if (this.items === void 0) this.items = [];
      if ((this.find(obj)) === -1) this.items[this.items.length] = obj;
      if (obj < this.items[this.items.length - 1].vector) {
        return _ref = [this.items[this.items.length], this.items[this.items.length - 1]], this.items[this.items.length - 1] = _ref[0], this.items[this.items.length] = _ref[1], _ref;
      }
    },
    addAll: function(objArray) {
      var i, _results;
      i = 0;
      i = 0;
      _results = [];
      while (i < objArray.length) {
        this.items[this.items.length] = objArray[i];
        _results.push(i++);
      }
      return _results;
    },
    insert: function(obj, index) {
      return this.items[index] = obj;
    },
    isEqual: function(a, b) {
      return a === b;
    },
    isEmpty: function() {
      return this.items.length === 0;
    },
    find: function(obj) {
      var i, result;
      result = -1;
      i = 0;
      i = 0;
      while (i < this.items.length) {
        if (this.isEqual(this.items[i], obj)) {
          result = i;
          break;
        }
        i++;
      }
      return result;
    },
    findComparator: function(obj, comparator) {
      var i, result;
      result = -1;
      i = 0;
      while (i < this.items.length) {
        if (this.isEqual(comparator(this.items[i]), obj)) {
          result = i;
          break;
        }
        i++;
      }
      return result;
    },
    clear: function() {
      return this.items = [];
    },
    remove: function(obj) {
      var i, j, tmp;
      tmp = [];
      i = 0;
      j = 0;
      i = 0;
      while (i < this.items.length) {
        if (!this.isEqual(this.items[i], obj)) tmp[j++] = this.items[i];
        i++;
      }
      this.clear();
      return this.items = tmp;
    }
  };
};
