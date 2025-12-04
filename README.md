# Project: Hey Chef
A hands-free, voice-controlled recipe assistant built with React, TypeScript, Ionic, and Capacitor.Hey Chef lets users navigate recipes, ask ingredient questions, and manage timers using only their voice. It is designed for hands-busy cooking environments where touch interaction is difficult or inconvenient.

---

## Features

### **Voice-controlled navigation**
- Start a recipe  
- Go to next / previous step  
- Repeat instructions  
- Ask **“How much ___ do I need?”**

### **Hands-free timer management**
- Set, cancel, pause, resume, or adjust timers  
- Supports natural phrasing (e.g., “set a two-minute timer”)  

### **Wake-word activation**
- Tap the microphone once  
- Say **“Hey Chef”** to enter continuous listening mode  

### **Simple, clean UI**
- Highlighted current step  
- Minimal home screen  
- Animated microphone feedback  

### **Local recipe data model**
- Stored in TypeScript  
- Fast lookup for ingredient queries  

---

## Project Structure

```
src/
│
├── components/
│   ├── ExploreContainer.css
│   ├── ExploreContainer.tsx
│   └── VoiceListener.tsx
│
├── models/
│   └── recipes.ts
│
├── pages/
│   ├── Home.css
│   ├── Home.tsx
│   ├── Listening.tsx
│   ├── RecipeDetail.tsx
│   └── RecipeView.tsx
│
├── services/
│   ├── commandParser.ts
│   ├── TimerService.ts
│   └── voiceService.ts
│
├── theme/
│   └── variables.css
│
├── App.tsx
├── main.tsx
├── App.test.tsx
├── setupTests.ts
└── vite-env.d.ts
```

---

## Folder Overview

### **components/**
Reusable UI elements  
- `VoiceListener.tsx` — microphone UI + animations  
- `ExploreContainer.tsx` — basic Ionic template  

### **models/**
- `recipes.ts` — recipe interface + stored recipe list  

### **pages/**
Screens the user interacts with  
- `Home.tsx` — search + recipe list  
- `RecipeView.tsx` — ingredients + steps + microphone button  
- `RecipeDetail.tsx` — recipe description  
- `Listening.tsx` — listening screen feedback  

### **services/**
Core logic  
- `voiceService.ts` — speech recognition  
- `commandParser.ts` — interprets spoken commands  
- `TimerService.ts` — timer logic  

### **theme/**
- Global Ionic styling  

### **App.tsx**
Routing + primary app structure  

---

## How Voice Commands Work

1. User selects a recipe  
2. User taps the microphone  
3. User says **“Hey Chef”** to activate continuous listening  
4. User issues commands such as:  
   - “Start recipe”  
   - “Next step”  
   - “Repeat”  
   - “How much salt do I need?”  
   - “Set a timer for 2 minutes”  

#### **Speech processing pipeline**
- `voiceService.ts` → raw transcript  
- `commandParser.ts` → intent detection  
- System executes correct action  

---

## Technologies Used

- React + TypeScript  
- Ionic Framework  
- Capacitor (iOS speech recognition)  
- Web Speech API  
- Vite  
- Jest  

---

## Installation & Running the App

### **1. Install dependencies**
```
npm install
```

### **2. Run in browser (development)**
```
npm run dev
```

### **3. Build**
```
npm run build
```

### **4. Run on iOS**
```
npx cap sync ios
npx cap open ios
```

Then build + run in Xcode.

---

## Recipe Data Model

```ts
export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  estimatedTime: string;
  ingredients: string[];
  steps: string[];
}
```

Stored in: `src/models/recipes.ts`

