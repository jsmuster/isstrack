import { Routes } from '@angular/router';
import { InviteMembers } from './invite-members';

/**
 * Invite members module routes
 * Provides routing configuration for the invite members page
 */
const routes: Routes = [
  {
    path: '',
    component: InviteMembers,
  },
];

export default routes;
