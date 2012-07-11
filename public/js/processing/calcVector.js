var CalcVector;

CalcVector = {
  create: function(node, asyncMessages) {
    var LEVEL, event, eventList, events, getEvents, messages, num_participants, pat, pat2, setMessages, subVectors, _i, _len;
    pat = new RegExp("m\\d+[!?]?", "g");
    pat.compile(pat);
    pat2 = new RegExp("m\\d+$", "g");
    pat2.compile(pat2);
    subVectors = new list();
    messages = new list();
    setMessages = function() {
      var allEvents, event, vec, vector, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _results;
      allEvents = new list();
      _ref = subVectors.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vector = _ref[_i];
        for (_j = 0, _len2 = vector.length; _j < _len2; _j++) {
          vec = vector[_j];
          allEvents.add(vec);
        }
      }
      _ref2 = allEvents.items;
      _results = [];
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        event = _ref2[_k];
        if (event.endsWith('!')) {
          if (allEvents.find(event.replace('!', '?')) !== -1 && asyncMessages.find(event.replace('!', '')) !== -1) {
            messages.add(event);
            messages.add(event.replace('!', '?'));
          } else if (allEvents.find(event.replace('!', '?')) !== -1) {
            messages.add(event.replace('!', '!?'));
          } else {
            messages.add(event);
          }
        }
        if (event.match(pat2)) {
          _results.push(messages.add(event));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    getEvents = function(event) {
      var eventList, matches;
      eventList = new list();
      if (event === "L") {
        eventList.add("L");
      } else {
        matches = event.match(pat);
        eventList.addAll(matches);
      }
      return eventList;
    };
    node = node.replace(new RegExp("[()\\s]", 'g'), "");
    events = node.split(",");
    num_participants = events.length;
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      eventList = new list();
      eventList = getEvents(event);
      subVectors.add(eventList.items);
    }
    setMessages();
    LEVEL = messages.items.length;
    return {
      LEVEL: LEVEL,
      messages: messages.items,
      subVectors: subVectors.items,
      num_participants: num_participants
    };
  }
};
