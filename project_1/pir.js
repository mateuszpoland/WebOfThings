const Gpio = require('onoff').Gpio
const sensor = new Gpio(17, 'in', 'both');

sensor.watch((err, value) => {
    if(err) exit(err);
    console.log(value ? 'value present' : 'no more..');
});

const exit = (err) => {
    if(err) console.log('An error occurred: ' + err);
    sensor.unexport();
    console.log('exiting..');
    process.exit();
}

process.on('SIGINT', exit);


