import https from 'https';


export const handler = async (event) => {
    let body;

    if (event.isBase64Encoded) {
        // Decode from base64
        body = Buffer.from(event.body, 'base64').toString('utf-8');
    } else if (event.body instanceof Buffer || typeof event.body === 'object') {
        // Handle Buffer or object
        body = event.body.toString('utf-8');
    } else {
        // Assume it's a string
        body = event.body;
    }
    console.log("event.body", body)
    body = JSON.parse(body);
    if (body && body.callback_url) {
        // console.info(body)
        // console.info("event.body.callback_url ⚠️", body.callback_url)
        const parsedUrl = new URL(body.callback_url)
        const host = parsedUrl.host
        console.info('host', host)
        const remaining = parsedUrl.pathname
        console.log('remaining', remaining)
        const callbackData = JSON.stringify({
            state: "success"
        });
        // https://docs.docker.com/docker-hub/webhooks/
        // https://hub.docker.com/repository/docker/w3b3/web-app-001/webhooks
        // send to event.callback_url
        const options = {
            hostname: host, // Replace with your hostname
            path: remaining,
            port: 443, // Typically 443 for HTTPS
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": callbackData.length
            },
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    console.log('Response:', responseBody);
                    resolve({
                        statusCode: 200,
                        body: responseBody,
                    });
                });
            });

            req.on('error', (error) => {
                console.error('Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                reject({
                    statusCode: 500,
                    body: 'Error making POST request: ' + JSON.stringify(error, null, 2),
                });
            });

            req.write(callbackData);
            req.end();
        });
    }

    const response = {
        statusCode: 200,
        body: body ?? "No body (but a 👌 request)",
    };
    return response;
};
