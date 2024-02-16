import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ThemeService} from "../../services/theme.service";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";
import {User} from "../../models/user.interface";
import {AsyncPipe, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {Theme} from "../../models/theme.enum";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbar, RouterLink, NgIf, AsyncPipe]
})
export class HeaderComponent implements OnInit {
  private _themeService: ThemeService = inject(ThemeService);
  private _authService: AuthService = inject(AuthService);

  isDarkMode: boolean = this._themeService.isDarkMode();
  user$: Observable<User | null> = this._authService.user$;

  ngOnInit(): void {
    this._themeService.initTheme();
  }

  toggleDarkMode(): void {
    this._themeService.update(this.isDarkMode ? Theme.LIGHT : Theme.DARK);
    this.isDarkMode = this._themeService.isDarkMode();
  }

  onLogout(): void {
    this._authService.logout();
  }
}
