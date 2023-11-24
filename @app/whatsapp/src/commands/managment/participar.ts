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

  async run (msgInfo: proto.IWebMessageInfo): Promise<void> {
    assert(this.bot.sock !== undefined &&
      (msgInfo.key.remoteJid != null))

    await this.bot.sock.readMessages([msgInfo])

    const chatJid = msgInfo.key.remoteJid
    const participantJid = msgInfo.key.participant ?? msgInfo.key.remoteJid
    const participantName = msgInfo.pushName as string
    const participant = this.bot.participants.get(participantJid)

    if (participant?.participating !== true) {
      this.bot.participants.set(participantJid, {
        name: participantName,
        participating: true,
        queue: participant?.queue ?? [...this.bot.participants.values()]
          .sort((a, b) => a.queue - b.queue)[0]?.queue ?? 0
      })

      await this.bot.sock.sendMessage(
        chatJid, {
          text:
          `Olá, ${participantName}! ✨\n\n` +
          'Agora você está participando dos sorteios dos times!'
        })
    } else {
      await this.bot.sock.sendMessage(
        chatJid, {
          text:
          `Olá, ${participantName}!! ✨\n\n` +
          'Você já está participando dos sorteios dos times!'
        })
    }
  }
}
