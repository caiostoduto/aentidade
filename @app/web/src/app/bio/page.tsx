import Head from 'next/head';
import Image from "next/image";
import Link from 'next/link';

export default function Bio() {
  return (
    <main className='flex flex-col items-center justify-center w-full px-[20px] py-16'>
      <Head>
        <title>Bio</title>
      </Head>

      <header className='grid place-items-center mb-4'>
        <Image
          className='relative pb-[20px]'
          src="/logo_transparente.svg"
          width={100}
          height={100}
          alt="aentidade logo"
        />

        <span className='mt-3.5 text-[19px]'>
          aentidade
        </span>

        <div className='flex mt-2 mb-2 opacity-80'>
          <Image
            className='relative me-[2px]'
            src="/icons/pin.svg"
            height={14}
            width={14}
            alt="Ícone de pin"
          />
          <span className='text-[14px]'>
            Santo André, UFABC
          </span>
        </div>

        <div className='flex'>
          <Link href="https://instagram.com/aentidade.ufabc/" className='p-2'>
            <Image
              className='relative'
              src="/icons/instagram.svg"
              width={28}
              height={28}
              alt="Ícone do Instagram"
            />
          </Link>
          <Link href="https://github.com/caiostoduto/aentidade" className='p-2'>
            <Image
              className='relative'
              src="/icons/github.svg"
              width={28}
              height={28}
              alt="Ícone do GitHub"
            />
          </Link>
        </div>
      </header>

      <section className='mt-4 grid place-items-center max-w-[560px] w-full text-center'>
        <a
          href='https://aentidade.pages.dev/participe'
          className='mb-4 border-2 p-[17.5px] rounded-2xl w-full bg-gray-800/20'>
          <span className=''>
            Faça parte!
          </span>
        </a>

        <a
          href='https://aentidade.pages.dev/calendário'
          className='mb-4 border-2 p-[17.5px] rounded-2xl w-full bg-gray-800/20'>
          <span>
            Nosso Calendário
          </span>
        </a>

        <a
          href='https://aentidade.pages.dev/comentário'
          className='mb-4 border-2 p-[17.5px] rounded-2xl w-full bg-gray-800/20'>
          <span>
            Denúncias, Elogios e Sugestões
          </span>
        </a>

        <a
          href='https://aentidade.pages.dev/normas'
          className='mb-4 border-2 p-[17.5px] rounded-2xl w-full bg-gray-800/20'>
          <span>
            Normas aentidade
          </span>
        </a>
      </section>

      <section className='mt-6 max-w-[560px] w-full'>
        <iframe
          src='https://open.spotify.com/embed/playlist/4ONy8cyUkojEkYOWAHR0Fe?utm_source=generator&theme=0'
          className='rounded-2xl w-full'
          height={500}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </section>
    </main>
  );
}
