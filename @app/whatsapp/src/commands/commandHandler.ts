import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { type WhatsAppBot } from '../bot'
import { type MessageUpsertType, type proto } from '@whiskeysockets/baileys'
import assert from 'assert'

export default class WhatsAppCommandHandler {
  bot: WhatsAppBot
  commands = new Map<CommandCategory, WhatsAppCommand[]>()

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  loadAll (): WhatsAppCommandHandler {
    const commandDirs = readdirSync(__dirname)
      .filter((file) =>
        statSync(join(__dirname, file)).isDirectory())

    commandDirs.forEach((commandDir) => {
      const commandFiles = readdirSync(join(__dirname, commandDir))
        .filter((file) => file.endsWith('.ts'))

      commandFiles.forEach((commandFile) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const WhatsAppCommand = require(
          join(__dirname, commandDir, commandFile)).default

        this.commands.set(commandDir,
          (this.commands.get(commandDir) ?? []).concat(new WhatsAppCommand(this.bot)))
      })
    })

    return this
  }

  async onMessageUpsert (msgEvent: MessagesUpsertEvent): Promise<void> {
    if (msgEvent.type !== 'notify') return
    assert(this.bot.sock)

    console.log(JSON.stringify(msgEvent))

    for (const msgInfo of msgEvent.messages) {
      if (msgInfo.message?.conversation == null) return
      const text = msgInfo.message.conversation

      if (!text.startsWith(this.bot.settings.prefix)) return

      await [...this.commands.values()]
        .reduce((acc, val) => acc.concat(val), [])
        .find((cmd) => cmd.enabled && cmd.name === text.split(' ')[0].slice(1))
        ?.run(
          msgInfo,
          text.split(' '),
          getRole(this.bot, msgInfo)
        )
    }
  }
}

function getRole (bot: WhatsAppBot, msgInfo: proto.IWebMessageInfo): Roles {
  const coordenadores = bot.settings.coordinators

  if (coordenadores?.includes(msgInfo.key.participant as string)) {
    return Roles.COORDENADOR
  }

  return Roles.PARTICIPANTE
}

type CommandCategory = string

export interface WhatsAppCommand {
  name: string
  enabled: boolean
  run: (msgInfo: proto.IWebMessageInfo, args: string[], role: Roles) => Promise<void>
}

export interface MessagesUpsertEvent {
  messages: proto.IWebMessageInfo[]
  type: MessageUpsertType
}

export enum Roles {
  PARTICIPANTE,
  COORDENADOR
}
