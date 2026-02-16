import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  const url = new URL(event.request.url);

  // Redirect root domain to www
  if (url.hostname === 'planclock.com') {
    url.hostname = 'www.planclock.com';
    return Response.redirect(url.toString(), 301);
  }

  try {
    // Serve static files from ./dist
    return await getAssetFromKV(event);
  } catch (err) {
    // Optional: log the error
    console.error(err);

    // Return 404 if file not found
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
