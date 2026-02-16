import { Routes } from '@angular/router';
import { SetANewPasswordComponent } from './set-a-new-password.component';

/**
 * Routes for the Set a New Password form
 */
const routes: Routes = [
  {
    path: '',
    component: SetANewPasswordComponent,
    data: { title: 'Set a New Password' }
  }
];

export default routes;
