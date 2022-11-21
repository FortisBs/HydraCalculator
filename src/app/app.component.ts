import { Component } from '@angular/core';
import { preloaderConfig } from "./utils/preloader-config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  preloaderSettings = preloaderConfig;
}
