# CodeX Hosting

## Overview

CodeX Hosting is a modern web application built with React and TypeScript that provides high-performance hosting solutions for Discord bots, Minecraft game servers, VPS hosting, and Lavalink nodes. The application features a marketing website with detailed pricing pages, company information, legal documentation, a real-time status monitoring system, and a fully functional server management panel. Built with Vite for fast development and optimized production builds, the application leverages Tailwind CSS for consistent styling and Framer Motion for smooth animations throughout the user experience.

## Recent Changes (November 8, 2025)

### Server Management System Implementation
- **Backend Server**: Added Express.js backend server (port 3001) with WebSocket support for real-time console streaming
- **Server Storage**: Implemented file-based server persistence using servers.json for managing multiple user servers
- **Runtime Support**: Automatic setup for Node.js, Python, Bun, Java, Rust, Lua, and C# with runtime-specific default commands
- **Server Console**: Real-time console output, server control (start/stop/restart), file management, and environment variables
- **Dashboard Integration**: Dynamic server list that loads from backend, showing server status, resources, and quick actions
- **API Proxy**: Vite proxy configuration for seamless frontend-backend communication
- **Auto-Start Feature**: Servers automatically start when Discord bot tokens are added as environment variables
- **External URL Fix**: Removed hardcoded HMR clientPort configuration to allow Vite to auto-detect correct WebSocket endpoints for external URLs (Replit deployment URLs, GitHub Codespaces, etc.), fixing blank page issues when accessing from external domains

### Environment Variables & Console Improvements (November 8, 2025 - Latest)
- **Network Error Fix**: Fixed hardcoded API_URL in ServerSettings.tsx that caused network errors when adding packages
- **Console Environment Variables**: Added /api/console/exec endpoint that injects environment variables when running shell commands
- **Env Vars Display**: Added environment variables panel to console with toggle button showing all configured variables
- **Better Console UX**: Console commands now automatically have access to server environment variables
- **Settings Integration**: Added link from console to settings page for managing environment variables
- **Consolidated Settings Page**: Merged server-settings.tsx into server-startup.tsx creating one comprehensive settings page with startup command, environment variables, server information, server details, background customization, reinstall, and delete server options
- **Navigation Update**: Settings button now opens the unified settings page (/server/startup) and separate Startup nav item removed for cleaner navigation

### Discord Bot Hosting Features (November 9, 2025)
- **Automatic Package Management**: Added NODE_PACKAGES and UNNODE_PACKAGES environment variables for automatic package installation/uninstallation
- **Console Package Detection**: Automatically tracks packages installed via console commands (npm install, bun add)
- **Discord Bot Auto-Start**: Server automatically restarts when DISCORD_BOT_TOKEN or DISCORD_TOKEN environment variables are added
- **Security Hardening**: Implemented package name validation to prevent command injection attacks
- **Bun Compatibility**: Fixed package manager commands for Bun runtime to use correct flags
- **Startup Command UI**: Added "Reset to Default" button in settings to easily remove custom startup commands and return to runtime-specific defaults
- **Default Command Display**: Shows the default startup command for each runtime (Node.js, Python, Java, etc.) in the settings interface

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18.3+ with TypeScript for type-safe component development
- Vite 5.4+ as the build tool and development server, configured to run on host `0.0.0.0` port 5000
- Component-based architecture with functional components and React Hooks
- Framer Motion for declarative animations and page transitions
- React Router DOM v7+ for client-side routing with single-page application behavior

**UI/UX Design Patterns**
- Utility-first CSS approach using Tailwind CSS 3.4+ for rapid styling
- Glass morphism design pattern (backdrop blur effects with semi-transparent backgrounds)
- Responsive design using mobile-first breakpoints (sm, md, lg)
- Motion-based user interactions with scroll-triggered animations via Framer Motion's viewport detection
- Fixed background image pattern with parallax-like effects

**Routing Structure**
- Home page with hero, features, locations, pricing overview, FAQ, reviews, and CTA sections
- Dashboard page with user stats, quick actions, and server management (added November 8, 2025)
- Account Settings page for profile and connection management (added November 8, 2025)
- Dedicated pricing pages for each service type (Discord bots, Minecraft servers, VPS)
- Informational pages (About Us, Support, Terms of Service, Privacy Policy, Status Page)
- 404 Not Found page with navigation back to home
- SPA routing configuration for proper URL handling

**State Management**
- Component-level state using React useState hook
- No global state management library (Redux, Zustand, etc.) - state is localized to components
- Currency conversion handled at component level with exchange rate calculations
- Dropdown and accordion interactions managed with local state

**Code Quality & Developer Experience**
- ESLint configuration with TypeScript support for code consistency
- Strict TypeScript compiler settings with no unused locals/parameters
- Path aliases configured (`@` points to `./src`) for cleaner imports
- PostCSS with Autoprefixer for cross-browser CSS compatibility

### Component Organization

**Layout Components**
- `Navbar`: Top navigation with dropdown menus for services and company info, mobile-responsive hamburger menu
- `Footer`: Site-wide footer with link sections, social media icons, and branding
- `Hero`: Landing section with animated text rotation, feature cards, and partner marquee
- `Cta`: Call-to-action section encouraging Discord community engagement

**Feature Components**
- `Features`: Grid layout showcasing platform capabilities (performance, security, auto-recovery, etc.)
- `Locations`: Visual display of global server locations with flag icons and specifications
- `Pricing`: Multi-service pricing overview with currency conversion dropdown
- `Experience`: Slideshow carousel demonstrating dashboard features with auto-rotation
- `Reviews`: Horizontal auto-scrolling testimonial marquee with infinite loop
- `Questions`: FAQ accordion with smooth expand/collapse animations

