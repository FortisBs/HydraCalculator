import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ThemeService } from "../../shared/services/theme.service";
import { AuthService } from "../../shared/services/auth.service";
import { Observable } from "rxjs";
import { User } from "../../shared/models/user.interface";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isDarkMode!: boolean;
  user$!: Observable<User | null>;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$;
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
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
