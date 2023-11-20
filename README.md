# GPT API

Sample project to setup an AI model served by a Cloudflare worker.

I used https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/ as a starting point.

After deploying this project, we setup a CLI command to get inference from the endpoint.

## Quick Start

```sh
git clone https://github.com/ddrscott/gpt-cloudflare

cd gpt-cloudflare

npm install -g wrangler

wrangle login

wrangle deploy

export GPT_URL='https://gpt.USERNAME.workers.dev'

./bin/gpt.py What color are oranges

#=> Oranges are typically orange in color
```

## Example Pipe

```sh
echo "What is this about: \n\n $(cat README.md)" | ./bin/gpt.py

#=> This is a GitHub project for an AI model served by a Cloudflare worker. The project uses the `https` protocol to communicate with the Cloudflare worker. The Cloudflare worker is deployed to the `get-started` branch of the `workers-aai` repository.

#=> The project sets up a Cloudflare worker to get inference from the AI model. The AI model is deployed to the `get-started` branch of the `get-started` repository. The Cloudflare worker is deployed to the `get-started` branch of the `workers-aai` repository.

#=> The project uses the `quic` protocol to start the Cloudflare worker. The Cloudflare worker is deployed to the `get-started` branch of the `get-started` repository. The Cloudflare worker is deployed to the `get-started` branch of the `workers-aai` repository.

#=> The project uses the `git` protocol to deploy the Cloudflare worker. The Cloudflare worker is deployed to the `get-started` branch of the `get-started` repository. The Cloudflare worker is deployed%
```

We've also provided a Node JS version of the CLI script:

```sh
./bin/gpt.js 'What is 3 times 3' --system 'Act as a calculator'
#=> 3 times 3 is equal to 9
```
