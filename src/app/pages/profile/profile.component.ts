import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { DatabaseService } from "../../shared/services/database.service";
import { OwnDelegate } from "../../shared/models/user.interface";

type ProfileFeature = 'dashboard' | 'addDelegate';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  activeFeature: ProfileFeature = 'dashboard';
  userDelegates: OwnDelegate[] = [];

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    const uid = localStorage.getItem('hydraCalcUser');
    if (uid) {
      this.databaseService.getDelegate(uid).subscribe({
        next: (value) => this.userDelegates = value
      });
    }
  }

  toggleFeature(feature: ProfileFeature) {
    this.activeFeature = feature;
  }
}
