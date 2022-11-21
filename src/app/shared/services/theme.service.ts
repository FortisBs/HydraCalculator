import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { getColor, preloaderConfig } from "../../utils/preloader-config";

export type Theme = 'dark-theme' | 'light-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme!: Theme;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme(): void {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.colorTheme);
  }

  update(theme: Theme) {
    this.setColorTheme(theme);
    const previousColorTheme: Theme = theme === 'dark-theme' ? 'light-theme' : 'dark-theme';

    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);

    preloaderConfig.overlayColor = getColor();
  }

  isDarkMode() {
    return this.colorTheme === 'dark-theme';
  }

  private setColorTheme(theme: Theme) {
    this.colorTheme = theme;
    localStorage.setItem('user-theme', theme);
  }

  private getColorTheme() {
    this.colorTheme = localStorage.getItem('user-theme') as Theme ?? 'light-theme';
  }
}
