import React, { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonText } from '@ionic/react';
import { mic, micOff } from 'ionicons/icons';

interface VoiceListenerProps {
  is_listening: boolean;
  on_toggle_listening: () => void;
}

const VoiceListener: React.FC<VoiceListenerProps> = ({ is_listening, on_toggle_listening }) => {
  const [pulse_animation, set_pulse_animation] = useState(false);

  useEffect(() => {
    if (is_listening) { set_pulse_animation(true); }
    else { set_pulse_animation(false); }
  }, [is_listening]);

  return (
    <div className="voice-listener-container">
      <IonButton onClick={on_toggle_listening} shape="round" size="large" color={is_listening ? 'danger' : 'primary'} className={pulse_animation ? 'voice-button pulse' : 'voice-button'}>
        <IonIcon icon={is_listening ? mic : micOff} className="voice-icon" />
      </IonButton>

      {is_listening && (<IonText color="medium" className="voice-hint">Say "Hey Chef" to Start!</IonText>)}
    </div>
  );
};

export default VoiceListener;
