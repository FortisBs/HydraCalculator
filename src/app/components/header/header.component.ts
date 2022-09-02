import { Component, OnInit } from '@angular/core';
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDarkMode: boolean;

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit(): void {
  }

  toggleDarkMode() {
    this.isDarkMode = this.themeService.isDarkMode();

    this.isDarkMode
      ? this.themeService.update('light-theme')
      : this.themeService.update('dark-theme');
  }

}
