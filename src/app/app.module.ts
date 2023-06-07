import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordMatchDirective } from './shared/validators/password-match.directive';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Material
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { HeaderComponent } from './components/partials/header/header.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { ShowPasswordComponent } from './components/partials/show-password/show-password.component';
import { SideBarComponent } from './components/partials/side-bar/side-bar.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { NextShiftsComponent } from './components/user/dashboard/next-shifts/next-shifts.component';
import { ChartComponent } from './components/user/dashboard/chart/chart.component';
import { ShiftsComponent } from './components/user/shifts/shifts.component';
import { CommentsComponent } from './components/user/dashboard/comments/comments.component';
import { AddShiftComponent } from './components/user/shifts/add-shift/add-shift.component';
import { EditShiftComponent } from './components/user/shifts/edit-shift/edit-shift.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { EditProfileComponent } from './components/user/profile/edit-profile/edit-profile.component';
import { DateValidatorDirective } from './shared/validators/date-validator.directive';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { WorkersShiftsComponent } from './components/admin/admin-dashboard/workers-shifts/workers-shifts.component';
import { AdminChartComponent } from './components/admin/admin-dashboard/admin-chart/admin-chart.component';
import { AdminShiftsComponent } from './components/admin/admin-shifts/admin-shifts.component';
import { AdminEditShiftComponent } from './components/admin/admin-shifts/admin-edit-shift/admin-edit-shift.component';
import { WorkersComponent } from './components/admin/workers/workers.component';
import { WorkerShiftsComponent } from './components/admin/workers/worker-shifts/worker-shifts.component';
import { WorkerProfileComponent } from './components/admin/workers/worker-profile/worker-profile.component';
import { WorkerCommentsComponent } from './components/admin/workers/worker-profile/worker-comments/worker-comments.component';
import { EditWorkerComponent } from './components/admin/workers/worker-profile/edit-worker/edit-worker.component';
import { AdminSideBarComponent } from './components/partials/admin-side-bar/admin-side-bar.component';
import { AdminCommentsComponent } from './components/admin/admin-dashboard/admin-comments/admin-comments.component';
import { ForgotPasswordComponent } from './components/partials/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/partials/reset-password/reset-password.component';
import { DialogComponent } from './components/partials/dialog/dialog.component';
import { SnackbarComponent } from './components/partials/snackbar/snackbar.component';
import { SpinnerComponent } from './components/partials/spinner/spinner.component';
import { HttpLocalInterceptor } from './shared/interceptors/http.interceptor';
import { EditCommentComponent } from './components/partials/edit-comment/edit-comment.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    ShowPasswordComponent,
    PasswordMatchDirective,
    FooterComponent,
    SideBarComponent,
    DashboardComponent,
    NextShiftsComponent,
    ChartComponent,
    ShiftsComponent,
    CommentsComponent,
    AddShiftComponent,
    EditShiftComponent,
    ProfileComponent,
    EditProfileComponent,
    DateValidatorDirective,
    AdminDashboardComponent,
    WorkersShiftsComponent,
    AdminChartComponent,
    AdminShiftsComponent,
    AdminEditShiftComponent,
    WorkersComponent,
    WorkerShiftsComponent,
    WorkerProfileComponent,
    WorkerCommentsComponent,
    EditWorkerComponent,
    AdminSideBarComponent,
    AdminCommentsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DialogComponent,
    SnackbarComponent,
    SpinnerComponent,
    EditCommentComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  providers: [
    SnackbarComponent,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000 },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLocalInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [SpinnerComponent],
})
export class AppModule {}
