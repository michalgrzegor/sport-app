// const express = require('express');
// const app = express();
// const path = require('path');

// app.use(express.static(__dirname + '/dist'));
// app.listen(process.env.PORT || 8080);

// //PathLocationStrategy

// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname + '/dist/index.html'));
// })

// console.log(`Console listening`);

// const express = require('express');
// const http = require('http')
// const path = require('path');

// const app = express();

// app.use(express.static(path.join(__dirname, '/dist/gremo1')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/dist/gremo1/index.html'));
// });

// app.get('/', function(req, res){
//   res.redirect('calendar');
// });

// const port = process.env.PORT || 3000;
// app.set('port', port);

// const server = http.createServer(app);
// server.listen(port, () => console.log('running'));

const express = require('express');
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static(__dirname + '/dist/gremo1'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/gremo1/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);
