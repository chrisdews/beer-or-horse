const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
app.enable('trust proxy');
// the __dirname is the current directory from where the script is running
app.use((req, res, next) => {
  if (req.protocol === 'https' || req.secure || req.headers.host.includes('localhost')) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});
app.use(express.static(path.join(__dirname)));
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });
app.listen(port);