import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'
import { shuffleParticipante } from '../../utils/misc'

export default class Pular implements WhatsAppCommand {
  name = 'pular'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo): Promise<void> {
    assert(this.bot.sock !== undefined &&
      (msgInfo.key.remoteJid != null) &&
      (msgInfo.key.participant != null))

    await this.bot.sock.readMessages([msgInfo])

    const chatJid = msgInfo.key.remoteJid
    const participantJid = msgInfo.key.participant
    const participantName = msgInfo.pushName as string

    const timeNum = this.bot.matches[this.bot.matches.length - 1]?.teams
      .findIndex(t => t.get(participantJid))

    if (timeNum !== -1 && timeNum !== undefined) {
      await shuffleParticipante(this.bot, participantJid, timeNum)

      await this.bot.sock.sendMessage(
        chatJid, {
          text:
          `Olá, ${participantName}!! ✨\n\n` +
          'Você pulou sua vez na partida atual!\n\n' +
          'Caso deseje sair da fila use o comando \'*/sair*\''
        })
    } else {
      await this.bot.sock.sendMessage(
        chatJid, {
          text:
          `Olá, ${participantName}!! ✨\n\n` +
          'Você não está participando da partida atual!\n\n' +
          'Caso deseje sair da fila use o comando \'*/sair*\''
        })
    }
  }
}