**Page Components**
- Dashboard page (`dashboard.tsx`): User control panel with stats grid, quick actions (Create Server, Buy Resources, Earn Credits), example server cards, and help section
- Account Settings page (`account.tsx`): User profile management with username/email update forms and Discord connection integration
- Service-specific pricing pages (`discord/index.tsx`, `minecraft/index.tsx`, `vps/index.tsx`) with filterable plans
- Information pages (`aboutus.tsx`, `support.tsx`, `tos.tsx`, `privacy.tsx`, `status.tsx`)
- `NotFound.tsx`: Custom 404 error page with glass morphism styling

**Utility Components**
- Custom SVG icon components (Intel, AMD, CloudFlare, Amazon, Discord logos)
- Country flag SVG components (US, Netherlands)
- Reusable animation variants for consistent motion design

### Styling Architecture

**Design System**
- Custom background image (`/background.png`) applied globally with fixed attachment
- Color palette: Blue (#3B82F6, #60A5FA) as primary, dark backgrounds (#0c0a18), white/gray text
- Glass morphism pattern: `bg-white/10 backdrop-blur-md border border-white/20`
- Prose styling for legal content using Tailwind Typography plugin patterns

**Responsive Breakpoints**
- Mobile-first approach with Tailwind's default breakpoints
- Grid layouts adjust from 1 column (mobile) → 2 columns (md) → 3-4 columns (lg)
- Navigation switches to hamburger menu on mobile devices
- Image and card layouts stack vertically on smaller screens

### Data Management

**Multi-Currency Support**
- Base currency: USD with conversion rates for INR (₹83.5) and EUR (€0.92)
- Real-time price calculation in component render based on selected currency
- Currency selector dropdown persists across pricing sections

**Pricing Plans Data Structure**
- Discord Bot Hosting: RAM-based tiers (512MB, 1GB, 2GB) with monthly USD pricing
- Minecraft Server Hosting: Filtered by location (USA/Netherlands) and CPU type (Ampere/Intel/AMD)
- VPS Hosting: Filtered by location and CPU type with varying core/RAM/SSD configurations
- Each plan includes specifications (CPU %, RAM, storage, bandwidth, uptime guarantees)

**Content Data**
- Static feature descriptions, FAQ questions/answers, team member profiles
- Service status monitoring data with status types (Operational, Degraded, Outage, Maintenance)
- Incident history with timestamped updates
- Testimonials with customer names, roles, ratings, and review content

### Animation Strategy

**Framer Motion Patterns**
- Scroll-triggered animations using `whileInView` with `viewport={{ once: true }}`
- Stagger animations for list items and grid elements
- Hover effects with `whileHover` for buttons and interactive cards
- Page transition animations with `AnimatePresence` for conditional rendering
- Auto-rotating slideshow with interval-based state updates

### Asset Management

**Public Assets**
- Favicon and meta images for social sharing (`/favicon.ico`, `/codexserver.webp`)
- Background image (`/background.png`) loaded globally
- Service category images (Discord, Minecraft, VPS logos)
- UI screenshots for experience showcase
- Brand logo (`/codex.png`)

**Source Assets**
- Operating system logos (Ubuntu, Windows, Fedora, Debian, Kali) for VPS page
- Technology partner logos (Intel, AMD, Node.js)
- Custom SVG icons as React components for consistency

## External Dependencies

### Core Libraries
- **React 18.3+**: UI component library for building the interface
- **React Router DOM 7.9+**: Client-side routing and navigation
- **Framer Motion 12.23+**: Animation library for motion design
- **Lucide React 0.344+**: Icon library providing consistent SVG icons

### Backend Services
- **Supabase 2.57+**: Backend-as-a-Service integration (client library included but implementation not visible in codebase)
  - Likely used for authentication, database, or real-time features
  - Could be used for storing user accounts, service orders, or status monitoring data

### Development Tools
- **Vite 5.4+**: Build tool and development server
- **TypeScript 5.5+**: Type checking and enhanced IDE support
- **ESLint 9.9+**: Code linting with React Hooks and React Refresh plugins
- **Tailwind CSS 3.4+**: Utility-first CSS framework
- **PostCSS 8.4+**: CSS processing with Autoprefixer plugin

### Deployment
- **Replit**: Deployment platform (migrated from Vercel on November 8, 2025)
  - SPA routing configured to redirect all routes to index.html
  - Autoscale deployment target for production
  - Build command: `npm run build`
  - Preview command: `npm run preview`
  - Development workflow runs on port 5000 bound to 0.0.0.0 for Replit compatibility
  
**Migration Notes**
- Vite configured with explicit server and preview host bindings (0.0.0.0:5000)
- Development dependencies have low/moderate npm audit warnings (non-blocking, dev-only)
- Production builds use static files, mitigating development server vulnerabilities
- Legacy `vercel.json` retained for reference but deployment now managed through Replit configuration

### Third-Party Integration Points
- Discord community server (https://discord.gg/FnEe7xcYZQ) for user support
- Payment processing system (mentioned but not implemented in visible code)
- Social media platforms (Twitter, Instagram) linked in footer
- Monitoring systems for status page incident tracking (placeholder data suggests external monitoring service)

### Browser APIs & Standards
- ES2020+ JavaScript features
- DOM and DOM.Iterable APIs
- Modern CSS features (Grid, Flexbox, Backdrop Filter, CSS Variables)
- SVG rendering and manipulation