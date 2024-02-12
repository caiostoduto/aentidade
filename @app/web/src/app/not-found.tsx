'use client'

import { usePathname } from 'next/navigation'
import Head from 'next/head';
import { useState, useEffect, type ReactElement } from 'react'
import Image from 'next/image'
import '../styles/not-found.css'

export default function NotFound(): ReactElement<any, any> | void {
  const code = (usePathname() as string)?.slice(1)
  const [redirectURL, setRedirectURL] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      const url = await fetchRedirectURL(code)
      setRedirectURL(url)
      setLoading(false)
    })()
  }, [code])

  if (isLoading) return LoadingScreen()
  if (redirectURL) return window.location.replace(redirectURL)
}

function LoadingScreen(): ReactElement<any, any> {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen">
      <Head>
        <title>Redirecting...</title>
      </Head>

      <Image
        className='grow fixed'
        src="/logo_transparente.svg"
        width={85}
        height={85}
        alt="Picture of the author"
      />
    </main >
  )
}

interface FetchRedirectURLResponse {
  url?: string
}

async function fetchRedirectURL(code: string): Promise<string | null> {
  const url = `/api/redirect?q=${code}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    return (await response.json() as FetchRedirectURLResponse).url ?? null
  } catch (e) {
    return null
  }
}
