/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Routes } from '@angular/router';
import { ProjectsPageProjectList } from './projects-page-project-list';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPageProjectList,
  },
];

export default routes;
