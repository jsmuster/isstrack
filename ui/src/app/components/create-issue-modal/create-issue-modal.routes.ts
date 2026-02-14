import { Routes } from '@angular/router';
import { CreateIssueModal } from './create-issue-modal';

/**
 * Create Issue Modal module routes
 * Provides routing configuration for the issue creation modal
 */
const routes: Routes = [
  {
    path: '',
    component: CreateIssueModal,
  },
];

export default routes;
