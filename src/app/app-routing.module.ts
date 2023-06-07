import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { ShiftsComponent } from './components/user/shifts/shifts.component';
import { AddShiftComponent } from './components/user/shifts/add-shift/add-shift.component';
import { EditShiftComponent } from './components/user/shifts/edit-shift/edit-shift.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { EditProfileComponent } from './components/user/profile/edit-profile/edit-profile.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminShiftsComponent } from './components/admin/admin-shifts/admin-shifts.component';
import { AdminEditShiftComponent } from './components/admin/admin-shifts/admin-edit-shift/admin-edit-shift.component';
import { WorkersComponent } from './components/admin/workers/workers.component';
import { WorkerProfileComponent } from './components/admin/workers/worker-profile/worker-profile.component';
import { EditWorkerComponent } from './components/admin/workers/worker-profile/edit-worker/edit-worker.component';
import { WorkerShiftsComponent } from './components/admin/workers/worker-shifts/worker-shifts.component';
import { ForgotPasswordComponent } from './components/partials/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/partials/reset-password/reset-password.component';
import { activateGuard } from './shared/guards/activate.guard';
import { canDeactivate } from './shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard/:user_id',
    canActivate: [activateGuard],
    component: DashboardComponent,
  },
  {
    path: 'shifts/:user_id',
    canActivate: [activateGuard],
    component: ShiftsComponent,
  },
  {
    path: 'add-shift/:user_id',
    canActivate: [activateGuard],
    canDeactivate: [canDeactivate],
    component: AddShiftComponent,
  },
  {
    path: 'edit-shift/:id/:user_id',
    canActivate: [activateGuard],
    canDeactivate: [canDeactivate],
    component: EditShiftComponent,
  },
  {
    path: 'profile/:user_id',
    canActivate: [activateGuard],
    component: ProfileComponent,
  },
  {
    path: 'edit-profile/:user_id/:property',
    canActivate: [activateGuard],
    canDeactivate: [canDeactivate],
    component: EditProfileComponent,
  },
  {
    path: 'admin-dashboard/:admin_id',
    canActivate: [activateGuard],
    component: AdminDashboardComponent,
  },
  {
    path: 'admin-shifts/:admin_id',
    canActivate: [activateGuard],
    component: AdminShiftsComponent,
  },
  {
    path: 'admin-shifts/:shift_id/edit/:admin_id',
    canActivate: [activateGuard],
    component: AdminEditShiftComponent,
  },
  {
    path: 'admin-workers/:admin_id',
    canActivate: [activateGuard],
    component: WorkersComponent,
  },
  {
    path: 'admin-workers/:worker_id/:admin_id',
    canActivate: [activateGuard],
    component: WorkerProfileComponent,
  },
  {
    path: 'admin-workers/:worker_id/edit/:property/:admin_id',
    canActivate: [activateGuard],
    component: EditWorkerComponent,
  },
  {
    path: 'admin-workers/:worker_id/shifts/:admin_id',
    canActivate: [activateGuard],
    component: WorkerShiftsComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
