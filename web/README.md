# PlanClock Landing Page Component

Angular component for the PlanClock project management tool landing page.

## Component Structure

### Files

- **landing-page.component.ts** - Component logic and state management
- **landing-page.component.html** - Template markup with semantic HTML
- **landing-page.component.css** - Styles with CSS variables for theming
- **landing-page.component.spec.ts** - Unit tests
- **landing-page.module.ts** - Module definition for importing/exporting

## Features

### Sections

1. **Hero Section**
   - Sticky header with navigation
   - Hero headline and description
   - Call-to-action buttons
   - Feature showcase with images

2. **Approach Section**
   - Comparison of old way vs PlanClock way
   - Feature highlights with visual indicators

3. **Views Section**
   - Task List view showcase
   - Kanban Board view showcase
   - Feature breakdowns for each view

4. **Collaboration Section**
   - Team invitation features
   - Task assignment capabilities
   - Comments and communication tools

5. **Testimonials Section**
   - 6 customer testimonials with initials and roles
   - Dynamic testimonial display with *ngFor

6. **FAQ Section**
   - 5 frequently asked questions
   - Expandable/collapsible items with animation
   - Toggle state management

7. **Call-to-Action Section**
   - Final conversion prompt
   - Sign in / Get started buttons

8. **Footer**
   - Copyright information
   - Navigation links

## Component API

### Methods

#### `toggleFaqItem(itemId: number): void`
Toggles the expansion state of a specific FAQ item.

```typescript
toggleFaqItem(1); // Expand/collapse FAQ item with id 1
```

#### `navigateToSignIn(): void`
Handles navigation to the sign in page.

#### `navigateToGetStarted(): void`
Handles navigation to the get started/signup flow.

#### `playVideoDemo(): void`
Initiates video demo playback.

### Properties

#### `testimonials: Array`
Array of testimonial objects with the following structure:
```typescript
{
  id: number;
  initials: string;
  name: string;
  role: string;
  quote: string;
}
```

#### `faqItems: Array`
Array of FAQ objects with the following structure:
```typescript
{
  id: number;
  question: string;
  answer: string;
}
```

#### `expandedFaqItems: Object`
State object tracking which FAQ items are expanded.
Key: FAQ item id, Value: boolean (expanded/collapsed)

## Usage

### Import Module
```typescript
import { LandingPageModule } from './landing-page/landing-page.module';

@NgModule({
  imports: [LandingPageModule]
})
export class AppModule { }
```

### Use Component
```html
<app-landing-page></app-landing-page>
```

### Route Configuration
```typescript
const routes: Routes = [
  { path: '', component: LandingPageComponent }
];
```

## Styling

The component uses CSS variables for consistent theming. All colors, spacing, and typography are defined as custom properties in `:host`.

### Key CSS Variables

**Colors:**
- `--color-white` - White background
- `--color-royalblue` - Primary action color
- `--color-gray-200` - Dark text
- `--color-dimgray` - Secondary text

**Spacing:**
- `--padding-*` - Padding values (0, 4, 8, 16, 24, 32, 80, etc.)
- `--gap-*` - Gap values (4, 12, 16, 24, 32, 64)

**Typography:**
- `--fs-*` - Font sizes (12, 14, 16, 18, 20, 24, 36)
- `--font-inter` - Font family (Inter)

**Borders & Shadows:**
- `--br-*` - Border radius (8, 16, 9999)
- `--shadow-drop` - Drop shadow

## Accessibility

The component includes semantic HTML and ARIA attributes:

- Proper heading hierarchy (h1, h2, h3)
- ARIA labels on buttons
- ARIA expanded/controls for FAQ toggle
- Role attributes on nav and footer
- Image alt text
- Loading lazy attribute for images

## Responsive Design

Responsive breakpoints:
- Desktop: Full width layout
- Tablet (1024px): Adjusted padding
- Mobile (768px): Stacked layout for grids

## Assets

The component expects the following image assets in `./public/`:

- `div.svg` - Logo
- `img@2x.png` - Hero screenshot
- `i.svg`, `i1.svg`, `i2.svg`, `i3.svg` - Feature icons
- `div1.svg`, `div2.svg` - Comparison icons
- `Projects-Project-Issue-List-Kanban-1@2x.png` - Task list view
- `div3@2x.png` - Kanban view
- `i4.svg`, `i5.svg`, `i6.svg`, `i7.svg`, `i8.svg`, `i9.svg` - View icons
- `div4.svg`, `div5.svg`, `div6.svg` - Feature illustrations
- `i10.svg` - Testimonial avatar
- `i11.svg` - FAQ toggle icon

## Future Enhancements

- [ ] Implement actual navigation in navigateToSignIn()
- [ ] Implement actual navigation in navigateToGetStarted()
- [ ] Add video modal for playVideoDemo()
- [ ] Add form validation
- [ ] Add email subscription handling
- [ ] Add analytics tracking
- [ ] Internationalization support
- [ ] Dark mode support

## Testing

Run unit tests:
```bash
ng test
```

The component includes tests for:
- Component initialization
- FAQ toggle functionality
- Testimonial data validation
- Navigation method calls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All image paths are relative to `./public/`
- TODO items in the component should be implemented based on your routing setup
- The component uses `*ngFor` for testimonials, requires CommonModule
