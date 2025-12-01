import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonList, IonLabel, IonText } from '@ionic/react';
import { sampleRecipes, Recipe } from '../models/recipes';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [search_text, set_search_text] = useState('');
  const [filtered_recipes, set_filtered_recipes] = useState<Recipe[]>(sampleRecipes);

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

  const select_recipe = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle className="home-title">Hey Chef</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonSearchbar value={search_text} onIonInput={handle_search} placeholder="Search for recipe..." className='home-searchbar' />

        <IonList>
          {filtered_recipes.map((recipe) => (
            <IonCard key={recipe.id} button onClick={() => select_recipe(recipe)} className='recipe-card'>
              <IonCardContent className='recipe-card-content'>
                <div className='recipe-image-box' >{recipe.image}</div>
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

        {filtered_recipes.length === 0 && (
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
