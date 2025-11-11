# Planning Guide

LifePilot is a comprehensive AI-enhanced health and fitness tracking application that empowers users to achieve their wellness goals through intelligent workout planning, performance tracking, and personalized nutritional recommendations.

**Experience Qualities**: 
1. **Empowering** - Users should feel in control of their fitness journey with clear, actionable data and AI-powered insights that guide without overwhelming.
2. **Trustworthy** - The interface should project reliability through precise data tracking, consistent patterns, and transparent AI recommendations that users can depend on.
3. **Motivating** - Every interaction should encourage progress through visual feedback, personal records celebration, and achievement tracking that builds momentum.

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - This application requires sophisticated state management across multiple interconnected features including user profiles, workout schedules, exercise logging, AI-powered recommendations, and personal record tracking. It needs persistent data storage, role-based access control for admin functionality, and seamless synchronization of user data.

## Essential Features

### User Authentication & Profile Management
- **Functionality**: Secure registration, login with JWT tokens, and comprehensive health profile creation including body measurements, fitness goals, and activity levels.
- **Purpose**: Establishes user identity and provides the foundation for personalized AI recommendations and cross-session data persistence.
- **Trigger**: User opens app for first time or needs to log in; user wants to update profile information.
- **Progression**: Launch app → View login/register screen → Enter credentials → Authenticate → Access dashboard → Navigate to profile → Update health metrics → Save changes → See updated recommendations
- **Success criteria**: Users can create accounts, log in successfully, maintain sessions across page refreshes, and update their profiles with all health metrics persisted to storage.

### AI-Powered Dietary Recommendations
- **Functionality**: Generate personalized daily macronutrient targets (calories, protein, fats, carbs) based on user's health profile, goals, and activity level.
- **Purpose**: Provides science-backed nutritional guidance tailored to individual body composition and fitness objectives.
- **Trigger**: User completes or updates their health profile form.
- **Progression**: Fill health profile → Submit form → AI analyzes data → Generate macro recommendations → Display nutritional targets → Save to user profile
- **Success criteria**: System generates appropriate caloric and macro targets within 10 seconds that align with user's stated goals and displays them clearly on the dashboard.

### Intelligent Workout Plan Generation
- **Functionality**: Create customized 7-day workout schedules based on user goals, available equipment, frequency preferences, and session duration using only active exercises.
- **Purpose**: Eliminates guesswork in workout planning and ensures progressive, goal-aligned training programs.
- **Trigger**: User requests a new workout plan from the Workouts page.
- **Progression**: Navigate to Workouts → Click generate plan → Enter preferences (goal, days/week, duration, equipment) → AI creates schedule → Review 7-day plan → Expand days to see exercises → Begin workout
- **Success criteria**: System generates a complete, balanced weekly schedule with appropriate exercise selection, set/rep schemes, and rest days based on user input.

### Workout Execution & Set Logging
- **Functionality**: Log individual sets with reps and weight for each exercise in the workout plan, with real-time data capture during workout sessions.
- **Purpose**: Creates a detailed performance history that tracks progress over time and enables personal record detection.
- **Trigger**: User selects a workout day and begins exercising.
- **Progression**: Open workout day → View exercise list → Perform set → Log reps and weight → Submit → System calculates volume → Display confirmation → Repeat for all sets → Complete workout
- **Success criteria**: All logged sets are saved with accurate data, associated with the correct exercise and user, and immediately reflected in workout history.

### Personal Record (PR) Tracking
- **Functionality**: Automatically calculate set volume (reps × weight) and detect when a user achieves a new personal best for any exercise.
- **Purpose**: Provides motivation through achievement recognition and gives clear evidence of strength progression.
- **Trigger**: User logs a set that exceeds their previous best volume for that exercise.
- **Progression**: Log set → System calculates volume → Compare to existing PRs → Detect new record → Display celebration notification → Update PR database → Show new PR badge
- **Success criteria**: New PRs are accurately detected, celebrated with visual feedback, and persistently stored in the user's record history.

### AI-Powered Exercise Substitution
- **Functionality**: Suggest 3 alternative exercises that target the same muscle groups with similar equipment when user wants to swap an exercise.
- **Purpose**: Accommodates equipment limitations, injury considerations, or preference variations while maintaining workout effectiveness.
- **Trigger**: User clicks swap button on any exercise in their workout plan.
- **Progression**: Click swap icon → System sends request to AI → AI analyzes exercise requirements → Generate 3 alternatives → Display in modal → User selects replacement → Update workout plan → Save change
- **Success criteria**: AI returns relevant, suitable alternatives within 10 seconds that match the original exercise's target muscles and equipment constraints.

