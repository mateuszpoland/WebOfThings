const http = require('http');
const request = require('request');
const fs = require('fs');

const port = 8787;
const serviceRootUrl = 'http://localhost:8585';

http.createServer((servReq, servResp) => {
    console.log('New incoming server connection');
    if (servReq.url === '/log') {
        request({url: serviceRootUrl + '/temperature', json: true}, (err, resp, body) => {
            if(err) throw err;
            if(resp.statusCode === 200) {
                console.log(body);
                const temperature = body.temperature;
                request({url: serviceRootUrl + '/light', json: true}, (err, resp, body) => {
                    if(err) throw err;
                    if(resp.statusCode === 200) {
                        console.log(body)
                        const light = body.light;
                        const logEntry = `Tempertature: ${temperature} Light: ${light}`;
                        fs.appendFile('sensor_log.txt', logEntry + '\n', encoding='utf8', (err) => {
                            if(err) throw err;
                            servResp.writeHeader(200, {"Content-Type": "text/plain"});
                            servResp.write(logEntry);
                            servResp.end();
                        });
                    }
                });
            } else {
                servResp.writeHeader(200, {"Content-Type": "text/plain"});
                servResp.write('use /log path.')
            }
        });
    }
}).listen(port);

console.log(`Server listening on port ${port}`);
