import assert from 'assert'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppEvent } from '../eventHandler'

export default class SaveCreds implements WhatsAppEvent {
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async handler (): Promise<void> {
    assert(this.bot.authstate?.saveCreds !== undefined)

    void (this.bot.authstate.saveCreds)()
  }
}
