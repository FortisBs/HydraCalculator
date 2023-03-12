import { Component, OnInit } from '@angular/core';
import { AuthService } from "./shared/services/auth.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private ngxLoader: NgxUiLoaderService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.ngxLoader.startLoader('starting-loader');
    this.ngxLoader.stopLoader('starting-loader');
  }
}
