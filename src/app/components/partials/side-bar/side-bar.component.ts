import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbUserModel } from 'src/app/shared/models/db-user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  active: boolean = true;
  username!: string;
  userId!: string;
  user!: DbUserModel;

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.userId = params['user_id'];
    });

    if (window.innerWidth < 768) {
      this.active = false;
    } else {
      this.active = true;
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.active = false;
      } else {
        this.active = true;
      }
    });

    this._route.params.subscribe((params) => {
      this._userService.getUserbyId(params['user_id']).subscribe((res) => {
        if (res.status === 'success') {
          this.user = res.data;
          this._userService.user = res.data;
          this._authService.username = res.data.firstName;
          this.username = res.data.firstName;
          this._authService.admin =
            res.data.permissions.description.includes('admin');
        }
      });
    });
  }

  ngOnDestroy(): void {}

  logout() {
    this._authService.logout().subscribe((res) => {
      if (res.status === 'success') {
        this._router.navigate(['/login']);
      }
    });
  }

  toggleSidebar() {
    this.active = !this.active;
  }
}
