import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'

export default class SaveCreds implements WhatsAppCommand {
  name = 'ping'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async handler (msgInfo: proto.IWebMessageInfo): Promise<void> {
    assert(this.bot.sock !== undefined && msgInfo.key.remoteJid)
    void this.bot.sock.readMessages([msgInfo])

    void this.bot.sock.sendMessage(msgInfo.key.remoteJid, {
      text: '🏓 Pong!'
    })
  }
}
