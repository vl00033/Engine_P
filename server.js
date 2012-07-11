(function() {
  var ajaxCnt, app, express, formCnt, fs, port, sampleCnt;

  express = require('express');

  fs = require('fs');

  ajaxCnt = 1;

  formCnt = 1;

  sampleCnt = 1;

  app = express.createServer(express.bodyParser());

  app.use(express.static(__dirname + '/public'));

  app.use(express.errorHandler());

  app.post('/requestSample', function(req, res) {
    var id, jsonOut, parsedJson, sample;
    sample = JSON.stringify(req.body);
    console.log("Received for sample:" + sample);
    parsedJson = JSON.parse(sample);
    id = parsedJson.id;
    console.log("Received Sample ID:" + id);
    console.log("Generating Sample");
    fs = require('fs');
    jsonOut = [];
    return fs.readFile('./sample/sample' + id + '.json', 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
        jsonOut = JSON.stringify({
          error: 'Server error'
        });
        res.send(jsonOut);
        return console.log("Send " + jsonOut);
      } else {
        res.send(data);
        return console.log("Send " + data);
      }
    });
  });

  app.get('/sampleJSON', function(req, res) {
    return res.download('sample/guide/treeSample.json');
  });

  app.get('/guideJson', function(req, res) {
    return res.download('sample/guide/guideJson.txt');
  });

  app.get('/ttSampleXML', function(req, res) {
    return res.download('sample/guide/treeSample.xml');
  });

  app.get('/ttXMLSchema', function(req, res) {
    return res.download('sample/guide/treeSchema.xsd');
  });

  app.get('/vfXMLSchema', function(req, res) {
    return res.download('sample/guide/vectorSchema.xsd');
  });

  app.get('/vfSampleXML', function(req, res) {
    return res.download('sample/guide/vectorSample.xml');
  });

  app.get('/vfSampleJSON', function(req, res) {
    return res.download('sample/guide/vectorSample.json');
  });

  app.error(function(err, req, res, next) {
    var jsonOut;
    console.log(err);
    jsonOut = {
      error: 'Server error, please try again'
    };
    return res.redirect('home');
  });

  app.post('/exportGraph', function(req, res) {
    var content, fileCreator, filename, jsonOut, newDate, proceed1, proceed2, timeStamp, url;
    fileCreator = require('./serverJS/fileCreator.js');
    try {
      content = req.body.exportFile;
      content = content.replace(/^data:image\/png;base64,/, "");
      content = new Buffer(content, 'base64');
      console.log('Automaton graph requested ...');
      filename = 'autoGraph.png';
      newDate = new Date;
      timeStamp = newDate.getTime();
      url = './clientFiles/' + timeStamp;
      console.log("Creating directory");
      fs.mkdir(url, 0755);
      proceed1 = function() {
        return fs.writeFile(url + '/' + filename, content, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("The file " + timeStamp + " was saved!");
          }
          return setTimeout(proceed2, 500);
        });
      };
      setTimeout(proceed1, 500);
      return proceed2 = function() {
        var deleteDir, deleteFile;
        res.download(url + '/' + filename);
        deleteFile = function() {
          fs.unlink(url + '/' + filename);
          return console.log("The file in" + timeStamp + " was deleted!");
        };
        deleteDir = function() {
          fs.rmdir(url);
          return console.log("The directory " + timeStamp + " was deleted!");
        };
        setTimeout(deleteFile, 5000);
        return setTimeout(deleteDir, 6000);
      };
    } catch (error) {
      console.log(error);
      jsonOut = {
        error: 'Server error, please try again'
      };
      return res.redirect('home');
    }
  });

  app.post('/downloadVector', function(req, res) {
    var content, fileCreator, filename, jsonOut, newDate, proceed1, proceed2, timeStamp, type, url;
    fileCreator = require('./serverJS/fileCreator.js');
    try {
      type = req.body.exportType;
      content = req.body.exportFile;
      if (type === 'json') {
        console.log('Formatting vectorFormat ...');
        filename = 'vectorFormat.json';
        content = fileCreator.formatJsonVector(content);
      } else {
        console.log('Generating XML vectorFormat ...');
        filename = 'vectorFormat.xml';
        content = fileCreator.getVectorXML(JSON.parse(content));
      }
      newDate = new Date;
      timeStamp = newDate.getTime();
      url = './clientFiles/' + timeStamp;
      console.log("Creating directory");
      fs.mkdir(url, 0755);
      proceed1 = function() {
        return fs.writeFile(url + '/' + filename, content, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("The file " + timeStamp + " was saved!");
          }
          return setTimeout(proceed2, 500);
        });
      };
      setTimeout(proceed1, 500);
      return proceed2 = function() {
        var deleteDir, deleteFile;
        res.download(url + '/' + filename);
        deleteFile = function() {
          fs.unlink(url + '/' + filename);
          return console.log("The file in" + timeStamp + " was deleted!");
        };
        deleteDir = function() {
          fs.rmdir(url);
          return console.log("The directory " + timeStamp + " was deleted!");
        };
        setTimeout(deleteFile, 5000);
        return setTimeout(deleteDir, 6000);
      };
    } catch (error) {
      console.log(error);
      jsonOut = {
        error: 'Server error, please try again'
      };
      return res.redirect('home');
    }
  });

  app.post('/downloadTree', function(req, res) {
    var content, fileCreator, filename, newDate, proceed1, proceed2, timeStamp, type, url;
    fileCreator = require('./serverJS/fileCreator.js');
    type = req.body.exportType;
    content = req.body.exportFile;
    console.log("Received " + content);
    if (type === 'json') {
      filename = 'transactionTree.json';
      console.log('Formatting tree ...');
      content = fileCreator.formatJsonTree(content);
      console.log("Tree: " + content);
    } else {
      console.log('Generating XML tree ...');
      filename = 'transactionTree.xml';
      content = fileCreator.getTreeXML(JSON.parse(content));
    }
    newDate = new Date;
    timeStamp = newDate.getTime();
    url = './clientFiles/' + timeStamp;
    console.log("Creating directory");
    fs.mkdir(url, 0755);
    proceed1 = function() {
      return fs.writeFile(url + '/' + filename, content, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("The file " + timeStamp + " was saved!");
        }
        return setTimeout(proceed2, 500);
      });
    };
    setTimeout(proceed1, 500);
    return proceed2 = function() {
      var deleteDir, deleteFile;
      res.download(url + '/' + filename);
      deleteFile = function() {
        fs.unlink(url + '/' + filename);
        return console.log("The file in" + timeStamp + " was deleted!");
      };
      deleteDir = function() {
        fs.rmdir(url);
        return console.log("The directory " + timeStamp + " was deleted!");
      };
      setTimeout(deleteFile, 5000);
      return setTimeout(deleteDir, 6000);
    };
  });

  port = process.env.PORT || 8080;

  app.listen(port, function() {
    return console.log("Listening on " + port);
  });

}).call(this);
