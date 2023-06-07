import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbUserModel } from 'src/app/shared/models/db-user.model';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: [
    './workers.component.css',
    '../../user/shifts/shifts.component.css',
  ],
})
export class WorkersComponent implements OnInit {
  private _adminService: AdminService = inject(AdminService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  workers: DbUserModel[] = [];
  searchTerm!: string;
  adminId!: string;

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.adminId = params['admin_id'];
    });
    this._adminService.getAllUsers().subscribe((res) => {
      res.data.forEach((user: any) => {
        if (user.permissions.description === 'user') {
          this.workers.push(
            new DbUserModel(
              user._id,
              user.email,
              user.firstName,
              user.lastName,
              user.comments,
              user.created,
              user.updated
            )
          );
        }
      });
    });
  }

  searchWorker(term: string) {
    this.searchTerm = term;

    if (this.searchTerm === '') {
      return;
    }

    this._adminService.getAllUsers().subscribe((res) => {
      this.workers = [];
      res.data.forEach((user: any) => {
        if (user.permissions.description === 'user') {
          if (
            user.firstName
              .toLowerCase()
              .includes(this.searchTerm.toLocaleLowerCase()) ||
            user.lastName
              .toLowerCase()
              .includes(this.searchTerm.toLocaleLowerCase())
          ) {
            this.workers.push(
              new DbUserModel(
                user._id,
                user.email,
                user.firstName,
                user.lastName,
                user.comments,
                user.created,
                user.updated
              )
            );
          }
        }
      });
    });
  }
}
