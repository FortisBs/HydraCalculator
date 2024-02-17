import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {ThemeService} from "../../services/theme.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.interface";
import {AsyncPipe, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbar, RouterLink, NgIf, AsyncPipe]
})
export class HeaderComponent {
  private _themeService: ThemeService = inject(ThemeService);
  private _authService: AuthService = inject(AuthService);

  user: Signal<User | null> = this._authService.user;

  toggleTheme(): void {
    this._themeService.toggleTheme();
  }

  onLogout(): void {
    this._authService.logout();
  }
}
