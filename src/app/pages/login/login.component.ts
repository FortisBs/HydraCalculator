import { Component } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { MaterialModule } from "../../shared/modules/material.module";

type LoginFormData = { username: string, password: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [FormsModule, MaterialModule]
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
