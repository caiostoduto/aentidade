import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { type WhatsAppBot } from '../bot'
import { type BaileysEventMap } from '@whiskeysockets/baileys'
import type makeWASocket from '@whiskeysockets/baileys'

export default class WhatsAppEventHandler {
  bot: WhatsAppBot
  events = new Map<string, WhatsAppEvent[]>()

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  loadAll (): WhatsAppEventHandler {
    const eventDirs = readdirSync(__dirname)
      .filter((file) =>
        statSync(join(__dirname, file)).isDirectory())

    eventDirs.forEach((eventDir) => {
      const eventFiles = readdirSync(join(__dirname, eventDir))
        .filter((file) => file.endsWith('.ts'))

      eventFiles.forEach((eventFile) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const WhatsAppEvent = require(join(__dirname, eventDir, eventFile)).default

        this.events.set(eventDir,
          (this.events.get(eventDir) ?? []).concat(new WhatsAppEvent(this.bot)))
      })
    })

    return this
  }

  updateEV (): void {
    [...this.events.entries()].forEach((event) => {
      (this.bot.sock as ReturnType<typeof makeWASocket>)
        .ev.on(event[0] as keyof BaileysEventMap, (...args: any[]) => {
          event[1].forEach((event) => {
            if (event.enabled) {
              event.handler(...args)
            }
          })
        })
    })
  }
}

export interface WhatsAppEvent {
  enabled: boolean
  handler: (...args: any[]) => void
}
