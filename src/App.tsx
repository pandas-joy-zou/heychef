import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { IonApp, IonPage, setupIonicReact } from "@ionic/react";

import "@ionic/react/css/core.css";

import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Listening from "./pages/Listening";

setupIonicReact({ mode: "ios" });

const App: React.FC = () => {
  return (
    <IonApp>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<IonPage><Home /></IonPage>} />
          <Route path="/recipe/:id" element={<IonPage><RecipeDetail /></IonPage>} />
          <Route path="/listening" element={<IonPage><Listening /></IonPage>} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </IonApp>
  );
};

export default App;
