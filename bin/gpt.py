#!/usr/bin/env python3

from urllib.request import urlopen, Request
from urllib.parse import urlencode
import json
import logging
import argparse
import os

def answer(message, system=None, url=None, model=None):
    logger = logging.getLogger(__name__)

    url = url or os.environ.get('GPT_URL', None)
    if not url:
        raise ValueError("No GPT URL provided! Please use --url or set GPT_URL environment variable.")

    params = {'message': message}
    if system:
        params['system'] = system
    if model:
        params['model'] = model

    query_string = urlencode(params)
    full_url = f"{url}?{query_string}"
    req = Request(full_url, headers={
       "User-Agent": "python-requests/2.26.0",  # Bypass Cloudflare
    })
    parts = []
    with urlopen(req) as response:
        # Stream the response
        for line in response:
            decoded = line.decode('utf-8')
            stripped = decoded.replace('data: ', '', 1).strip()
            if stripped and '[DONE]' not in stripped:
                try:
                    data = json.loads(stripped)
                    part = data.get('response', '')
                    if part == '.' and parts[-1] == '.':
                        continue
                    parts.append(part)
                    print(part, end='')
                except Exception as e:
                    logger.error(f'Could not parse: {stripped}', e)
                    raise Exception(f'Could not parse: {stripped}')
    return ''.join(parts)


def main():
    import sys

    parser = argparse.ArgumentParser(description="Ask request to GPT endpoint and print the answers.")
    parser.add_argument('message', nargs='*', help="Message to send or read from stdin")
    parser.add_argument('--system', help="Optional system prompt to send with the message")
    parser.add_argument('--url', help="Optional Worker URL or set GPT_URL environment variable")
    parser.add_argument('--model', help="Optional model to use. See CF models for available models.")
    args = parser.parse_args()

    if not args.message:
        args.message = sys.stdin.read()

    answer(' '.join(args.message), args.system, args.url, args.model)

if __name__ == "__main__":
    main()
