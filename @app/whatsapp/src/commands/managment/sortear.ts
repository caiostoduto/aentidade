import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { Roles, type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'

export default class Sortear implements WhatsAppCommand {
  name = 'sortear'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo, args: string[], role: Roles): Promise<void> {
    assert(this.bot.sock !== undefined && msgInfo.key.remoteJid)
    await this.bot.sock.readMessages([msgInfo])

    console.log([...this.bot.participantes.entries()])

    if (role !== Roles.COORDENADOR) {
      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
          'Você não tem permissão para usar esse comando!'
        })

      return
    }

    let participantes = [...this.bot.participantes.entries()]
      .filter((p) => p[1].participando)
      .sort(() => Math.random() - 0.5)
      .sort((a, b) => a[1].queue - b[1].queue)

    if (participantes.length < 1) {
      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
          'Não há participantes suficientes para sortear!'
        })

      return
    }

    if (participantes.length >= 12) {
      participantes = participantes.slice(0, 12)
    } else if (participantes.length % 2 === 1) {
      participantes = participantes.slice(0, participantes.length - 1)
    }

    participantes = participantes.sort(() => Math.random() - 0.5)
    const time0 = participantes.slice(0, participantes.length / 2)
    const time1 = participantes.slice(participantes.length / 2)

    this.bot.partidas.push({
      times: [new Map(time0), new Map(time1)]
    })

    await this.bot.sock.sendMessage(
      msgInfo.key.remoteJid, {
        text:
        `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
        `Time 1: ${time0.map((p) => p[1].nome).join(', ')}\n` +
        `Time 2: ${time1.map((p) => p[1].nome).join(', ')}`
      })

    for (const [i, t] of [time0, time1].entries()) {
      for (const p of t) {
        p[1].queue++

        await this.bot.sock.sendMessage(
          p[0], {
            text:
            `Olá, ${p[1].nome}! ✨✨\n` +
            'Você foi convocado para jogar!\n\n' +
            `Seu time (${i + 1}) é: ${t.map((p) => p[1].nome).join(', ')}\n\n` +
            'Caso deseje pular essa partida use o comando "/pular"'
          })
      }
    }
  }
}
