import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Set white (light mode) as the absolute default
      this.isDarkMode.set(false);
    }
    
    this.applyTheme(this.isDarkMode());

    // Effect to update local storage and DOM when signal changes
    effect(() => {
      const isDark = this.isDarkMode();
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.applyTheme(isDark);
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
