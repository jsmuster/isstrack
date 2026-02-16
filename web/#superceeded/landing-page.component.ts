import { Component, OnInit } from '@angular/core';

/**
 * PlanClock Landing Page Component
 * 
 * This component serves as the main landing page for the PlanClock project management tool.
 * It showcases the product's key features including:
 * - Simple project management interface
 * - Task list and Kanban board views
 * - Team collaboration features
 * - User testimonials
 * - FAQ section
 */
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  
  // FAQ state management
  expandedFaqItems: { [key: number]: boolean } = {};

  // Testimonials data
  testimonials = [
    {
      id: 1,
      initials: 'SJ',
      name: 'Sarah Johnson',
      role: 'Agency Owner',
      quote: 'We onboarded our entire team in less than a day. No training sessions, no confusion. Just clean tasks and a board view that everyone instantly understood.'
    },
    {
      id: 2,
      initials: 'MC',
      name: 'Michael Chen',
      role: 'Ops Lead',
      quote: 'Finally, a tool without the clutter. List view for planning, Kanban for execution. Clear assignments and priorities. That\'s literally all we needed.'
    },
    {
      id: 3,
      initials: 'ER',
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      quote: 'We switched from a bloated PM tool to PlanClock and never looked back. Comments keep context where it belongs, and the interface just stays out of our way.'
    },
    {
      id: 4,
      initials: 'DK',
      name: 'David Kim',
      role: 'Startup Founder',
      quote: 'The simplicity is the feature. No endless settings, no feature creep. Just tasks, assignments, and a board. Perfect for our small startup team.'
    },
    {
      id: 5,
      initials: 'LT',
      name: 'Lisa Thompson',
      role: 'Freelance Designer',
      quote: 'I\'ve tried them all. PlanClock is the only one that doesn\'t make project management feel like a project itself. Fast, focused, and friction-free.'
    },
    {
      id: 6,
      initials: 'JM',
      name: 'James Martinez',
      role: 'Team Lead',
      quote: 'Our team loves how quick it is to create tasks and move them across the board. No learning curve, no resistance. Everyone\'s on board from day one.'
    }
  ];

  // FAQ items
  faqItems = [
    {
      id: 1,
      question: 'Is PlanClock really that simple?',
      answer: 'Yes. PlanClock includes task creation, assignments, priorities, due dates, comments, list view, and Kanban board. That\'s the core workflow most teams actually use every day.'
    },
    {
      id: 2,
      question: 'Can I switch between List and Kanban?',
      answer: 'Absolutely. Switch views instantly with one click. The same tasks appear in both views—no setup, no syncing, no confusion.'
    },
    {
      id: 3,
      question: 'Can I assign tasks to teammates?',
      answer: 'Yes. Invite your team via email, assign tasks to specific people, and everyone sees their assignments clearly. Full visibility, zero ambiguity.'
    },
    {
      id: 4,
      question: 'Do you support priorities and due dates?',
      answer: 'Yes. Set priorities (high, medium, low) and due dates on any task. Sort and filter by priority to keep your team focused on what matters most.'
    },
    {
      id: 5,
      question: 'Is there a free plan?',
      answer: 'Yes. PlanClock is free to start with no credit card required. Upgrade to a paid plan when your team grows or you need additional features.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.initializeFaqState();
  }

  /**
   * Initialize FAQ expansion state
   */
  private initializeFaqState(): void {
    this.faqItems.forEach(item => {
      this.expandedFaqItems[item.id] = false;
    });
  }

  /**
   * Toggle FAQ item expansion
   * @param itemId - The ID of the FAQ item to toggle
   */
  toggleFaqItem(itemId: number): void {
    this.expandedFaqItems[itemId] = !this.expandedFaqItems[itemId];
  }

  /**
   * Navigate to sign in
   */
  navigateToSignIn(): void {
    // TODO: Implement navigation to sign in page
    console.log('Navigate to sign in');
  }

  /**
   * Navigate to get started
   */
  navigateToGetStarted(): void {
    // TODO: Implement navigation to signup/onboarding
    console.log('Navigate to get started');
  }

  /**
   * Play video demo
   */
  playVideoDemo(): void {
    // TODO: Implement video demo playback
    console.log('Play video demo');
  }
}
