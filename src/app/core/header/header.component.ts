import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from "../../shared/services/theme.service";
import { AuthService } from "../../shared/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode!: boolean;
  isAuthenticated!: boolean;
  subs!: Subscription;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subs = this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          localStorage.setItem('hydraCalcUser', user.uid);
          this.isAuthenticated = true;
        } else {
          localStorage.removeItem('hydraCalcUser');
          this.isAuthenticated = false;
        }
      }
    });

    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  toggleDarkMode(): void {
    this.isDarkMode
      ? this.themeService.update('light-theme')
      : this.themeService.update('dark-theme');

    this.isDarkMode = this.themeService.isDarkMode();
  }

  onLogout() {
    this.authService.logout();
  }
}
