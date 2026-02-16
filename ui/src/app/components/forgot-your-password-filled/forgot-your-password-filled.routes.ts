import { Routes } from '@angular/router';
import { ForgotYourPasswordFilledComponent } from './forgot-your-password-filled.component';

/**
 * Routes for the Forgot Your Password Filled variant
 */
const routes: Routes = [
  {
    path: '',
    component: ForgotYourPasswordFilledComponent,
    data: { title: 'Forgot Your Password' }
  }
];

export default routes;
