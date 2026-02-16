import { Routes } from '@angular/router';
import { CheckYourEmailComponent } from './check-your-email.component';

/**
 * Routes for the Check Your Email confirmation page
 */
const routes: Routes = [
  {
    path: '',
    component: CheckYourEmailComponent,
    data: { title: 'Check Your Email' }
  }
];

export default routes;
