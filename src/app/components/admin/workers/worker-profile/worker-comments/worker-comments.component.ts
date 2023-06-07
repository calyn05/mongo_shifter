import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  DialogData,
  DialogComponent,
} from 'src/app/components/partials/dialog/dialog.component';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { CommentsService } from 'src/app/shared/services/comments.service';

@Component({
  selector: 'app-worker-comments',
  templateUrl: './worker-comments.component.html',
  styleUrls: [
    './worker-comments.component.css',
    '../../../../user/dashboard/next-shifts/next-shifts.component.css',
    '../../../../user/dashboard/comments/comments.component.css',
  ],
})
export class WorkerCommentsComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _commentsService: CommentsService = inject(CommentsService);
  private _adminService: AdminService = inject(AdminService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _dialog: MatDialog = inject(MatDialog);

  comments!: any[] | null;
  editActive: boolean = false;
  editId!: string;

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['worker_id'];
      this.getUserComments(id);
    });

    this._commentsService.editActive.subscribe((res) => {
      this.editActive = res;

      if (!res) {
        this.getUserComments(this._route.snapshot.params['worker_id']);
      }
    });
  }

  confirmAndDelete(comment: string) {
    const message = 'Are you sure you want to add this comment?';
    const data = new DialogData('Add comment', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteComment(comment);
      }
      this._dialog.closeAll();
    });
  }

  getUserComments(id: string) {
    this._commentsService.getCommentsByUserId(id).subscribe((res) => {
      if (res.status === 'success') {
        this.comments = res.data;
      }
    });
  }

  deleteComment(id: string) {
    this.editId = id;
    this._adminService.deleteComment(id).subscribe((res) => {
      this._snackbarComponent.openSnackbar(
        'Comment deleted successfully!',
        'Close',
        'success-snackbar'
      );
      this.getUserComments(this._route.snapshot.params['worker_id']);
    });
  }
}
