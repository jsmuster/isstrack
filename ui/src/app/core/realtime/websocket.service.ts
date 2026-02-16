/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Injectable } from '@angular/core'
import { Client, StompSubscription } from '@stomp/stompjs'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { TokenService } from '../auth/token.service'

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client | null = null
  private connectPromise: Promise<Client> | null = null

  constructor(private readonly tokenService: TokenService) {}

  subscribeJson<T>(destination: string): Observable<T> {
    return this.subscribe(destination, (body) => JSON.parse(body) as T)
  }

  private subscribe<T>(destination: string, parser: (body: string) => T): Observable<T> {
    return new Observable((subscriber) => {
      let stompSubscription: StompSubscription | null = null
      let cancelled = false

      this.ensureConnected()
        .then((client) => {
          if (cancelled) {
            return
          }
          stompSubscription = client.subscribe(destination, (message) => {
            try {
              subscriber.next(parser(message.body))
            } catch (error) {
              subscriber.error(error)
            }
          })
        })
        .catch((error) => {
          if (!cancelled) {
            subscriber.error(error)
          }
        })

      return () => {
        cancelled = true
        stompSubscription?.unsubscribe()
      }
    })
  }

  private ensureConnected(): Promise<Client> {
    if (this.client && this.client.connected) {
      return Promise.resolve(this.client)
    }
    if (this.connectPromise) {
      return this.connectPromise
    }
    this.client = this.client ?? this.createClient()
    this.connectPromise = new Promise((resolve, reject) => {
      this.client!.onConnect = () => {
        this.connectPromise = null
        resolve(this.client!)
      }
      this.client!.onStompError = (frame) => {
        this.connectPromise = null
        reject(new Error(frame.body || 'WebSocket error'))
      }
      this.client!.onWebSocketError = () => {
        this.connectPromise = null
        reject(new Error('WebSocket connection failed'))
      }
    })
    this.client.activate()
    return this.connectPromise
  }

  private createClient(): Client {
    const client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      debug: () => undefined,
    })

    client.beforeConnect = async () => {
      const token = this.tokenService.getToken()
      client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {}
    }

    client.onWebSocketClose = () => {
      this.connectPromise = null
    }

    return client
  }
}
