/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Routes } from '@angular/router';
import { ProjectsPageNoProjects } from './projects-page-no-projects';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPageNoProjects,
  },
];

export default routes;
