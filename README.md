# PRchive

A gym tracker for lifters who want to see whether they are actually getting stronger. Set up your weekly split once, log every session with sets, reps and weights, and track your progress per exercise on a chart. It also reminds you before your gym subscription runs out.

**Live demo:** https://prchive.netlify.app

## Features

- **Weekly split.** Seven day cards with a name and a list of exercises per day. Open a day to see its exercises, or switch to edit mode to rename days and add or remove exercises.
- **Log a session.** Pick the day, and the exercises are preloaded from your split. Each set has weight and reps, and a "Previous" column shows what you lifted last time.
- **Progress charts.** Pick an exercise and see the top set of every session on a line chart, with your current set, the change since your first session and your personal record.
- **Subscription reminders.** Enter your renewal date, see the days left, and choose reminders for 7, 3 and 1 day before. A popup shows up when you open the app inside a reminder window.
- **kg / lb switch.** One setting for the whole app. Weights are always stored in kg, so switching units never changes your history.
- **Dark and light themes**, remembered between visits.
- **Responsive layout** that works on desktop and on phones.

## Tech stack

- React 19 and Vite
- React Router
- Recharts
- Plain CSS with custom properties for the themes
- `localStorage` for saving data, with no backend
- Deployed on Netlify
