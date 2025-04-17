# ⚡️ Smart Meter App

This is a full-stack Smart Meter monitoring system, consisting of:

- 📱 **Frontend**: React Native app built with [Expo](https://expo.dev/)
- 🛠️ **Backend**: Node.js REST API, included as a Git **submodule**

---

---

## 📦 Tech Stack

### Frontend
- React Native
- Expo
- React Navigation
- Axios

### Backend
- Node.js
- Express.js
- SQLite
- Prisma

---

## 🔧 Prerequisites

Before getting started, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

---

## 🔽 Clone the Project (with Submodules)

```bash
git clone --recurse-submodules https://github.com/Sandamele/smart-meter-react-native.git
cd smart-meter-react-native
```

## Start the backend
```bash
cd backend
npm install
cp .env.example .env   # Configure your environment variables
npm run develop
```

## Start the frontend
```bash
cd ..
npm install
npx expo start
```

## Updating the Backend Submodule
```bash
cd backend
git pull origin main

cd ..
git add backend
git commit -m "Update backend submodule"
git push
```

## Pushing Changes

### Push frontend changes (main repo):
```bash
git add .
git commit -m "Update frontend UI"
git push origin main
```

### Push backend changes (inside the submodule):
```bash
cd backend
git add .
git commit -m "Fix backend API endpoint"
git push origin main
```
### Then update the submodule reference in the main repo:
```bash
cd ..
git add backend
git commit -m "Update submodule pointer"
git push origin main
```