### Administrator Exercise Management
- **Functionality**: Admin users can view, create, edit, archive, and reactivate exercises in the master exercise library with filtering by active/archived status.
- **Purpose**: Maintains data integrity while allowing exercise library updates without breaking historical workout logs.
- **Trigger**: Admin logs in and navigates to exercise management interface.
- **Progression**: Admin login → Access admin dashboard → Navigate to exercises → Search/filter exercises → Create new or edit existing → Archive unwanted exercises → Reactivate when needed
- **Success criteria**: Admins can perform all CRUD operations on exercises, archived exercises remain in database but don't appear in user-facing features, and all changes reflect immediately.

## Edge Case Handling

- **Empty States** - Display helpful onboarding messages and call-to-action buttons when users haven't created profiles, generated workouts, or logged any sets yet.
- **API Failures** - Show clear error messages with retry options when AI generation fails or backend is unreachable, with graceful degradation.
- **Invalid Form Data** - Provide real-time validation feedback on forms with specific error messages for out-of-range values (negative weights, impossible measurements).
- **Stale Authentication** - Detect expired tokens, automatically attempt refresh, and redirect to login with session restoration after re-authentication.
- **Archived Exercise References** - Handle historical workout logs gracefully when they reference archived exercises, showing exercise name even if no longer active.
- **Concurrent PR Detection** - Properly handle race conditions if multiple sets are logged simultaneously that could both be PRs.
- **Network Offline** - Display connectivity status and queue actions when offline, syncing when connection restored.

## Design Direction

The design should evoke strength, precision, and progress - feeling both technical and motivating, like a high-performance training tool used by serious athletes. The interface should be data-rich but not cluttered, using clear hierarchy to surface the most important information. Visual design should balance the scientific precision of fitness tracking with the emotional satisfaction of achievement and progress, creating an experience that feels professional and empowering rather than playful or casual.

## Color Selection

Triadic color scheme - Using three equally spaced colors on the color wheel to create a vibrant, energetic palette that represents the dynamic nature of fitness while maintaining visual balance and distinction between different UI elements and states.

- **Primary Color**: Deep Sky Blue (oklch(0.65 0.19 235)) - Represents trust, technology, and clarity. Used for primary actions, active states, and data visualizations. Communicates the intelligent, data-driven nature of the AI features.

- **Secondary Colors**: 
  - Vivid Orange (oklch(0.70 0.18 45)) - Represents energy, achievement, and motivation. Used for personal records, success states, and accent highlights.
  - Emerald Green (oklch(0.65 0.15 155)) - Represents health, growth, and progress. Used for completed workouts, positive feedback, and wellness indicators.

- **Accent Color**: Electric Violet (oklch(0.60 0.22 295)) - A vibrant highlight for calls-to-action, interactive elements, and AI-powered features. Creates visual excitement and draws attention to intelligent capabilities.

