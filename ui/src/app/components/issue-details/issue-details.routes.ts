/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Routes } from '@angular/router';
import { IssueDetails } from './issue-details';

/**
 * Issue Details module routes
 * Provides routing configuration for the issue details section
 */
const routes: Routes = [
  {
    path: '',
    component: IssueDetails,
  },
];

export default routes;
