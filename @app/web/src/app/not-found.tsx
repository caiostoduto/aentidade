'use client'

import { usePathname } from 'next/navigation'

async function fetchRedirectURL(code: string) {
  const response = await fetch(`${process.env['NEXT_PUBLIC_TEST']}?code=${code}`)
  return (await response.json()).url
}

export default function ExampleClientComponent() {
  fetchRedirectURL((usePathname() as string)?.slice(1)).then((url) => {
    if (url) {
      window.location.replace(url)
    }
  })
}
