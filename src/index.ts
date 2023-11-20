import { Ai } from '@cloudflare/ai'

export interface Env {
  AI: any;
}

export default {
  async fetch(request: Request, env: Env) {
    const ai = new Ai(env.AI);

    // Get the query parameter named 'question'
    const url = new URL(request.url),
        model = url.searchParams.get('model') || '@cf/mistral/mistral-7b-instruct-v0.1',
        max_tokens = parseInt(url.searchParams.get('max_tokens') || 2000),
        system = url.searchParams.get('system') || `You are an AI assistant. Be as helpful as possible. Keep your responses short and concise. Use Markdown to wrap code snippets.`, message = url.searchParams.get('message');

    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: message }
    ];

    const stream = await ai.run(model, {
      messages,
      max_tokens: max_tokens,
      stream: true
    });

    return new Response(
      stream,
      { headers: { "content-type": "text/event-stream" } }
    );
  },
};
