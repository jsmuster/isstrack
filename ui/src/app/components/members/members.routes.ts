/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Routes } from '@angular/router';
import { Members } from './members';

/**
 * Members module routes
 * Provides routing configuration for the members management section
 */
const routes: Routes = [
  {
    path: '',
    component: Members,
  },
];

export default routes;
