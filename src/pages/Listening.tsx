import React, { useEffect } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons, IonText, IonIcon, } from "@ionic/react";
import { mic } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { voiceService } from "../services/voiceService";
import "./Home.css";

const Listening: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    voiceService.start_listening((command) => {
      console.log("command_received:", command);
      navigate(-1);
    });
    return () => {
      voiceService.stop_listening();
    };
  }, [navigate]);

  const stop_listening = () => {
    voiceService.stop_listening();
    navigate(-1);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Voice Control</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="listening-page">
        <div className="listening-container">
          <IonText className="listening-title">Listening...</IonText>

          {/* Animated microphone */}
          <div className="mic-wrapper">
            <div className="mic-pulse-1" />
            <div className="mic-pulse-2" />

            <div className="mic-circle">
              <IonIcon icon={mic} className="mic-icon" />
            </div>
          </div>

          <IonText className="listening-tip">Try asking: "Next step" or "Set a 2-minute timer"</IonText>
          <IonButton color="danger" shape="round" size="large" onClick={stop_listening} className="stop-button">
            <IonIcon icon={mic} className="stop-button-icon" />
          </IonButton>

          <IonText className="wakeword-hint">Say "Hey Chef" to start</IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Listening;
