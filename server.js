'use strict';
var http = require('http')
var fs = require('fs')
var port = process.env.PORT || 1337;

let server = http.createServer(function (req, res) {
    fs.readFile('page.html', 'utf8', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(data) 
        return res.end()
    })
}).listen(port)

const { Server } = require("socket.io")
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});

const mqtt = require('mqtt')
const options = { username: 'frekanstanmqtt', password: 'mq33261978tt' }
const client = mqtt.connect('mqtt://185.141.33.75', options)

client.on('connect', function () {
    client.subscribe('frekanstan/test', function (err) {
        if (err) {
            console.log("err: " + err.toString())
        }
    })
})

let counter = 0;
client.on('message', function (topic, message) {
    const msgObj = JSON.parse(message.toString())
    //console.log("\n\nmessage: " + message.toString() + "\n\n")

    if (!msgObj) {
        console.log('null message')
        return;
    } 
    if (!msgObj.data) {
        console.log('null data')
        return;
    }
    if (!msgObj.data.length) {
        console.log('data is not array')
        return;
    }
    if (msgObj.data.length === 0) {
        console.log('empty data')
        return;
    }
    msgObj.data.forEach(dt => {
        if (!dt.value) {
            console.log('empty value')
        }
        
        else if (dt.value.mac === '1c2906cdddd2') {
            console.log('device id: ' + msgObj.device_info.device_id)
            console.log('timestamp: ' + dt.value.timestamp)
            console.log('rssi: ' + dt.value.rssi)
            console.log('---------------')
            if (msgObj.device_info.device_id === 'frekanstantestdevice')
                io.emit('dev1', dt.value);
            else if (msgObj.device_info.device_id === 'frekanstantestdevice2')
                io.emit('dev2', dt.value);
        }
    });

    counter++;
    /*if (counter === 20)
        client.end()*/
})