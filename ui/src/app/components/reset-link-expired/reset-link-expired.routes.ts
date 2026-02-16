import { Routes } from '@angular/router';
import { ResetLinkExpiredComponent } from './reset-link-expired.component';

/**
 * Routes for the Reset Link Expired error page
 */
const routes: Routes = [
  {
    path: '',
    component: ResetLinkExpiredComponent,
    data: { title: 'Reset Link Expired' }
  }
];

export default routes;
