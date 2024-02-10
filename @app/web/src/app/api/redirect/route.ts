// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  // const myKv = process.env.MY_KV
  // await myKv.put('suffix', ' from a KV store!')
  // const suffix = await myKv.get('suffix')
  // responseText += suffix

  const url = new URL(request.url)
  var query = url.searchParams.get('q')?.toLocaleLowerCase()

  if (query === undefined || query === '') {
    query = '/' // return new Response('Missing query', { status: 400 })
  }

  return await returnKVResponse(query)
}

async function returnKVResponse(query: string) {
  const kv = process.env.REDIRECT;
  const value = await kv.get(query)

  if (value !== null) {
    return new Response(
      JSON.stringify({
        url: value,
        default: query === '/'
      }), { status: 200 })
  } else {
    if (query !== '/') {
      return await returnKVResponse('/')
    } else {
      return new Response('Not found', { status: 404 })
    }
  }
}
