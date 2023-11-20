#!/usr/bin/env node

const https = require('https');
const querystring = require('querystring');
const readline = require('readline');
const { URL } = require('url');

function answer(message, system = null, url = null, model = null) {
    url = url || process.env.GPT_URL;
    if (!url) {
        throw new Error("No GPT URL provided! Please use --url or set GPT_URL environment variable.");
    }

    const params = { message: message };
    if (system) params.system = system;
    if (model) params.model = model;

    const queryString = querystring.stringify(params);
    const fullUrl = new URL(`${url}?${queryString}`);
    const options = {
        headers: {
            "User-Agent": "node-https/1.0",  // Bypass Cloudflare
        }
    };
    const parts = [];
    https.get(fullUrl, options, (response) => {
        const rl = readline.createInterface({
            input: response,
            terminal: false
        });

        if (response.statusCode !== 200) {
            console.error(`Request Status Code: ${response.statusCode}`);
        }
        rl.on('line', (line) => {
            if (response.statusCode !== 200) {
                console.error(`${line}`);
            } else {
                const stripped = line.replace('data: ', '').trim();

                if (stripped && !stripped.includes('[DONE]')) {
                    try {
                        const data = JSON.parse(stripped);
                        const part = data.response || '';
                        if (part === '.' && parts[parts.length - 1] === '.') {
                            return;
                        }
                        parts.push(part);
                        process.stdout.write(part);
                    } catch (e) {
                        console.error(`Could not parse: ${stripped}`, e);
                        throw new Error(`Could not parse: ${stripped}`);
                    }
                }
            }
        });
    }).on('error', (e) => {
        console.error(e);
    });
}

function main() {
    const args = process.argv.slice(2);
    let system = null;
    let url = null;
    let model = null;
    let messages = [];

    // Simple argument parsing
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--system') {
            system = args[++i];
        } else if (args[i] === '--url') {
            url = args[++i];
        } else if (args[i] === '--model') {
            model = args[++i];
        } else {
            messages.push(args[i]);
        }
    }
    if (messages.length === 0) {
        let data = [];
        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                data.push(chunk);
            }
        });
        process.stdin.on('end', () => {
            messages.push(data.join(''));
            answer(messages.join(''), system, url, model);
        });
    } else {
        answer(messages.join(' '), system, url, model);
    }
    // 
}

if (require.main === module) {
    main();
}
