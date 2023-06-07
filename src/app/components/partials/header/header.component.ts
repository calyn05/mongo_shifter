import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  userMenu: { path: string; name: string }[] = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/shifts', name: 'My Shifts' },
    { path: '/profile', name: 'Profile' },
  ];

  adminMenu: { path: string; name: string }[] = [
    { path: '/admin/dashboard', name: 'Dashboard' },
    { path: '/admin/shifts', name: 'Shifts' },
    { path: '/admin/workers', name: 'Workers' },
  ];

  shiftsMenuTab!: { path: string; name: string };
  profileMenuTab!: { path: string; name: string };
  dashboardMenuTab!: { path: string; name: string };

  authLink = {
    login: { path: '/login', name: 'Login' },
    register: { path: '/register', name: 'Register' },
    forgotPassword: { path: '/forgot-password', name: 'Forgot Password' },
  };

  events: any[] = [];

  url!: string;

  logoUrl!: string;

  username!: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  logout() {}

  get isLoggedIn() {
    return null;
  }
}
