import React, { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonText, IonIcon, } from "@ionic/react";
import { useParams } from "react-router-dom";
import { chevronForward, mic } from "ionicons/icons";
import { sampleRecipes, Recipe } from "../models/recipes";
import { voiceService } from "../services/voiceService";
import "./Home.css";

let last_wake_time = 0;
let last_final_command = 0;
let assistant_active = false;
let last_command_text = "";
let last_command_time = 0;

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, set_recipe] = useState<Recipe | null>(null);
  const [current_step, set_current_step] = useState<number>(-1);
  const [is_listening, set_is_listening] = useState(false);
  const [timer_active, set_timer_active] = useState(false);
  const [timer_remaining, set_timer_remaining] = useState(0);
  const [timer_expanded, set_timer_expanded] = useState(false);
  const [timer_paused, set_timer_paused] = useState(false);
  const timer_remaining_ref = React.useRef(0);
  const timer_active_ref = React.useRef(false);
  const timer_paused_ref = React.useRef(false);
  const current_step_ref = React.useRef(-1);

  useEffect(() => {
    current_step_ref.current = current_step;
  }, [current_step]);
  useEffect(() => {
    timer_remaining_ref.current = timer_remaining;
  }, [timer_remaining]);
  useEffect(() => {
    timer_active_ref.current = timer_active;
  }, [timer_active]);
  useEffect(() => {
    timer_paused_ref.current = timer_paused;
  }, [timer_paused]);

  const speak_only = (text: string) => {
    voiceService.speak(text);
  };

  const safe_speak = (text: string) => {
    voiceService.stop_listening();
    speak_only(text);
    voiceService.on_speak_end(() => {
      if (assistant_active) {
        setTimeout(() => {
          voiceService.start_listening(handle_voice_command);
        }, 600);
      }
    });
  };

  const word_to_num: Record<string, number> = { one: 1, "1": 1, two: 2, "2": 2, three: 3, "3": 3, four: 4, "4": 4, five: 5, "5": 5, six: 6, "6": 6, seven: 7, "7": 7, eight: 8, "8": 8, nine: 9, "9": 9, ten: 10, "10": 10, eleven: 11, "11": 11, twelve: 12, "12": 12, };

  function extract_number(str: string): number | null {
    const digit = str.match(/(\d+)/);
    if (digit) return parseInt(digit[1]);
    for (const w of str.split(" ")) {
      if (word_to_num[w]) return word_to_num[w];
    }
    return null;
  }

  function extract_step_number(text: string): number | null {
    const digit_match = text.match(/step\s*(\d+)/);
    if (digit_match) return parseInt(digit_match[1], 10);
    const word_match = text.match(/step\s*(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/,);
    if (word_match) return word_to_num[word_match[1]];
    return null;
  }

  const handle_voice_command = (command: string) => {
    const final = command.toLowerCase().trim();
    const now = Date.now();
    if (final === last_command_text && now - last_command_time < 2000) {
      return;
    }
    last_command_text = final;
    last_command_time = now;
    if (now - last_final_command < 900) {
      return;
    }
    last_final_command = now;
    console.log("final_command: ", final);

    if (final.includes("hey chef") || final.includes("hey chief")) {
      if (now - last_wake_time < 2000) return;
      assistant_active = true;
      last_wake_time = now;
      voiceService.stop_listening();
      safe_speak("Yes, how can I help?");
      voiceService.on_speak_end(() => {
        setTimeout(() => voiceService.start_listening(handle_voice_command), 600);
      });
      return;
    }

    if (assistant_active &&
      (final.includes("i'm done") || final.includes("stop listening") || final.includes("end session"))) {
      assistant_active = false;
      safe_speak("Okay, I'll stop listening now.");
      set_is_listening(false);
      voiceService.stop_listening();
      return;
    }

    if (!assistant_active) return;
    if (timer_expanded) set_timer_expanded(false);

    if (final.includes("start recipe") || final.includes("start cooking") || final.includes("begin")) {
      start_recipe();
      return;
    }

    if (final.includes("pause timer")) {
      set_timer_paused(true);
      safe_speak("Timer paused.");
      return;
    }

    if (final.includes("resume timer")) {
      set_timer_paused(false);
      safe_speak("Resuming the timer.");
      return;
    }

    if (final.includes("next step") || final.includes("continue") || final.startsWith("next")) {
      next_step();
      return;
    }

    if (final.includes("repeat") || final.includes("again") || final.includes("what was that")) {
      repeat_step();
      return;
    }

    if (final.includes("ingredients") || final.includes("ingredient list") || final.includes("what do i need")) {
      read_ingredients();
      return;
    }

    if (final.includes("cancel timer") || final.includes("stop timer")) {
      set_timer_active(false);
      set_timer_remaining(0);
      safe_speak("Timer cancelled.");
      return;
    }

    if (final.includes("timer") || final.includes("set a") || final.includes("start a")) {
      const amount = extract_number(final);
      let unit: "minute" | "second" | null = null;
      if (final.includes("minute")) unit = "minute";
      if (final.includes("second")) unit = "second";

      if (amount && unit) {
        start_timer(unit === "minute" ? amount * 60 : amount);
        return;
      }

      safe_speak("For how long?");
      return;
    }

    if (final.includes("time left") || final.includes("how much time") || final.includes("remaining time") || final.includes("what is the timer at") || final.includes("what's the timer at")) {
      const remaining = timer_remaining_ref.current;
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      safe_speak(`You have ${mins} minutes and ${secs} seconds left.`);
      return;
    }

    const step_num = extract_step_number(final);
    if (step_num !== null) {
      if (!recipe) {
        safe_speak("I don't have a recipe loaded.");
        return;
      }

      const index = step_num - 1;
      if (index >= 0 && index < recipe.steps.length) {
        current_step_ref.current = index;
        set_current_step(index);
        safe_speak(`Step ${step_num}. ${recipe.steps[index]}`);
      } else {
        safe_speak("That step number is not in this recipe.");
      }
      return;
    }

    if (final.includes("how much") || final.includes("how many")) {
      search_ingredient(final);
      return;
    }

    if (final.includes("add")) {
      const amount = extract_number(final);
      let unit: string | null = null;

      if (final.includes("minute")) unit = "minute";
      if (final.includes("second")) unit = "second";

      if (amount && unit) {
        const extra = unit === "minute" ? amount * 60 : amount;
        set_timer_remaining((prev) => prev + extra);
        safe_speak(`Added ${amount} ${unit}${amount > 1 ? "s" : ""}.`);
      }
      return;
    }

    if (final.includes("subtract") || final.includes("remove")) {
      const amount = extract_number(final);
      let unit: string | null = null;
      if (final.includes("minute")) unit = "minute";
      if (final.includes("second")) unit = "second";

      if (amount && unit) {
        const extra = unit === "minute" ? amount * 60 : amount;
        set_timer_remaining((prev) => Math.max(0, prev - extra));
        safe_speak(`Removed ${amount} ${unit}${amount > 1 ? "s" : ""}.`);
      }
      return;
    }

    safe_speak("Sorry, I didn’t understand that. Try saying: start recipe, next step, set a timer for 2 minutes, repeat step, or ingredients list.");
  };

  const start_listening = () => {
    assistant_active = false;
    set_is_listening(true);
    voiceService.start_listening(handle_voice_command);
  };

  const stop_listening = () => {
    set_is_listening(false);
    assistant_active = false;
    voiceService.stop_listening();
  };

  const start_recipe = () => {
    if (!recipe) return;
    current_step_ref.current = 0;
    set_current_step(0);
    safe_speak(`Starting ${recipe.name}. Step 1. ${recipe.steps[0]}`);
  };

  const next_step = () => {
    if (!recipe) return;
    const step_now = current_step_ref.current;
    if (step_now === -1) {
      safe_speak("Please start the recipe first by saying start recipe.");
      return;
    }

    if (step_now < recipe.steps.length - 1) {
      const new_index = step_now + 1;
      current_step_ref.current = new_index;
      set_current_step(new_index);
      safe_speak(`Step ${new_index + 1}. ${recipe.steps[new_index]}`);
    } else {
      safe_speak("You have completed all steps. Enjoy your meal!");
    }
  };

  const repeat_step = () => {
    if (!recipe) return;
    const step_now = current_step_ref.current;
    if (step_now === -1) {
      safe_speak("No step is currently active.");
      return;
    }
    safe_speak(`Step ${step_now + 1}. ${recipe.steps[step_now]}`);
  };

  const read_ingredients = () => {
    if (!recipe) return;
    safe_speak(`You will need: ${recipe.ingredients.join(", ")}`);
  };

  const search_ingredient = (query: string) => {
    if (!recipe) return;

    const keywords = query.toLowerCase().split(" ").filter((w) => w.length > 3 && !["how", "much", "many", "need", "about", "what"].includes(w),);
    for (const word of keywords) {
      const match = recipe.ingredients.find((ing) =>
        ing.toLowerCase().includes(word),
      );
      if (match) {
        safe_speak(match);
        return;
      }
    }

    safe_speak("I couldn't find that ingredient in this recipe.");
  };

  const start_timer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    safe_speak(`Starting timer for ${minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : `${secs} seconds`}`,);
    set_timer_remaining(seconds);
    set_timer_active(true);
    set_timer_expanded(false);
  };

  useEffect(() => {
    const found = sampleRecipes.find((r) => r.id === id);
    if (found) set_recipe(found);
  }, [id]);

  useEffect(() => {
    if (!timer_active || timer_paused) return;

    const interval = setInterval(() => {
      set_timer_remaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          safe_speak("Timer is done!");
          set_timer_active(false);
          set_timer_paused(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer_active, timer_paused]);

  if (!recipe) {
    return (
      <IonPage>
        <IonContent>
          <div className="recipe-loading"><IonText>Recipe Not Loading. Please Refresh Page.</IonText></div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      {timer_active && timer_expanded && (
        <IonPage className="timer-fullscreen">
          <IonContent className="ion-padding">
            <IonButton fill="clear" onClick={() => set_timer_expanded(false)}>Close</IonButton>
            <div className="timer-fullscreen-center">
              <h1 className="timer-fullscreen-text">{Math.floor(timer_remaining / 60)}:{(timer_remaining % 60).toString().padStart(2, "0")}</h1>
            </div>
          </IonContent>
        </IonPage>
      )}

      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{recipe.name}</IonTitle>
        </IonToolbar>

        <div className="header-timer">
          <div className={`header-timer-box ${timer_active ? "active" : "inactive"}`} onClick={() => timer_active && set_timer_expanded(true)}>⏱ {Math.floor(timer_remaining / 60)}:{(timer_remaining % 60).toString().padStart(2, "0")}</div>
        </div>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardContent>
            <div className="ingredients-header">
              <h2 className="ingredients-title">Ingredients ({recipe.ingredients.length})</h2>
              <IonIcon icon={chevronForward} />
            </div>

            <IonList className="ingredients-list">
              {recipe.ingredients.map((ingredient, idx) => (
                <IonItem key={idx} lines="none" className="ingredient-item">
                  <IonLabel className="ingredient-label">• {ingredient}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <div className="steps-section">
          <h2 className="steps-title">Steps</h2>

          {recipe.steps.map((step, index) => (
            <IonCard
              key={index} className={`step-card ${current_step === index ? "step-active" : ""}`}>
              <IonCardContent>
                <div className="step-row">
                  <div className={`step-circle ${current_step === index ? "active" : ""}`}>{index + 1}</div>
                  <p className="step-text">{step}</p>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <div className="mic-container">
          <IonButton color={is_listening ? "danger" : "medium"} shape="round" size="large" onClick={is_listening ? stop_listening : start_listening} className="mic-button">
            <IonIcon icon={mic} className="mic-icon" />
          </IonButton>
          <IonText className="mic-label">{is_listening ? "Listening..." : "Press and say 'Hey Chef' to start"}</IonText>
        </div>

        <div className="bottom-padding"></div>
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetail;
