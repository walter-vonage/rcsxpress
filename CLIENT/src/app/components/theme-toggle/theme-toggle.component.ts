import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    templateUrl: './theme-toggle.component.html',
    styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit {
    theme: 'light' | 'dark' = 'light';

    constructor(private themeService: ThemeService) { }

    ngOnInit() {
        this.themeService.loadTheme();
        this.theme = this.themeService.currentTheme as 'light' | 'dark';
    }

    toggleTheme() {
        this.themeService.toggleTheme();
        this.theme = this.themeService.currentTheme as 'light' | 'dark';
    }
}
