const http = require('http');
const request = require('request');

const port = 8585;

const randInt = (low, high) => {
    return Math.floor(Math.random() * (high - low) + low );
}

http.createServer((req, res) => {
    res.writeHeader(200, {'Content-Type': 'application/json'});
    switch(req.url) {
        case '/temperature':
            res.write(`{"temperature": ${randInt(1,40)} }`);
            break;
        case '/light':
            res.write(`{"light": ${randInt(1, 100)} }`);
            break;
        default:
            res.write(`{"actions": "sensor device"}`)
            break;
    }
    res.end();
}).listen(port);
console.log('server listening on port ' + port);
