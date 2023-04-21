import {Grid} from "@mui/material"

import Sidebar from "@/components/sidebar/Sidebar";
import RecipeCard from "@/components/recipe/RecipeCard";


export default function Realm() {
    const data = [
        {
            id: 0,
            title: 'Secret Recipe',
            imageLink: '/sushi-med.jpg',
            description: "To make sushi, you will need sushi rice, which is a short-grain rice that is sticky when cooked. Begin by rinsing the rice until the water runs clear, and then cook the rice in water using a rice cooker or on the stovetop.",
        },
        {
            id: 1,
            title: 'Sushi master',
            imageLink: '/sushi-med.jpg',
            description: "While the rice is cooking, prepare your fillings. Popular choices include raw fish, such as salmon or tuna, as well as avocado, cucumber, and carrots. You can also add cooked ingredients, such as shrimp or crab.",
        },
        {
            id: 2,
            title: 'Master sushi',
            imageLink: '/sushi-med.jpg',
            description: "Once the rice is cooked, mix in a combination of rice vinegar, sugar, and salt to create the seasoning. Spread the seasoned rice onto a flat surface, such as a sushi mat or a piece of plastic wrap.",
        },
        {
            id: 3,
            title: 'Pro sushi',
            imageLink: '/sushi-med.jpg',
            description: "Add your desired fillings on top of the rice, and then roll the sushi tightly using the mat or plastic wrap. Cut the sushi into bite-sized pieces and serve with soy sauce, wasabi, and pickled ginger.",
        },
        {
            id: 4,
            title: 'Japanese Ultra Pro Max Mega Delux Sushi',
            imageLink: '/sushi-med.jpg',
            description: "Sushi is a traditional Japanese dish made from seasoned sushi rice combined with a variety of fillings, such as raw fish, vegetables, and other ingredients. The dish is often served with soy sauce, wasabi, and pickled ginger.",
        },

    ]
    return (
        <>
            <Sidebar>
                <Grid container spacing={{xs: 2, md: 3}} justifyContent="center">

                    {data.map(recipe => (
                        <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={2}>
                            <RecipeCard imageLink={recipe.imageLink}
                                        title={recipe.title}
                                        description={recipe.description}/>
                        </Grid>))}
                </Grid>
            </Sidebar>
        </>
    );
}