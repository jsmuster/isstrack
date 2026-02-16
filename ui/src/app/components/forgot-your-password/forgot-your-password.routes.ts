import { Routes } from '@angular/router';
import { ForgotYourPasswordComponent } from './forgot-your-password.component';

/**
 * Routes for the Forgot Your Password feature
 */
const routes: Routes = [
  {
    path: '',
    component: ForgotYourPasswordComponent,
    data: { title: 'Forgot Your Password' }
  }
];

export default routes;
