import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Theme } from "../models/theme.enum";

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _renderer: Renderer2;
  private _colorTheme!: Theme;

  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme(): void {
    this.getColorTheme();
    this._renderer.addClass(document.body, this._colorTheme);
  }

  update(theme: Theme): void {
    this.setColorTheme(theme);
    const previousColorTheme: Theme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;

    this._renderer.removeClass(document.body, previousColorTheme);
    this._renderer.addClass(document.body, theme);
  }

  isDarkMode(): boolean {
    return this._colorTheme === Theme.DARK;
  }

  private setColorTheme(theme: Theme): void {
    this._colorTheme = theme;
    localStorage.setItem('user-theme', theme);
  }

  private getColorTheme(): void {
    this._colorTheme = localStorage.getItem('user-theme') as Theme ?? Theme.LIGHT;
  }
}
