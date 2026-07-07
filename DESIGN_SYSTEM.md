# DESIGN_SYSTEM.md

# Meetlify Design System

## Design Goal

Meetlify should feel like a modern SaaS product built by experienced engineers.

The interface must be clean, professional, consistent, and highly usable.

Every page should feel like part of the same product.

---

# Design Inspiration

The visual quality should be comparable to products such as:

* Linear
* Vercel
* GitHub
* Stripe Dashboard
* Clerk
* Supabase

Avoid interfaces that look template-based, AI-generated, overly decorative, or cartoonish.

---

# Theme

* Light Theme by default.
* Support Dark Theme using the same design tokens.
* Both themes should feel intentionally designed.

---

# Color System

Use semantic colors only.

* Primary → Blue
* Neutral → Slate / Gray
* Success → Green
* Warning → Amber
* Error → Red

Avoid random accent colors.

---

# Typography

* Font: Inter
* Clear hierarchy for headings, body text, captions, and labels.
* Use consistent font sizes and weights throughout the application.

---

# Spacing

Follow an 8px spacing system.

Examples:

* 8
* 16
* 24
* 32
* 40
* 48
* 64

Maintain consistent spacing across all pages.

---

# Icons

Use:

* Lucide React (preferred)
* React Icons only for brand-specific icons

Never use:

* Emoji
* Cartoon icons
* AI-generated illustrations as interface elements

Icons should communicate actions, not decoration.

---

# Components

All reusable components should follow a consistent style.

This includes:

* Buttons
* Inputs
* Cards
* Tables
* Badges
* Dialogs
* Dropdowns
* Toasts

Do not redesign components for individual pages.

---

# Public Website

The public experience should be:

* Mobile-first
* Simple
* Fast
* Focused on browsing events

Use responsive cards and grid layouts where appropriate.

---

# Admin Dashboard

The admin experience should be:

* Desktop-first
* Information-dense
* Optimized for productivity

Use dashboards, tables, forms, filters, analytics, and management views.

Do not reuse public page layouts inside the admin dashboard.

---

# Responsive Design

Support:

* Desktop
* Laptop
* Tablet
* Mobile

Layouts should adapt gracefully without horizontal scrolling.

---

# Accessibility

Every interface should include:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Proper labels
* High color contrast
* Accessible dialogs and forms

Accessibility is a core requirement.

---

# User Experience

Every page should immediately answer:

* Where am I?
* What can I do?
* What should I do next?

Prioritize clarity over visual effects.

Reduce cognitive load.

---

# Feedback

Provide clear feedback for user actions.

Use:

* Toast notifications
* Inline validation messages
* Confirmation dialogs for destructive actions

Never expose raw backend error messages to users.

---

# Final Principle

Every new page must reuse the existing design language and components so the entire application feels cohesive, polished, and production-ready.
