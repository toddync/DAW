const http = require('http');

async function verifyEndpoint(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`GET ${path} - Status: ${res.statusCode}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('Success');
                    resolve(true);
                } else {
                    console.log('Failed');
                    console.log('Response:', data.substring(0, 200) + '...');
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message} (Code: ${e.code})`);
            resolve(false);
        });

        req.end();
    });
}

async function runVerification() {
    console.log('Starting Admin API Verification...');

    // Note: We can't easily test specific IDs without knowing them, 
    // so we'll test the list endpoints which we know exist.

    const results = [];
    results.push(await verifyEndpoint('/api/admin/beds'));
    results.push(await verifyEndpoint('/api/admin/packages'));

    if (results.every(r => r)) {
        console.log('All verified endpoints are reachable.');
    } else {
        console.error('Some endpoints failed verification.');
    }
}

runVerification();
