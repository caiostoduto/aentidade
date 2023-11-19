import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'

export default class Sortear implements WhatsAppCommand {
  name = 'sortear'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo, args: string[]): Promise<void> {
    assert(this.bot.sock !== undefined && msgInfo.key.remoteJid)
    await this.bot.sock.readMessages([msgInfo])

    console.log([...this.bot.participantes.entries()])

    let participantes = [...this.bot.participantes.entries()]
      .filter((p) => p[1].participando)
      .sort(() => Math.random() - 0.5)
      .sort((a, b) => a[1].partidas - b[1].partidas)

    if (participantes.length >= 12) {
      participantes = participantes.slice(0, 12)
    } else if (participantes.length % 2 === 1) {
      participantes = participantes.slice(0, participantes.length - 1)
    }

    participantes = participantes.sort(() => Math.random() - 0.5)
    const time1 = participantes.slice(0, participantes.length / 2)
    const time2 = participantes.slice(participantes.length / 2)

    await this.bot.sock.sendMessage(
      msgInfo.key.remoteJid, {
        text:
        `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
        `Time 1: ${time1.map((p) => p[1].nome).join(', ')}\n` +
        `Time 2: ${time2.map((p) => p[1].nome).join(', ')}`
      })

    for (const [i, t] of [time1, time2].entries()) {
      for (const p of t) {
        p[1].partidas++

        await this.bot.sock.sendMessage(
          p[0], {
            text:
            `Olá, ${p[1].nome}! ✨✨\n` +
            'Você foi convocado para jogar!\n\n' +
            `Seu time (${i + 1}) é: ${t.map((p) => p[1].nome).join(', ')}`
          })
      }
    }
  }
}
