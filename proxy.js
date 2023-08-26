// add libaries
const express = require('express');
const request = require('request');

// use express
const app = express();
// insert custom port here
const PORT = 8080; 
// set allowed domain (only 1)
const ALLOWED_DOMAIN = 'airmaestro.cobhamspecialmission.com.au';

// setup url pattern (/proxy/wildcard)
app.use('/proxy/*', (req, res) => {
  let targetUrl = req.params[0];
  // if user accidentally pastes webcals link, automatically convert to https
  if (targetUrl.startsWith('webcals://')) {
    targetUrl = 'https://' + targetUrl.slice('webcals://'.length);
  }
  // assess if crafted url has the allowable domain, then execute proxy request.
  if (targetUrl.includes(ALLOWED_DOMAIN)) {
    req.pipe(request(targetUrl)).pipe(res);
    // error handling
    console.log(`Proxying request for: ${targetUrl}`);
  } else {
    console.log(`Access denied for: ${targetUrl}`);
    res.status(403).send('Access forbidden');
  }
});
// start the proxy
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});