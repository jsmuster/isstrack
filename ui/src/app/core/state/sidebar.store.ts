/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Injectable } from '@angular/core'
import { signal, effect } from '@angular/core'

/**
 * SidebarStore
 * 
 * Manages the global state of sidebar expand/collapse.
 * Persists the user's preference to localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class SidebarStore {
  private readonly STORAGE_KEY = 'sidebar-expanded'
  
  readonly isExpanded = signal<boolean>(this.getSavedState())

  constructor() {
    // Persist state changes to localStorage
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.isExpanded()))
    })
  }

  toggleSidebar(): void {
    this.isExpanded.update(current => !current)
  }

  setSidebarExpanded(expanded: boolean): void {
    this.isExpanded.set(expanded)
  }

  private getSavedState(): boolean {
    if (typeof localStorage === 'undefined') {
      return true
    }
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      return saved ? JSON.parse(saved) : true
    } catch {
      return true
    }
  }
}
