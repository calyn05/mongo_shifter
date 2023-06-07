import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from 'src/app/components/partials/dialog/dialog.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: [
    './comments.component.css',
    '../next-shifts/next-shifts.component.css',
  ],
})
export class CommentsComponent implements OnInit, OnDestroy {
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
      const id = params['user_id'];
      this.getUserComments(id);
    });

    this._commentsService.editActive.subscribe((res) => {
      this.editActive = res;

      if (!res) {
        this.getUserComments(this._route.snapshot.params['user_id']);
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
    const user = this._route.snapshot.params['user_id'];
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

  ngOnDestroy(): void {}
}
