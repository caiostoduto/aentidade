import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'
import { shuffleParticipante } from '../../utils/misc'

export default class Sair implements WhatsAppCommand {
  name = 'sair'
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

    const participante = this.bot.participants.get(participantJid)
    if (participante?.participating !== true) {
      await this.bot.sock.sendMessage(
        chatJid, {
          text:
          `Olá, ${participantName}!! ✨\n\n` +
          'Você não está participando dos sorteios dos times!'
        })
    } else {
      this.bot.participants.set(msgInfo.key.remoteJid, {
        name: msgInfo.pushName as string,
        participating: false,
        queue: participante?.queue ?? 0
      })

      const time = this.bot.matches[this.bot.matches.length - 1]?.teams
        .findIndex(t => t.get(participantJid))

      if (time !== -1 && time !== undefined) {
        await shuffleParticipante(this.bot, participantJid, time)
      }

      await this.bot.sock.sendMessage(
        chatJid, {
          text:
          `Olá, ${participantName}!! ✨\n\n` +
          'Você saiu dos sorteios dos times!'
        })
    }
  }
}
