# Create New Project Modal Component

## Overview

The `CreateNewProjectModal` is an Angular standalone component that provides a modal dialog for creating new projects in the IssTrack application. It includes form fields for project configuration, member invitations, and advanced settings.

## Features

- **Project Information**
  - Project name (required)
  - Description with character counter (max 500 characters)
  
- **Visibility Control**
  - Private: Only invited members can access
  - Public: Anyone in the workspace can view

- **Member Management**
  - Display project owner (current user)
  - Search and invite members
  - Add/remove members from invitation list
  - Helper text for adding more members later

- **Advanced Settings**
  - Button to access advanced configuration options

- **Form Validation**
  - Required field validation
  - Real-time character counting
  - Submit button disabled until form is valid

## Component Structure

### Files

- `create-new-project-modal.component.ts` - Component logic and state management
- `create-new-project-modal.component.html` - Template with semantic HTML and accessibility
- `create-new-project-modal.component.scss` - Styles with CSS variables and responsive design

### Imports

```typescript
import { CreateNewProjectModalComponent } from 'path/to/create-new-project-modal/create-new-project-modal.component';
```

## Usage

### Basic Usage

```html
<app-create-new-project-modal></app-create-new-project-modal>
```

### In a Parent Component

```typescript
import { Component } from '@angular/core';
import { CreateNewProjectModalComponent } from './components/create-new-project-modal/create-new-project-modal.component';

@Component({
  selector: 'app-root',
  template: `<app-create-new-project-modal></app-create-new-project-modal>`,
  imports: [CreateNewProjectModalComponent]
})
export class AppComponent {}
```

## Component API

### Signals

- `descriptionCharCount` - Current character count in description field
- `selectedMembers` - Array of selected member IDs
- `availableMembers` - List of members available for invitation
- `memberSearchTerm` - Current search term for member filtering

### Methods

- `toggleMemberSelection(memberId: string)` - Toggle member selection
- `isMemberSelected(memberId: string)` - Check if member is selected
- `getSelectedMemberNames()` - Get names of selected members
- `onCreateProject()` - Handle project creation
- `onCancel()` - Handle cancellation
- `onAdvancedSettings()` - Handle advanced settings button click

### Properties

- `projectForm: FormGroup` - Reactive form for project data
- `descriptionMaxChars: number` - Maximum characters for description (500)
- `currentUser` - Object containing current user information

## Form Fields

### projectName
- **Type**: String
- **Required**: Yes
- **Validators**: Required, minLength(1)

### description
- **Type**: String
- **Required**: No
- **Max Length**: 500 characters
- **Note**: Character counter updates in real-time

### visibility
- **Type**: String ('private' | 'public')
- **Default**: 'private'

### advancedSettings
- **Type**: Boolean
- **Default**: false

## Accessibility Features

- ✅ Semantic HTML (form, fieldset, legend, label)
- ✅ ARIA attributes (aria-required, aria-label, aria-describedby, role)
- ✅ Keyboard navigation support
- ✅ Focus management with visible outlines
- ✅ Form validation feedback
- ✅ Image alt attributes
- ✅ Proper heading hierarchy

## Styling

The component uses:
- CSS variables from `src/styles/variables.scss`
- SCSS nested structure for maintainability
- Focus and hover states for better UX
- Responsive design considerations
- Shadow effects for modal prominence

## TODOs

The following TODOs in the code indicate areas for future implementation:

1. **Modal State Management** - Emit events or integrate with service to handle modal open/close
2. **Project Creation Service** - Implement service call to create project with form data
3. **Member Search API** - Connect to backend for dynamic member search
4. **Advanced Settings** - Implement advanced settings navigation/submenu
5. **Form Error Handling** - Add error message display for failed submissions

## Dependencies

- `@angular/core` - Core Angular framework
- `@angular/common` - Common Angular directives
- `@angular/forms` - Reactive Forms module
- `src/styles/variables.scss` - Global CSS variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

1. Add form error messages and validation feedback
2. Implement member search with backend integration
3. Add loading state during project creation
4. Integrate with modal service for better state management
5. Add keyboard shortcuts (ESC to close)
6. Implement permission levels for members
7. Add project template selection
8. Add description markdown preview

## Notes

- Images are expected to be in `assets/images/` directory
- Form values are logged to console on submit (replace with actual service call)
- Character counter updates on every keystroke (uses Signals for reactivity)
- Modal positioning is absolute, requires parent container context
