const http = require('http');

const data = JSON.stringify({
    sample_id: 'TEST-001',
    analyst_name: 'Tester',
    stress_type: 'Thermal',
    initial_api: 100,
    stressed_api: 90,
    initial_degradants: 0,
    stressed_degradants: 9,
    parent_mw: 300,
    degradant_mw: 150,
    rrf: 1.0
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/excel/generate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.log('Response Body:', responseData);
        } else {
            console.log('Success! Excel file received (binary data not shown).');
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
