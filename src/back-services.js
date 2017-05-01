/* eslint no-console: 0 */
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let MetaInspector = require('node-metainspector');

let isDeveloping = process.env.NODE_ENV !== 'production';
let port = isDeveloping ? 3014 : process.env.PORT;
let app = express();

let sanitizeTitle = function(title) {
    // http://stackoverflow.com/a/7764370/349353
    return title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
};

// TODO: Improve CSP
// http://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.post('/links/', function(req, res) {
    var client = new MetaInspector(req.body.url, {});

    console.log('Getting the links info and saving...')

    client.on('fetch', function() {

        var linkData = {
            url: client.url,
            title: client.ogTitle ? sanitizeTitle(client.ogTitle) : sanitizeTitle(client.title),
            host: client.host,
            image: client.image,
            description: client.ogDescription ? client.ogDescription : client.description,
            pending: false
        };
        res.send(linkData);
        console.log('This is LinkData:' + linkData + '... Sending info from: ' + client.url);
    });
    client.fetch();
});


app.listen(port, 'localhost', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
// var server = app.listen(3020, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('API server listening at http://localhost:%s:%s', host, port);
// });
