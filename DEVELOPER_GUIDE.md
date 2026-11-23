# Developer Quick Reference Guide

## Essential Commands

```bash
# Development
npm start                  # Start dev server (http://localhost:4200)
npm test                   # Run tests
npm run build              # Production build to /docs

# Maintenance
npm install                # Install dependencies
npm update                 # Update packages
npm audit fix              # Fix security vulnerabilities
```

## CSS Quick Reference

### Using Theme Colors
```css
/* Java theme */
background: var(--color-java-primary);    /* #ED8936 */

/* Spring theme */
background: var(--color-spring-primary);  /* #68A063 */

/* Spring Boot theme */
background: var(--color-springboot-primary); /* #1EA896 */

/* Global colors */
color: var(--color-text-primary);         /* #1A202C */
background: var(--color-bg-secondary);    /* #F7FAFC */
```

### Using Spacing
```css
padding: var(--spacing-base);             /* 16px */
margin: var(--spacing-md);                /* 24px */
gap: var(--spacing-lg);                   /* 32px */
```

### Using Border Radius
```css
border-radius: var(--radius-base);        /* 8px */
border-radius: var(--radius-lg);          /* 16px */
border-radius: var(--radius-full);        /* 9999px - circular */
```

### Using Shadows
```css
box-shadow: var(--shadow-md);             /* Medium shadow */
box-shadow: var(--shadow-lg);             /* Large shadow */
```

## Animation Classes

```html
<!-- Fade animations -->
<div class="animate-fade-in">Content</div>
<div class="animate-fade-in-up">Content</div>
<div class="animate-fade-in-left">Content</div>

<!-- Scale animation -->
<div class="animate-scale-in">Content</div>

<!-- Motion animations -->
<div class="animate-bounce">Content</div>
<div class="animate-pulse">Content</div>

<!-- List stagger effect -->
<div class="animate-stagger">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Delay utilities -->
<div class="animate-fade-in animate-delay-200">Content</div>
```

## Component Structure

Every component should follow:
```
component-name/
├── component-name.component.ts       (Logic)
├── component-name.component.html     (Template)
├── component-name.component.css      (Styles)
└── component-name.component.spec.ts  (Tests)
```

## Best Practices

### CSS
- ✅ Use CSS variables for colors/spacing
- ✅ Use scoped component styles
- ✅ Follow mobile-first media queries
- ✅ Use semantic HTML elements
- ❌ Avoid inline styles
- ❌ Avoid !important flags

### TypeScript
- ✅ Use strict mode
- ✅ Add type annotations
- ✅ Use interfaces for models
- ✅ Import constants from theme.constants
- ❌ Avoid any types
- ❌ Avoid console.log in production

### Templates
- ✅ Use *ngFor with trackBy
- ✅ Use proper ARIA labels
- ✅ Use semantic HTML
- ✅ Handle loading/error states
- ❌ Avoid complex logic in templates
- ❌ Avoid multiple *ngIf on same element

## File Structure Guidelines

```
New Feature?
│
├─ Component-based → src/app/components/feature-name/
├─ Service/Logic → src/app/services/feature.service.ts
├─ Model/Interface → src/app/models/feature.model.ts
├─ Constants → src/app/constants/feature.constants.ts
└─ Styling → component.css (scoped) or themes/*.css (global)
```

## Debugging

### Browser DevTools
```javascript
// Inspect element styles
// Elements tab → Styles panel shows CSS variables

// Check animations
// Animations panel → Slow down to 10% for testing

// Network tab
// Check bundle size and asset loading

// Console
// Check for errors and warnings
```

### Common Issues

**CSS not applying?**
- Check CSS import order (imports must be first)
- Verify scoped vs global styling
- Check CSS specificity

**Animation not working?**
- Verify animation class is spelled correctly
- Check if prefers-reduced-motion is enabled
- Ensure element has sufficient height/width

**Layout broken on mobile?**
- Test with DevTools device emulation
- Check media queries are correct
- Verify padding/margin values

## Responsive Design Breakpoints

```css
/* Extra small: 360px and up */
@media (max-width: 360px) { }

/* Small: 480px and up */
@media (max-width: 480px) { }

/* Medium: 768px and up */
@media (max-width: 768px) { }

/* Large: 1024px and up */
@media (max-width: 1024px) { }

/* Extra large: 1280px and up */
@media (max-width: 1280px) { }

/* 2XL: 1536px and up */
@media (max-width: 1536px) { }
```

## Accessibility Checklist

- [ ] All images have alt text
- [ ] All buttons have descriptive labels
- [ ] Color is not the only means of conveying information
- [ ] Keyboard navigation works
- [ ] Focus styles are visible
- [ ] Form inputs have labels
- [ ] Error messages are clear
- [ ] Animations respect prefers-reduced-motion

## Performance Tips

- 🚀 Use OnPush change detection where possible
- 🚀 Lazy load routes when possible
- 🚀 Use trackBy in *ngFor
- 🚀 Unsubscribe from observables (use async pipe)
- 🚀 Lazy load images
- 🚀 Keep components small and focused

## Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature description"
git push -u origin feature/new-feature

# Code review → merge to main
git checkout main
git merge feature/new-feature
git push

# Production build
npm run build
git add docs/
git commit -m "build: production release"
git push
```

## Common Git Commands

```bash
git status                    # Check status
git diff                      # View changes
git log --oneline             # View commit history
git reset HEAD~1              # Undo last commit
git checkout -- src/          # Discard changes
git stash                     # Temporarily save changes
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/component.spec.ts'
```

## Type Definitions

```typescript
// Use proper typing
interface ComponentConfig {
  title: string;
  items: Item[];
  isActive: boolean;
}

// Type service methods
getData(): Observable<Data[]> {
  return this.http.get<Data[]>('/api/data');
}

// Type component properties
@Input() data: Data[];
@Output() onChange = new EventEmitter<Event>();
@ViewChild('ref') ref: ElementRef;
```

## Useful Links

- [Angular Docs](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Web Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Fonts](https://fonts.google.com)

---

**Last Updated**: June 17, 2025  
**For full documentation, see PROJECT_STRUCTURE.md and DEPLOYMENT.md**
