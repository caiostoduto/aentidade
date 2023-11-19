import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'

export default class Ping implements WhatsAppCommand {
  name = 'ping'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo): Promise<void> {
    assert(this.bot.sock !== undefined && msgInfo.key.remoteJid)
    await this.bot.sock.readMessages([msgInfo])

    await this.bot.sock.sendMessage(msgInfo.key.remoteJid, {
      text: '🏓 Pong!'
    })
  }
}
