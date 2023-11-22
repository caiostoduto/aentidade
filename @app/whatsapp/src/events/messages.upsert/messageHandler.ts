import { type MessageUpsertType, type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppEvent } from '../eventHandler'

export default class SaveCreds implements WhatsAppEvent {
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async handler (msgEvent: MessagesUpsertEvent): Promise<void> {
    void this.bot.commandHandler.onMessageUpsert(msgEvent)
  }
}

export interface MessagesUpsertEvent {
  messages: proto.IWebMessageInfo[]
  type: MessageUpsertType
}
