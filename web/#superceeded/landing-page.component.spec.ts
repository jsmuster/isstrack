import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('FAQ functionality', () => {
    it('should initialize FAQ items with collapsed state', () => {
      const faqIds = component.faqItems.map(item => item.id);
      faqIds.forEach(id => {
        expect(component.expandedFaqItems[id]).toBe(false);
      });
    });

    it('should toggle FAQ item expansion', () => {
      const itemId = 1;
      expect(component.expandedFaqItems[itemId]).toBe(false);
      
      component.toggleFaqItem(itemId);
      expect(component.expandedFaqItems[itemId]).toBe(true);
      
      component.toggleFaqItem(itemId);
      expect(component.expandedFaqItems[itemId]).toBe(false);
    });
  });

  describe('Testimonials', () => {
    it('should have correct number of testimonials', () => {
      expect(component.testimonials.length).toBe(6);
    });

    it('should have testimonials with required properties', () => {
      component.testimonials.forEach(testimonial => {
        expect(testimonial.id).toBeDefined();
        expect(testimonial.initials).toBeDefined();
        expect(testimonial.name).toBeDefined();
        expect(testimonial.role).toBeDefined();
        expect(testimonial.quote).toBeDefined();
      });
    });
  });

  describe('Navigation methods', () => {
    it('should call navigateToSignIn', () => {
      spyOn(console, 'log');
      component.navigateToSignIn();
      expect(console.log).toHaveBeenCalledWith('Navigate to sign in');
    });

    it('should call navigateToGetStarted', () => {
      spyOn(console, 'log');
      component.navigateToGetStarted();
      expect(console.log).toHaveBeenCalledWith('Navigate to get started');
    });

    it('should call playVideoDemo', () => {
      spyOn(console, 'log');
      component.playVideoDemo();
      expect(console.log).toHaveBeenCalledWith('Play video demo');
    });
  });
});
