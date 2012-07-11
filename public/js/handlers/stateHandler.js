
window.stateHandler = {
  printError: function(error) {
    if (error.length > 20) {
      if (error.length < 20 * 2) {
        els.stateOut.css('top', '11');
      } else {
        els.stateOut.css('top', '2');
      }
    } else {
      els.stateOut.css('top', '23');
    }
    return els.stateOut.html('<font color="#C5B62A">' + error + '</font>');
  },
  printWarning: function(warning) {
    if (warning.length > 20) {
      if (warning.length < 20 * 2) {
        els.stateOut.css('top', '11');
      } else {
        els.stateOut.css('top', '2');
      }
    } else {
      els.stateOut.css('top', '23');
    }
    return els.stateOut.html('<font color="orange">' + warning + '</font>');
  },
  printSuccess: function(msg) {
    if (msg.length > 20) {
      if (msg.length < 20 * 2) {
        els.stateOut.css('top', '11');
      } else {
        els.stateOut.css('top', '2');
      }
    } else {
      els.stateOut.css('top', '23');
    }
    return els.stateOut.html('<font color="#00ff00">' + msg + '</font>');
  },
  print: function(msg) {
    if (msg.length > 20) {
      if (msg.length < 20 * 2) {
        els.stateOut.css('top', '11');
      } else {
        els.stateOut.css('top', '2');
      }
    } else {
      els.stateOut.css('top', '23');
    }
    return els.stateOut.html(msg);
  }
};