- **Foreground/Background Pairings**:
  - Background (Light Gray oklch(0.98 0 0)): Charcoal text (oklch(0.20 0 0)) - Ratio 12.3:1 ✓
  - Card (White oklch(1 0 0)): Charcoal text (oklch(0.20 0 0)) - Ratio 15.8:1 ✓
  - Primary (Deep Sky Blue oklch(0.65 0.19 235)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Secondary (Slate Gray oklch(0.90 0.01 235)): Charcoal text (oklch(0.20 0 0)) - Ratio 13.1:1 ✓
  - Accent (Electric Violet oklch(0.60 0.22 295)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Muted (Light Slate oklch(0.95 0.01 235)): Medium Gray text (oklch(0.50 0 0)) - Ratio 7.2:1 ✓

## Font Selection

Typography should convey precision, modernity, and athletic performance - using geometric sans-serifs that feel technical yet approachable. Space Grotesk will serve as the primary typeface for its balanced geometric forms and strong personality that communicates both intelligence and energy, perfect for a data-driven fitness application.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Space Grotesk Bold/32px/tight letter-spacing (-0.02em)/line-height 1.2
  - H2 (Section Headers): Space Grotesk SemiBold/24px/normal letter-spacing/line-height 1.3
  - H3 (Card Titles): Space Grotesk Medium/18px/normal letter-spacing/line-height 1.4
  - Body (Primary Text): Space Grotesk Regular/16px/normal letter-spacing/line-height 1.5
  - Body Small (Secondary Text): Space Grotesk Regular/14px/normal letter-spacing/line-height 1.5
  - Caption (Labels, Metadata): Space Grotesk Medium/12px/wide letter-spacing (0.02em)/line-height 1.4/uppercase
  - Data Display (Metrics, Numbers): Space Grotesk Bold/20-28px/tabular-nums for alignment

## Animations

Animations should feel energetic and responsive, reinforcing the sense of progress and achievement while maintaining the precision and performance focus of the application. Motion should be purposeful - celebrating achievements, guiding attention to important updates, and providing clear feedback for all interactions without feeling gratuitous or slowing down power users.

- **Purposeful Meaning**: 
  - PR Achievement: Scale-up + glow effect on the new record with confetti particles
  - Set Completion: Checkmark animation with subtle bounce
  - Workout Generation: Progressive reveal of days with stagger effect
  - Data Updates: Number counters that animate to new values
  - Navigation: Smooth page transitions with subtle slide effects

- **Hierarchy of Movement**:
  - Critical: PR celebrations, error states, success confirmations (prominent, celebratory)
  - Important: Form validation, data updates, navigation transitions (smooth, noticeable)
  - Subtle: Hover states, focus indicators, button presses (refined, quick)
  - Background: Loading states, skeleton screens (gentle, non-intrusive)

## Component Selection

- **Components**:
  - **Card**: Exercise cards, stat displays, workout day containers - subtle shadows and borders to create depth
  - **Accordion**: 7-day workout schedule with expandable days for exercise details
  - **Dialog**: Exercise swap modal, profile editing, confirmation prompts
  - **Form + Input + Label**: Health profile, body measurements, workout preferences, set logging
  - **Button**: Primary for main actions (Generate Plan, Save Profile), secondary for cancel/back, ghost for icon-only
  - **Tabs**: Dashboard navigation between Profile, Measurements, Dietary Plan sections
  - **Badge**: PR indicators, active/archived status, workout completion markers
  - **Progress**: Set completion tracking, workout progress visualization
  - **Table**: Admin exercise management list with sortable columns
  - **Select**: Dropdown for goal selection, equipment choices, exercise filters
  - **Separator**: Visual division between workout days and sections
  - **Skeleton**: Loading states for AI generation and data fetching

- **Customizations**:
  - **StatCard**: Custom component for displaying key metrics (calories, weight, PRs) with large numbers and unit labels
  - **ExerciseCard**: Custom workout exercise display with set logging interface, PR badge, and swap button
  - **PRCelebration**: Custom animated component for celebrating new personal records
  - **WorkoutDayHeader**: Custom header for accordion items showing day name, completion status, and muscle groups

- **States**:
  - Buttons: Default, hover (slight brightness increase), active (scale down 98%), disabled (opacity 50%), loading (spinner)
  - Inputs: Default, focus (ring with primary color), error (red border + message), disabled (muted background)
  - Cards: Default, hover (subtle shadow increase), selected (primary border), completed (check indicator)

- **Icon Selection**:
  - Barbell (Dumbbell) - Workout plans and exercise logging
  - TrendUp (ChartLine) - Progress tracking and PRs
  - Heart (HeartStraight) - Health profile and wellness
  - Lightning (LightningSlash) - AI-powered features
  - ArrowsClockwise - Exercise swapping
  - Plus - Add new items
  - Check - Completed sets/workouts
  - User - Profile and account
  - Gear - Settings and admin
  - MagnifyingGlass - Search exercises

- **Spacing**:
  - Page padding: p-6 (24px) on mobile, p-8 (32px) on desktop
  - Section gaps: gap-6 (24px) for major sections
  - Card spacing: p-4 (16px) internal padding, gap-4 between cards
  - Form fields: gap-4 between fields, gap-2 for label-to-input
  - Inline elements: gap-2 (8px) for related items, gap-3 (12px) for groups

- **Mobile**:
  - Stack all dashboard cards vertically on mobile (<768px)
  - Convert table-based admin interface to card list on mobile
  - Collapse workout accordion to show one day at a time
  - Bottom navigation bar for main app sections on mobile
  - Sticky headers for workout logging during active session
  - Touch-optimized button sizes (min 44px touch targets)
  - Simplified forms with native input types for better mobile keyboards
