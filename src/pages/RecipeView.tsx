import React, { useEffect, useState } from "react";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonChip, IonText, useIonToast } from "@ionic/react";
import { chevronBack, playCircle } from "ionicons/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Recipe } from "../models/recipes";
import { voiceService } from "../services/voiceService";
import { commandParser } from "../services/commandParser";
import { timerService } from "../services/TimerService";
import VoiceListener from "../components/VoiceListener";
import "./Home.css";

const RecipeView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [present_toast] = useIonToast();

  const [recipe, set_recipe] = useState<Recipe | null>(null);
  const [current_step, set_current_step] = useState(-1);
  const [is_listening, set_is_listening] = useState(false);
  const [show_ingredients, set_show_ingredients] = useState(false);
  const [timer_active, set_timer_active] = useState(false);
  const [timer_remaining, set_timer_remaining] = useState(0);
  const [timer_paused, set_timer_paused] = useState(false);
  const [show_listening_feedback, set_show_listening_feedback] = useState(false);

  useEffect(() => {
    if (location.state && (location.state as any).recipe) {
      set_recipe((location.state as any).recipe);
    } else { navigate("/"); }
  }, [location, navigate]);

  useEffect(() => {
    voiceService.on_wake_word(() => {
      console.log("wake word activated!");
      set_show_listening_feedback(true);
      voiceService.speak("Yes? I'm listening.");
      setTimeout(() => set_show_listening_feedback(false), 2000);
    });

    voiceService.on_command((command) => {
      handle_voice_command(command);
    });

    voiceService.on_listening_change((listening) => {
      set_is_listening(listening);
    });

    timerService.on_tick((seconds) => {
      set_timer_remaining(seconds);
    });

    timerService.on_complete(() => {
      set_timer_active(false);
      voiceService.speak("Timer complete!");
    });

    return () => {
      voiceService.stop_listening();
      voiceService.stop_speaking();
      timerService.stop_timer();
    };
  }, []);

  const handle_voice_command = (command: string) => {
    const parsed = commandParser.parse_command(command);

    switch (parsed.action) {
      case "start":
        start_recipe();
        break;
      case "next":
        next_step();
        break;
      case "previous":
        previous_step();
        break;
      case "repeat":
        repeat_step();
        break;
      case "ingredients":
        read_ingredients();
        break;
      case "timer":
        if (typeof parsed.parameter === "number") start_timer(parsed.parameter);
        break;
      case "pause":
        pause_timer();
        break;
      case "resume":
        resume_timer();
        break;
      case "stop":
        stop_timer();
        break;
      case "query":
        if (typeof parsed.parameter === "string")
          handle_ingredient_query(parsed.parameter);
        break;
      default:
        voiceService.speak("Sorry, I didn't understand that. Try saying 'next step', 'repeat', or 'ingredients'.");
    }
  };

  const start_recipe = () => {
    if (!recipe) return;
    set_current_step(0);
    voiceService.speak(`Starting ${recipe.name}. ${recipe.steps[0]}`);
  };

  const next_step = () => {
    if (!recipe) return;
    if (current_step < recipe.steps.length - 1) {
      const next_step_index = current_step + 1;
      set_current_step(next_step_index);
      voiceService.speak(recipe.steps[next_step_index]);
    } else {
      voiceService.speak("You've reached the last step. Enjoy your meal!");
    }
  };

  const previous_step = () => {
    if (!recipe) return;
    if (current_step > 0) {
      const prev = current_step - 1;
      set_current_step(prev);
      voiceService.speak(recipe.steps[prev]);
    } else {
      voiceService.speak("You're already at the first step.");
    }
  };

  const repeat_step = () => {
    if (recipe && current_step >= 0) {
      voiceService.speak(recipe.steps[current_step]);
    }
  };

  const read_ingredients = () => {
    if (!recipe) return;
    const list = recipe.ingredients.join(", ");
    voiceService.speak(`You'll need: ${list}`);
    set_show_ingredients(true);
  };

  const handle_ingredient_query = (query: string) => {
    if (!recipe) return;
    const keyword = commandParser.extract_ingredient_keyword(query);
    const ing = recipe.ingredients.find((i) =>
      i.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (ing) voiceService.speak(`You need ${ing}`);
    else voiceService.speak("I couldn't find that ingredient in the recipe.");
  };

  const start_timer = (seconds: number) => {
    timerService.start_timer(seconds);
    set_timer_active(true);
    set_timer_paused(false);
    const minutes = Math.floor(seconds / 60);
    const display = minutes > 0 ? `${minutes} minute` : `${seconds} second`;
    voiceService.speak(`Timer started for ${display}`);
  };

  const pause_timer = () => {
    timerService.pause_timer();
    set_timer_paused(true);
    voiceService.speak("Timer paused");
  };

  const resume_timer = () => {
    timerService.resume_timer();
    set_timer_paused(false);
    voiceService.speak("Timer resumed");
  };

  const stop_timer = () => {
    timerService.stop_timer();
    set_timer_active(false);
    voiceService.speak("Timer cancelled");
  };

  const toggle_listening = () => {
    if (is_listening) {
      voiceService.stop_listening();
    } else {
      if (!voiceService.is_supported()) {
        present_toast({
          message: "Voice recognition is not supported in your browser",
          duration: 3000,
          color: "danger",
        });
        return;
      }
    }
  };

  if (!recipe) return null;

  return (
    <IonPage>
      <IonHeader mode="ios">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" icon={chevronBack} text="" />
          </IonButtons>
          <IonTitle>{recipe.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="page-container">
          {show_listening_feedback && (
            <div className="listening-overlay">
              <div className="listening-icon">🎤</div>
              <h2>Listening...</h2>
              <p>Try: “Next step”</p>
            </div>
          )}

          <div className="ingredients-section">
            <div className="ingredients-header">
              <h2>Ingredients ({recipe.ingredients.length})</h2>
              <IonButton fill="outline" size="small" onClick={() => set_show_ingredients(!show_ingredients)}>
                {show_ingredients ? "Hide" : "Show"}
              </IonButton>
            </div>

            {show_ingredients && (
              <IonList>
                {recipe.ingredients.map((ing, idx) => (
                  <IonItem key={idx}>
                    <IonLabel className="ingredient-text">{ing}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </div>

          <div>
            <h2>Steps</h2>
            {current_step === -1 && (
              <div className="start-box">
                <IonText color="medium">
                  <p>Ready to start?</p>
                </IonText>

                <IonButton size="large" onClick={start_recipe}>
                  <IonIcon icon={playCircle} slot="start" />
                  Start Recipe
                </IonButton>

                <IonText color="medium">
                  <p className="hint-text">Say “Hey Chef”</p>
                </IonText>
              </div>
            )}

            <IonList>
              {recipe.steps.map((step, index) => (
                <IonItem key={index} className={`step-item ${current_step === index ? "active-step" : ""}`}>
                  <IonLabel style={{ whiteSpace: "normal" }}>
                    <div className="step-row">
                      <IonChip color={current_step === index ? "primary" : "medium"} className="step-chip">{index + 1}</IonChip>
                      <p className={`step-text ${current_step === index ? "bold" : ""}`}>{step}</p>
                    </div>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>

            {current_step >= 0 && (
              <div className="step-controls">
                <IonButton disabled={current_step === 0} onClick={previous_step}>Previous</IonButton>
                <IonButton onClick={repeat_step}>Repeat</IonButton>
                <IonButton disabled={current_step === recipe.steps.length - 1} onClick={next_step}>Next</IonButton>
              </div>
            )}
          </div>
        </div>
      </IonContent>
      <VoiceListener is_listening={is_listening} on_toggle_listening={toggle_listening} />
    </IonPage>
  );
};

export default RecipeView;
