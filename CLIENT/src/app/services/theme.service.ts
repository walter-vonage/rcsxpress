import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly THEME_KEY = 'theme';

    setTheme(theme: 'light' | 'dark') {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem(this.THEME_KEY, theme);
    }

    loadTheme() {
        const saved = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | null;
        const theme = saved ?? 'light';
        this.setTheme(theme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-bs-theme');
        this.setTheme(current === 'dark' ? 'light' : 'dark');
    }

    get currentTheme(): string | null {
        return document.documentElement.getAttribute('data-bs-theme');
    }
}
