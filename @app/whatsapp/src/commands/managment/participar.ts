import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'

export default class Participar implements WhatsAppCommand {
  name = 'participar'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo, args: string[]): Promise<void> {
    assert(this.bot.sock !== undefined && msgInfo.key.remoteJid)
    await this.bot.sock.readMessages([msgInfo])

    const id = msgInfo.key.remoteJid

    const participante = this.bot.participantes.get(id)
    if (participante === undefined || !participante.participando) {
      this.bot.participantes.set(msgInfo.key.remoteJid, {
        nome: msgInfo.pushName as string,
        participando: true,
        queue: participante?.queue ?? [...this.bot.participantes.values()]
          .sort((a, b) => a.queue - b.queue)[0].queue
      })

      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
          'Agora você está participando dos sorteios dos times!'
        })
    } else {
      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
          'Você já está participando dos sorteios dos times!'
        })
    }
  }
}
