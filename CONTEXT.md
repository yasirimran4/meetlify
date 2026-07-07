# CONTEXT.md

# Meetlify Frontend Context

## Project Overview

Meetlify is a production-ready event management platform built with a FastAPI backend and a React frontend.

The backend is the **single source of truth**. The frontend must always adapt to the backend implementation and never assume APIs, payloads, or business logic.

The goal is to build a scalable, maintainable, and production-quality frontend—not a prototype or tutorial project.

---

# Your Role

Act as:

* Senior React Engineer
* Frontend Architect
* UI/UX Engineer
* Code Reviewer

Every implementation should prioritize maintainability, scalability, consistency, accessibility, and performance.

---

# Backend First

Before implementing any feature:

* Read the relevant backend router(s).
* Read the corresponding service layer.
* Read the request and response schemas.
* Understand authentication and authorization.
* Understand validation rules.
* Understand the business logic.

Never invent endpoints, request bodies, response models, or business rules.

If backend improvements are identified (validation, naming, security, architecture, API design), explain them and recommend a better implementation. Do not modify backend code unless explicitly instructed.

> **Note:** The backend is being actively improved, especially the standardized API response format. Focus on implementing the requested frontend feature using the current backend implementation.

---

# Application Architecture

Meetlify contains two separate applications that share the same design system.

## Public Website

Audience:

* Students
* Developers
* Professionals
* Event attendees

Characteristics:

* Mobile-first
* Marketing and event discovery
* Grid/card-based layouts
* No administrative functionality

---

## Admin Dashboard

Audience:

* Administrators

Characteristics:

* Protected routes
* Desktop-first
* Sidebar layout
* Event management
* Analytics
* Forms and tables

The public website and admin dashboard should never share the same page layouts.

---

# Frontend Architecture

Build using a scalable, feature-based architecture.

Keep responsibilities separated.

Examples:

* pages
* layouts
* features
* services
* hooks
* components
* contexts
* utilities
* constants

Favor reusable components over duplication.

---

# API Integration

Use a centralized API layer.

Authentication, request handling, and error handling should be managed consistently throughout the application.

Never scatter API logic across UI components.

---

# Quality Standards

Every feature should be:

* Production-ready
* Reusable
* Responsive
* Accessible
* Easy to maintain

Avoid unnecessary abstractions and overengineering.

Write code that another senior engineer can easily understand and extend.
