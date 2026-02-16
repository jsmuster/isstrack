import { Routes } from '@angular/router';
import { PasswordUpdatedComponent } from './password-updated.component';

/**
 * Routes for the Password Updated success confirmation page
 */
const routes: Routes = [
  {
    path: '',
    component: PasswordUpdatedComponent,
    data: { title: 'Password Updated' }
  }
];

export default routes;
