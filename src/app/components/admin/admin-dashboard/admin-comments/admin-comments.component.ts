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
  selector: 'app-admin-comments',
  templateUrl: './admin-comments.component.html',
  styleUrls: [
    './admin-comments.component.css',
    '../../../user/dashboard/next-shifts/next-shifts.component.css',
    '../../../user/dashboard/comments/comments.component.css',
  ],
})
export class AdminCommentsComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _commentsService: CommentsService = inject(CommentsService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _dialog: MatDialog = inject(MatDialog);

  comments!: any[] | null;
  editActive: boolean = false;
  editId!: string;

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['admin_id'];
      this.getUserComments(id);
    });

    this._commentsService.editActive.subscribe((res) => {
      this.editActive = res;

      if (!res) {
        this.getUserComments(this._route.snapshot.params['admin_id']);
      }
    });
  }

  confirmAddComment(comment: string) {
    const message = 'Are you sure you want to add this comment?';
    const data = new DialogData('Add comment', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addComment(comment);
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

  editComment(id: string) {
    this.editId = id;
    this._commentsService.editComment(id);
  }

  addComment(comment: string) {
    const user = this._route.snapshot.params['admin_id'];
    this._commentsService.addComment(comment, user).subscribe((res) => {
      if (res.status === 'success') {
        this.comments?.push(res.data);

        this._snackbarComponent.openSnackbar(
          'Comment added successfully!',
          'Close',
          'success-snackbar'
        );
      }
    });
  }

  closeEdit() {
    this._commentsService.editActive.next(false);
  }
}
