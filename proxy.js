// add libaries
const express = require('express');
const request = require('request');
const fs = require('fs');

// use express
const app = express();
// insert custom port here
const PORT = 8080; 
// set allowed domain (only 1)
const ALLOWED_DOMAIN = 'airmaestro.cobhamspecialmission.com.au';

// generate ACST timestamp
function getACSTTimestamp() {
    const now = new Date();
    const acstOptions = { timeZone: 'Australia/Darwin', hour12: false };
    return now.toLocaleString('en-AU', acstOptions);
}

// shorten URL for terminal output
function shortenUrl(url) {
    const afterHttps = url.match(/https:\/\/(.{5})/);
    const firstCharacters = afterHttps ? afterHttps[1] : '';
    const lastCharacters = url.slice(-5);
    return `${firstCharacters}...${lastCharacters}`;
}

// log IP addresses
app.use((req, res, next) => {
    const timestamp = getACSTTimestamp();
    console.log(`[${timestamp}] Request from IP address: ${req.ip}`);
    next();
});

app.use((req, res, next) => {
    const timestamp = getACSTTimestamp();
    const ip = req.ip.replace('::ffff:', ''); 
    const logEntry = `[${timestamp}] IP: ${ip}, URL: ${req.originalUrl}\n`;
    fs.appendFile('proxy.log', logEntry, (error) => {
        if (error) {
          console.error('Error writing to log file:', error);
        }
    });
    next();
});

// setup url pattern (/proxy/wildcard)
app.use('/proxy/*', (req, res) => {
    let targetUrl = req.params[0];
  // if user accidentally pastes webcals link, automatically convert to https
    if (targetUrl.startsWith('webcals://')) {
        targetUrl = 'https://' + targetUrl.slice('webcals://'.length);
    }
  // create short URL
  const shortenedUrl = shortenUrl(targetUrl);

  // assess if crafted url has the allowable domain, then execute proxy request
    if (targetUrl.includes(ALLOWED_DOMAIN)) {
        req.pipe(request(targetUrl)).pipe(res);
    // error handling and logging
        const timestamp = getACSTTimestamp();
        console.log(`[${timestamp}] Proxying request for: ${shortenedUrl}`);
    } else {
        const timestamp = getACSTTimestamp();
        console.log(`[${timestamp}] Access denied for: ${shortenedUrl}`);
        res.status(403).send('Access forbidden');
    }
});

// start the proxy
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});