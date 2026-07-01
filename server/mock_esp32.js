const http = require('http');

function sendMockData() {
    const values = Array.from({ length: 10 }, () => Math.floor(Math.random() * 5000));
    const data = JSON.stringify({ values });

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/data',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
        },
    };

    const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            process.stdout.write('.'); // Success indicator
        } else {
            console.log(`\nServer error: ${res.statusCode}`);
        }
    });

    req.on('error', (error) => {
        if (error.code === 'ECONNREFUSED') {
            console.error('\nFehler: Server nicht erreichbar! (ECONNREFUSED)');
            console.error('Hast du den Webserver (npm start) im server-Ordner gestartet?');
        } else {
            console.error('\nFehler beim Senden:', error.message);
        }
    });

    req.write(data);
    req.end();
}

console.log('Starte mock ESP32 Daten-Stream auf http://localhost:3001/api/data');
console.log('Drücke Strg+C zum Beenden.');
setInterval(sendMockData, 1000);
