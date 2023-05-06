import NextHead from "next/head";

export default function Head() {
  return (
    <NextHead>
      <title>Recipe Realm</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="title" content="Recipe Realm" />
      <meta
        name="description"
        content="Share your legendary recipes with everyone!"
      />
      <meta
        name="keywords"
        content="Recipes, Recipe Realm, Share recipes, Free Recipes, Post recipes online"
      />
      <meta name="robots" content="index, follow" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="Jiseeeh" />
      <link rel="icon" href="/food.ico" />
    </NextHead>
  );
}
