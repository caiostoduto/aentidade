import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'

export default class Sair implements WhatsAppCommand {
  name = 'sair'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo): Promise<void> {
    assert(this.bot.sock !== undefined && msgInfo.key.remoteJid)
    await this.bot.sock.readMessages([msgInfo])

    const id = msgInfo.key.remoteJid

    const participante = this.bot.participantes.get(id)
    if (participante === undefined || !participante.participando) {
      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
          'Você não está participando dos sorteios dos times!'
        })
    } else {
      this.bot.participantes.set(msgInfo.key.remoteJid, {
        nome: msgInfo.pushName as string,
        participando: false,
        queue: participante?.queue ?? 0
      })

      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}! ✨✨\n\n` +
          'Você saiu dos sorteios dos times!'
        })
    }
  }
}
