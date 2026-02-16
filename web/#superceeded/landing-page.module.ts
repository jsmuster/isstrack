import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';

/**
 * Landing Page Module
 * 
 * Encapsulates the landing page component and its dependencies.
 * This module can be imported into the main app module or used for lazy loading.
 */
@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LandingPageComponent
  ]
})
export class LandingPageModule { }
