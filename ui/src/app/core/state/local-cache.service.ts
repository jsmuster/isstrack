import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class LocalCacheService {
  private readonly prefix = 'isstrack'

  key(...parts: Array<string | number | null | undefined>): string {
    const cleanParts = parts
      .filter((part) => part !== null && part !== undefined)
      .map((part) => String(part))
      .filter((part) => part.length > 0)
    return [this.prefix, ...cleanParts].join(':')
  }

  get<T>(key: string, fallback: T | null = null): T | null {
    const raw = localStorage.getItem(key)
    if (raw === null) {
      return fallback
    }
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }
}
