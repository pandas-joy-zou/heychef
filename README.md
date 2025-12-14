# Project: Hey Chef
Hey Chef lets users navigate recipes, ask ingredient questions, and manage timers through voice recognition. It is designed for hands-busy cooking environments where touch interaction is difficult or inconvenient. This application is a hands-free, voice-controlled recipe assistant built with React, TypeScript, Ionic, and Capacitor.

## Features

### **Voice-Controlled Navigation**
- Start a recipe  
- Go to next / previous step  
- Repeat instructions  
- Ask “How much {ingredient_name} do I need?”
- Scrolling up/down

### **Hands-Free Timer Management**
- Set, cancel, pause, resume, or adjust timers  
- Supports natural phrasing (e.g., “set a two-minute timer”)  

### **Wake-Word Activation**
- Tap the microphone once  
- Say **“Hey Chef”** to enter continuous listening mode  

### **Simple, Clean UI**
- Highlighted current step  
- Minimal home screen  
- Animated microphone feedback  

### **Local Recipe Data Model**
- Stored in TypeScript  
- Fast lookup for ingredient queries  

## Project Structure

```
src/
│
├── images/
│   ├── avocado_toast.jpg
│   ├── beef_tacos.jpg
│   ├── chicken_stir_fry.jpeg
│   ├── garlic_butter_salmon.jpg
│   ├── pancakes.jpg
│   ├── shrimp_fried_rice.jpg
│   ├── spaghetti_carbonara.jpg
│   └── vegetable_curry.jpg
|
├── components/
│   └── VoiceListener.tsx
│
├── models/
│   └── recipes.ts
│
├── pages/
│   ├── Home.css
│   ├── Home.tsx
│   ├── RecipeDetail.tsx
│   └── RecipeView.tsx
│
├── services/
│   ├── commandParser.ts
│   ├── TimerService.ts
│   └── voiceService.ts
│
├── App.tsx
├── main.tsx
└── App.test.tsx
```

## Folder Overview

### **components/**
Reusable UI elements  
- `VoiceListener.tsx` — microphone UI + animations  

### **images/**
- `avocado_toast.jpg` 
- `beef_tacos.jpg` 
- `chicken_stir_fry.jpeg` 
- `garlic_butter_salmon.jpg` 
- `pancakes.jpg` 
- `shrimp_fried_rice.jpg` 
- `spaghetti_carbonara.jpg` 
- `vegetable_curry.jpg` 

### **models/**
- `recipes.ts` — recipe interface + stored recipe list  

### **pages/**
Screens the user interacts with  
- `Home.tsx` — search + recipe list  
- `RecipeView.tsx` — ingredients + steps + microphone button  
- `RecipeDetail.tsx` — recipe description  

### **services/**
Core logic  
- `voiceService.ts` — speech recognition  
- `commandParser.ts` — interprets spoken commands  
- `TimerService.ts` — timer logic  

### **App.tsx**
Routing and primary application structure  

## How Voice Commands Work
1. User selects a recipe  
2. User taps the microphone  
3. User says **“Hey Chef”** to activate continuous listening  
4. User issues commands such as:  
   - “Start recipe”  
   - “Next step”  
   - “Repeat”  
   - Ingredients list
   - Scroll up/down
   - “How much salt do I need?”  
   - “Set a timer for 2 minutes”  

#### **Speech Processing Pipeline**
- `voiceService.ts` → raw transcript  
- `commandParser.ts` → intent detection  
- System executes correct action  

## Technologies Used
- React + TypeScript  
- Ionic Framework  
- Capacitor (iOS Speech Recognition)  
- Web Speech API  
- Vite  

## Installation & Running the App
### **1. Install Dependencies**
```
npm install
```
### **2. Run in Browser (UI Development)**
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
Then build + run in Xcode with selecting your device of choice.

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

