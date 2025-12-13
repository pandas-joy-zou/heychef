import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { IonContent, IonHeader, IonSegment, IonSegmentButton, IonPage, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonList, IonLabel, IonText } from '@ionic/react';
import { sampleRecipes, Recipe } from '../models/recipes';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [search_text, set_search_text] = useState('');
  const [filtered_recipes, set_filtered_recipes] = useState<Recipe[]>(sampleRecipes);
  const [sort_mode, set_sort_mode] = useState<"default" | "fast" | "slow">("default");

  const handle_search = (e: CustomEvent) => {
    const value = e.detail.value || '';
    set_search_text(value);

    if (value.trim() === '') {
      set_filtered_recipes(sampleRecipes);
    } else {
      const filtered = sampleRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(value.toLowerCase()) ||
        recipe.description.toLowerCase().includes(value.toLowerCase())
      );
      set_filtered_recipes(filtered);
    }
  };

  const parse_minutes = (s: string) => {
    const lower = (s || "").toLowerCase();
    let mins = 0;

    const hr = lower.match(/(\d+)\s*hour/);
    if (hr) mins += parseInt(hr[1], 10) * 60;

    const m = lower.match(/(\d+)\s*min/);
    if (m) mins += parseInt(m[1], 10);

    if (mins === 0) {
      const d = lower.match(/(\d+)/);
      if (d) mins = parseInt(d[1], 10);
    }
    return mins;
  };

  const select_recipe = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const displayed_recipes = [...filtered_recipes].sort((a, b) => {
    if (sort_mode === "default") return 0;
    const am = parse_minutes(a.estimatedTime);
    const bm = parse_minutes(b.estimatedTime);
    return sort_mode === "fast" ? am - bm : bm - am;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle className="home-title">Hey Chef</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonSearchbar value={search_text} onIonInput={handle_search} placeholder="Search for recipe..." className='home-searchbar' />

        <div className="sort-tabs-wrapper">
          <IonSegment
            value={sort_mode}
            onIonChange={(e) => set_sort_mode(e.detail.value as any)}
            className="sort-tabs"
          >
            <IonSegmentButton value="default">
              <IonLabel>Default</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="fast">
              <IonLabel>Fastest</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="slow">
              <IonLabel>Longest</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        <IonList>
          {displayed_recipes.map((recipe) => (
            <IonCard key={recipe.id} button onClick={() => select_recipe(recipe)} className='recipe-card'>
              <IonCardContent className='recipe-card-content'>
                <img src={recipe.image} alt={recipe.name} className="recipe-image-box" />
                {/* <div className='recipe-image-box' >{recipe.image}</div> */}
                <div className='recipe-info'>
                  <IonLabel>
                    <h2 className='recipe-name'>{recipe.name}</h2>
                    <p className='recipe-description'>{recipe.description}</p>
                    <p className='recipe-time'>{recipe.estimatedTime}</p>
                  </IonLabel>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {displayed_recipes.length === 0 && (
          <div className='no-results'>
            <IonText color="medium"><p>No Recipes Found. Please Double Check or Try Searching For Something Else!</p>
            </IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
