import { Component } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

type LoginFormData = { username: string, password: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent, FormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class LoginComponent {
  loginErrorMessage = '';
  pendingRequest = false;

  constructor(private authService: AuthService, private router: Router) {}

  signIn({ username, password }: LoginFormData): void {
    this.pendingRequest = true;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.pendingRequest = false;
        void this.router.navigateByUrl('/profile');
      },
      error: (err) => {
        this.loginErrorMessage = err.error.message;
        this.pendingRequest = false;
      }
    });
  }
}
