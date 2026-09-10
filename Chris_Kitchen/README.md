# Chef Christoffel

Chef Christoffel is a luxury dining mobile app concept built with Expo and React Native. It gives guests a curated tasting-menu experience with preference-based course selection and gives the chef a private dashboard for order management, kitchen alerts, and menu editing.

## Features

- Elegant landing experience inspired by fine dining branding
- Guest menu browsing with selectable courses
- Preference filters such as Vegetarian, High Protein, No Spice, Quick Pick, and Seasonal
- Chef login portal with demo authentication
- Kitchen service board for order tracking and status updates
- Menu editor for adding, editing, and removing dishes
- Dark premium UI built with React Native Paper

## Tech Stack

- Expo
- React Native
- Expo Router
- React Native Paper
- TypeScript

## Project Structure

- `app/` – app screens and state logic
- `app/index.tsx` – home screen
- `app/menu.tsx` – guest menu selection
- `app/preferences.tsx` – dining preference settings
- `app/chef-login.tsx` – chef authentication screen
- `app/chef.tsx` – chef dashboard and menu editor
- `app/store.ts` – in-memory menu and order store
- `app/_layout.tsx` – global theme and stack navigation

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npx expo start
   ```

3. Open the app with:
   - Expo Go on your mobile device
   - Android emulator
   - iOS simulator
   - Web browser via Expo web support

## Demo Chef Login

- Email: `chef@chriskitchen.com`
- Password: `kitchen123`

## Available Scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Notes

This project is a front-end prototype/demo experience. The data is managed locally in memory and is intended to demonstrate the dining flow, chef workflow, and UI design rather than a production backend integration.
