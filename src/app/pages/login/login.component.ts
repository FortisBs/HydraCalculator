import { Component } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";

type LoginFormData = { username: string, password: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginErrorMessage = '';
  pendingRequest = false;

  constructor(private authService: AuthService) {}

  signIn({ username, password }: LoginFormData): void {
    this.pendingRequest = true;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.pendingRequest = false;
      },
      error: (err) => {
        this.loginErrorMessage = err.error.message;
        this.pendingRequest = false;
      }
    });
  }
}
