import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { IonApp, IonPage, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import Home from "./pages/Home";

setupIonicReact({ mode: "ios" });

const App: React.FC = () => {
  return (
    <IonApp>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<IonPage> <Home /> </IonPage>} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </IonApp>
  );
};

export default App;
