# Calendar Proxy

Customised for work purposes.<br />  
It is set up to use port 8080, but you can adjust as needed.

### How to install

**Requirements**
- Linux (Ubuntu used below)
- Node.js
- NPM
    - Express.js to create routes.
    - Request library for http functions.
- proxy.js in its own folder in home dir.

1. Install node and npm
```
sudo apt update
sudo apt install node npm
```
2. Check everything installed
```
node -v
npm -v
```
3. Install express and request
```
npm install express request
```
4. Start proxy <br /> 
Navigate to proxy.js location then run:
```
node proxy.js
```

### Optional
Use `tmux` to run the proxy in headless mode.