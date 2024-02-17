import { effect, Injectable, RendererFactory2, signal, Signal, WritableSignal } from '@angular/core';
import { Theme } from "../models/theme.enum";

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _appTheme: WritableSignal<Theme> = signal(this._userTheme);
  appTheme: Signal<Theme> = this._appTheme.asReadonly();

  constructor(private _rendererFactory: RendererFactory2) {
    const renderer = this._rendererFactory.createRenderer(null, null);

    effect(() => {
      renderer.removeClass(document.body, Theme.LIGHT);
      renderer.removeClass(document.body, Theme.DARK);

      renderer.addClass(document.body, this.appTheme());
    });
  }

  toggleTheme(): void {
    this._appTheme.update((currentTheme) => {
      const newTheme: Theme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      this._userTheme = newTheme;

      return newTheme;
    });
  }

  private set _userTheme(theme: Theme) {
    localStorage.setItem('user-theme', theme);
  }

  private get _userTheme(): Theme {
    return localStorage.getItem('user-theme') as Theme ?? Theme.LIGHT;
  }
}
