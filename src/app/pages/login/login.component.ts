import { Component } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginPending = false;
  loginErrorMessage!: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  signIn(formData: { email: string, password: string }) {
    this.loginPending = true;
    this.auth.login(formData.email, formData.password)
      .then(() => { this.router.navigate(['/profile']) })
      .catch((error) => {
        this.loginPending = false;
        switch (error.code) {
          case 'auth/invalid-email':
            this.loginErrorMessage = 'Invalid email';
            break;
          case 'auth/user-disabled':
            this.loginErrorMessage = 'User disabled';
            break;
          case 'auth/user-not-found':
            this.loginErrorMessage = 'User not found';
            break;
          case 'auth/wrong-password':
            this.loginErrorMessage = 'Wrong password';
            break;
          default:
            this.loginErrorMessage = 'Something went wrong';
        }
      });
  }
}
