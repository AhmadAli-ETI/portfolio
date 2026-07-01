const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    try {
        const data = JSON.parse(msg.toString());
        if (data && data.values) {
            latestData = data;
            io.emit('data', latestData);
        }
    } catch (e) {}
});

udpServer.bind(41234, () => {
    console.log('UDP aktiv auf Port 41234');
});

let latestData = { values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };

app.post('/api/data', (req, res) => {
    if (req.body && req.body.values) {
        latestData = req.body;
        io.emit('data', latestData);
        res.status(200).send('OK');
    } else {
        res.status(400).send('Bad Data');
    }
});

io.on('connection', (socket) => {
    console.log('Browser verbunden');
    socket.emit('data', latestData);

    socket.on('disconnect', () => {
        console.log('Browser getrennt');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Dactylus Server laeuft auf Port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} wird bereits verwendet.`);
        process.exit(1);
    } else {
        throw err;
    }
});
