const onoff = require('onoff');

const Gpio = onoff.Gpio;
const led = new Gpio(4, 'out');

interval = setInterval(() => {
    const value = (led.readSync() + 1) % 2;
    led.write(value, () => {
        console.log('Changed LED state to: ' + value)
    });
}, 2000);

process.on('SIGINT', () => {
    clearInterval(interval);
    led.writeSync(0);
    led.unexport();
    console.log('[INFO] Shutting down..');
    process.exit();
});
