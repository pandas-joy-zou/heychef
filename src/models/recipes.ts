export interface Recipe {
    id: string;
    name: string;
    description: string;
    image: string;
    estimatedTime: string;  
    ingredients: string[];
    steps: string[];
}

export const sampleRecipes: Recipe[] = [
    {
        id: '1',
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian Pasta Dish',
        image: "/public/spaghetti_carbonara.jpg",
        estimatedTime: '25 minutes',
        ingredients: [
            'Spaghetti - 400g',
            'Eggs - 4 large',
            'Parmesan Cheese - 1 cup grated',
            'Pancetta - 200g diced',
            'Garlic - 2 cloves minced',
            'Black Pepper - 1 teaspoon',
            'Salt - 1 teaspoon',
            'Olive Oil - 2 tablespoons',
            'Fresh Parsley - a pinch',
            'Water - 4 cups',
            'Butter - 1 tablespoon'
        ],
        steps: [
            'Cook the spaghetti in salted water until al dente, about 8-10 minutes. Reserve 1 cup of pasta water before draining.',
            'Fry the pancetta until crisp in a large pan with olive oil over medium heat, about 5 minutes. Add minced garlic in the last minute.',
            'Beat the eggs with grated Parmesan and pepper in a bowl. Mix thoroughly until well combined.',
            'Remove the pan from heat. Add the drained pasta to the pancetta and toss to combine.',
            'Pour the egg mixture over the hot pasta and toss quickly. The residual heat will cook the eggs into a creamy sauce.',
            'Add reserved pasta water a little at a time if needed to reach desired consistency. The sauce should coat the pasta smoothly.',
            'Season with salt and extra black pepper to taste. Garnish with fresh parsley and serve immediately with extra Parmesan.'
        ]
    },
    {
        id: '2',
        name: 'Chicken Stir-Fry',
        description: 'Quick and Healthy Asian-Inspired Dish',
        image: "/public/chicken_stir_fry.jpeg",
        estimatedTime: '20 minutes',
        ingredients: [
            'Chicken Breast - 500g sliced',
            'Soy Sauce - 3 tablespoons',
            'Vegetable Oil - 2 tablespoons',
            'Bell Peppers - 2 peppers sliced',
            'Broccoli - 1 cup florets',
            'Carrots - 1 cup sliced',
            'Garlic - 3 cloves minced',
            'Ginger - 1 tablespoon grated',
            'Cornstarch - 1 tablespoon',
            'Honey - 1 tablespoon',
            'Rice Vinegar - 1 tablespoon',
            'Sesame Oil - 1 teaspoon'
        ],
        steps: [
            'Mix soy sauce, cornstarch, and honey in a small bowl. Add sliced chicken and marinate for 10 minutes.',
            'Heat vegetable oil in a large wok or skillet over high heat until smoking hot.',
            'Add chicken in a single layer and cook without stirring for 2 minutes to get a good sear.',
            'Stir-fry chicken until cooked through and golden brown, about 5 minutes total. Remove and set aside.',
            'Add more oil if needed, then stir-fry garlic and ginger for 30 seconds until fragrant.',
            'Add all vegetables and stir-fry for 3-4 minutes until crisp-tender. Keep the heat high.',
            'Return chicken to the pan, add rice vinegar and sesame oil. Toss everything together for 1 minute and serve over rice.'
        ]
    },
    {
        id: '3',
        name: 'Vegetable Curry',
        description: 'Aromatic and Flavorful Indian Curry',
        image: "/public/vegetable_curry.jpg",
        estimatedTime: '40 minutes',
        ingredients: [
            'Cauliflower - 2 cups florets',
            'Potatoes - 2 medium diced',
            'Chickpeas - 1 can drained',
            'Coconut Milk - 1 can',
            'Curry Powder - 2 tablespoons',
            'Onion - 1 large diced',
            'Tomatoes - 2 large diced',
            'Garlic - 4 cloves minced',
            'Ginger - 2 tablespoons grated',
            'Vegetable Oil - 2 tablespoons',
            'Cumin seeds - 1 teaspoon',
            'Turmeric - 1 teaspoon'
        ],
        steps: [
            'Heat oil in a large pot over medium heat. Add cumin seeds and let them sizzle for 30 seconds.',
            'Add diced onion and sauté until golden brown, about 8 minutes. Stir occasionally.',
            'Add garlic and ginger, cook for 2 minutes until fragrant. Don\'t let them burn.',
            'Stir in curry powder and turmeric, toast spices for 1 minute to release their flavors.',
            'Add potatoes, cauliflower, and tomatoes. Stir to coat vegetables with spices.',
            'Pour in coconut milk and add chickpeas. Bring to a boil, then reduce heat to low.',
            'Cover and simmer for 25-30 minutes until vegetables are tender. Stir occasionally and adjust seasoning. Serve with rice or naan bread.'
        ]
    },
    {
        id: '4',
        name: 'Avocado Toast with Egg',
        description: 'Simple and healthy breakfast option',
        image: "/public/avocado_toast.jpg",
        estimatedTime: '10 minutes',
        ingredients: [
            'Bread Slices - 2',
            'Avocado - 1 ripe',
            'Egg - 1 large',
            'Lemon Juice - 1 teaspoon',
            'Salt - 1 pinch',
            'Black Pepper - 1 pinch',
            'Olive Oil - 1 teaspoon',
            'Red Pepper Flakes - a pinch (optional)'
        ],
        steps: [
            'Toast the bread slices until golden and crispy.',
            'Mash the avocado in a bowl with lemon juice, salt, and pepper.',
            'Heat olive oil in a small pan and cook the egg sunny-side up for 2-3 minutes.',
            'Spread the mashed avocado evenly over the toast.',
            'Top each slice with the cooked egg.',
            'Sprinkle red pepper flakes if desired and serve immediately.'
        ]
    },
    {
        id: '5',
        name: 'Beef Tacos',
        description: 'Flavorful Mexican-Style Tacos with Seasoned Beef',
        image: "/public/beef_tacos.jpg",
        estimatedTime: '25 minutes',
        ingredients: [
            'Ground Beef - 400g',
            'Taco Seasoning - 2 tablespoons',
            'Tortillas - 8 small',
            'Onion - 1 small diced',
            'Lettuce - 1 cup shredded',
            'Tomatoes - 1 cup diced',
            'Cheddar Cheese - 1 cup shredded',
            'Sour cream - 1/2 cup',
            'Olive Oil - 1 tablespoon'
        ],
        steps: [
            'Heat olive oil in a skillet over medium-high heat.',
            'Add diced onion and cook for 2 minutes until softened.',
            'Add ground beef and break it apart with a spatula.',
            'Cook beef until browned, about 6-8 minutes. Drain excess fat.',
            'Stir in taco seasoning and 1/4 cup water. Simmer for 2-3 minutes.',
            'Warm the tortillas in a pan or microwave.',
            'Assemble tacos with beef, lettuce, tomatoes, cheese, and sour cream.'
        ]
    },
    {
        id: '6',
        name: 'Shrimp Fried Rice',
        description: 'Classic Takeout-Styled Fried Rice',
        image: "/public/shrimp_fried_rice.jpg",
        estimatedTime: '20 minutes',
        ingredients: [
            'Shrimp - 300g peeled & deveined',
            'Rice - 3 cups cooked (day-old preferred)',
            'Eggs - 2 beaten',
            'Peas - 1/2 cup',
            'Carrots - 1/2 cup diced',
            'Green Onions - 1/4 cup chopped',
            'Soy Sauce - 3 tablespoons',
            'Sesame Oil - 1 teaspoon',
            'Vegetable Oil - 2 tablespoons',
            'Garlic - 2 cloves minced'
        ],
        steps: [
            'Heat 1 tablespoon vegetable oil in a wok over medium-high heat.',
            'Add shrimp and cook until pink, about 2–3 minutes. Remove and set aside.',
            'Add remaining oil, garlic, carrots, and peas. Stir-fry for 2 minutes.',
            'Push vegetables aside and pour in beaten eggs. Scramble until fully cooked.',
            'Add rice, soy sauce, and sesame oil. Stir-fry for 3 minutes.',
            'Return shrimp to the wok and toss everything together.',
            'Top with green onions and serve hot.'
        ]
    },
    {
        id: '7',
        name: 'Pancakes',
        description: 'Fluffy Homemade Breakfast Pancakes',
        image: "/public/pancakes.jpg",
        estimatedTime: '15 minutes',
        ingredients: [
            'All-Purpose Flour - 1 cup',
            'Milk - 3/4 cup',
            'Egg - 1 large',
            'Butter - 2 tablespoons melted',
            'Baking Powder - 2 teaspoons',
            'Sugar - 1 tablespoon',
            'Salt - 1/4 teaspoon',
            'Maple Syrup - a squeeze'
        ],
        steps: [
            'In a bowl, whisk together flour, baking powder, sugar, and salt.',
            'In a separate bowl, whisk milk, egg, and melted butter.',
            'Pour wet ingredients into dry ingredients and mix until just combined.',
            'Heat a lightly oiled pan over medium heat.',
            'Pour 1/4 cup batter for each pancake. Cook until bubbles form on top.',
            'Flip and cook another 1-2 minutes until golden brown.',
            'Serve warm with maple syrup.'
        ]
    },
    {
        id: '8',
        name: 'Garlic Butter Salmon',
        description: 'Tender Salmon Baked with Garlic and Herbs',
        image: "/public/garlic_butter_salmon.jpg",
        estimatedTime: '20 minutes',
        ingredients: [
            'Salmon Fillets - 2',
            'Butter - 3 tablespoons melted',
            'Garlic - 3 cloves minced',
            'Lemon - 1 sliced',
            'Salt - 1/2 teaspoon',
            'Black Pepper - 1/2 teaspoon',
            'Parsley - 1 tablespoon chopped'
        ],
        steps: [
            'Preheat oven to 400°F (200°C).',
            'Place salmon fillets on a baking sheet lined with foil.',
            'Mix melted butter with minced garlic, salt, and pepper.',
            'Brush mixture over the salmon.',
            'Top with lemon slices.',
            'Bake for 12-15 minutes until salmon flakes easily with a fork.',
            'Sprinkle parsley before serving.'
        ]
    }
];
