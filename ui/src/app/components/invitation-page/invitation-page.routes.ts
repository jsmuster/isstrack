/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Routes } from '@angular/router';
import { InvitationPage } from './invitation-page';

/**
 * Invitation module routes
 * Provides routing configuration for the invitation page
 */
const routes: Routes = [
  {
    path: '',
    component: InvitationPage,
  },
];

export default routes;
