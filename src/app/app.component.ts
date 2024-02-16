import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from "./shared/services/auth.service";
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent]
})
export class AppComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this._authService.autoLogin();
  }
}
