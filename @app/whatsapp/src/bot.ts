import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import WhatsAppEventHandler from './events/eventHandler'
import WhatsAppCommandHandler from './commands/commandHandler'
import assert from 'assert'
import Settings from './utils/settings'

export class WhatsAppBot {
  eventHandler: WhatsAppEventHandler
  commandHandler: WhatsAppCommandHandler
  settings = new Settings()

  authstate: Awaited<ReturnType<typeof useMultiFileAuthState>> | undefined
  sock: ReturnType<typeof makeWASocket> | undefined

  participantes = new Map<string, Participante>()
  partidas = new Array<Partida>()

  constructor () {
    this.commandHandler = new WhatsAppCommandHandler(this).loadAll()
    this.eventHandler = new WhatsAppEventHandler(this).loadAll()
  }

  private async loadAuth (): Promise<void> {
    // utility function to help save the auth state in a single folder
    // this function serves as a good guide to help write auth & key states for SQL/no-SQL databases, which I would recommend in any production grade system
    this.authstate = await useMultiFileAuthState('auth_info_baileys')
  }

  async connect (): Promise<void> {
    if (this.authstate === undefined) await this.loadAuth()
    assert(this.authstate !== undefined)

    // will use the given state to connect
    // so if valid credentials are available -- it'll connect without QR
    this.sock = makeWASocket({
      auth: (this.authstate).state,
      printQRInTerminal: true
    })

    this.eventHandler.updateEV()
  }
}

type ParticipanteId = string

export interface Participante {
  nome: string
  participando: boolean
  queue: number
}

export interface Partida {
  times: Array<Map<ParticipanteId, Participante>>
  _excluded: ParticipanteId[]
}
