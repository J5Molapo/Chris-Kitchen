# Chef Christoffel

Chef Christoffel is a luxury dining mobile app concept built with Expo and React Native. It presents a curated tasting-menu experience for guests and a streamlined kitchen board for chefs, with persistent local storage so menu updates and orders remain available across app restarts.

## Overview

This app is designed around a premium private-dining experience. Guests browse a short, refined tasting menu with a fixed structure:

- Starters
- Main
- Dessert

The chef side manages orders, kitchen alerts, and the menu editor so the tasting experience can be updated without losing the current state.

## Features

- Premium dark luxury UI inspired by fine dining and boutique hospitality
- Landing screen with branded flame logo treatment
- Customer tasting menu with three-course structure
- Course labels updated for the guest flow: Starters, Main, Dessert
- Dish selection logic capped to a concise tasting experience
- Menu editing with course assignment by category
- Order tracking board with live status updates
- Kitchen alerts for outstanding or overdue service items
- Persistent local data using AsyncStorage so menu and orders are not lost between sessions
- Form validation for the chef login flow
- Responsive Expo + React Native experience for mobile and web preview

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- React Native Paper
- TypeScript
- AsyncStorage for persisted local app state

## Project Structure

- `app/` – app screens, layout, and store logic
- `app/index.tsx` – landing / entry screen
- `app/menu.tsx` – guest tasting menu experience
- `app/preferences.tsx` – taste preference and confirmation flow
- `app/chef-login.tsx` – chef login form with validation
- `app/chef.tsx` – service board, order handling, and menu editor
- `app/store.ts` – app state, menu data, persistence helpers, and order logic
- `app/_layout.tsx` – theme and navigation setup
- `app/LuxuryPage.tsx` – cinematic premium screen transition wrapper
- `Figma Design/` – design assets and brand references

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/J5Molapo/Chris-Kitchen.git
   cd Chris-Kitchen
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

4. Run it with one of the following:
   - Expo Go
   - Android emulator
   - iOS simulator
   - web preview using Expo web

## Available Scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Demo Chef Access

Use the validated chef credentials for the login form:

- Email: `chef@christoffel.co.za`
- Password: `Chef@2026!`

## Data Persistence

The app uses local persistence so user-facing and chef-side information is retained between app restarts.

This includes:

- saved menu updates
- order queue entries
- kitchen alert status
- chef session preference metadata

## Change Log

### Version 1.0.0 – Current

- Reworked the app around a luxury fine-dining flow
- Simplified the guest menu to a three-course tasting experience
- Renamed the guest-facing order flow to Starters, Main, and Dessert
- Added persistent local storage for orders and menu updates
- Removed the strict secure lock and kept the app practical for local data retention
- Added chef login validation for proper email and password checks
- Added category-based course assignment in the menu editor
- Kept the chef dashboard focused on active orders, kitchen alerts, and quick menu changes

### Iteration history

- Initial concept centered on premium cinematic transitions and luxury brand visuals
- Brand identity refined with the flame PNG asset and boutique hospitality styling
- Menu flow tightened to focus on a shorter, more curated tasting experience
- Dessert card styling was elevated to visually distinguish the final course
- Course naming was updated to align with the guest experience and the tasting structure
- Chef access and menu logic were progressively improved to support a realistic kitchen workflow

## Notes

This project is a front-end prototype and experience demo, not a full production commerce or backend system. The current implementation focuses on UX, menu logic, and local persistence so the app behaves like a realistic dining management flow while remaining easy to run and iterate on.

## License

This project is currently intended for local demonstration and development use within the project scope.
