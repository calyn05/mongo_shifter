import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Comment } from 'src/app/shared/models/comment.model';
import { DbUserModel } from 'src/app/shared/models/db-user.model';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DialogComponent, DialogData } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: [
    './edit-comment.component.css',
    '../../user/dashboard/comments/comments.component.css',
  ],
})
export class EditCommentComponent implements OnInit {
  private _commentsService: CommentsService = inject(CommentsService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _dialog: MatDialog = inject(MatDialog);

  comment!: Comment;
  editActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  active: boolean = false;
  updateForm!: FormGroup;

  constructor() {
    this._commentsService.editActive.subscribe((res) => {
      this.editActive.next(res);
    });

    this.editActive.subscribe((res) => {
      this.active = res;

      if (this.active) {
        this.comment = this._commentsService.comment;
      }

      if (!this.active) {
        this.comment = {
          _id: '',
          user: new DbUserModel('', '', '', '', [''], new Date(), new Date()),
          description: '',
          created: new Date(),
          updated: new Date(),
        };
      }
    });
  }

  ngOnInit(): void {
    this.updateForm = new FormGroup({
      description: new FormControl(this.comment.description, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ]),
    });
  }

  confirmUpdate(description: string) {
    const message = 'Are you sure you want to update this comment?';
    const data = new DialogData('Update comment', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.updateComment(description);
      }
      this._dialog.closeAll();
    });
  }

  updateComment(description: string) {
    const user = this._commentsService.comment.user._id;
    this._commentsService
      .updateComment(this.comment._id, user!, description)
      .subscribe((res) => {
        if (res.status === 'success') {
          this._commentsService.editActive.next(false);
          this.comment = res.data;
          this._commentsService.comment = res.data;
          this._snackbarComponent.openSnackbar(
            'Comment updated successfully!',
            'Close',
            'success-snackbar'
          );
        }
      });
  }
}
