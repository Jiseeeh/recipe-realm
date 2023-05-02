import NextHead from "next/head";

export default function Head() {
  return (
    <NextHead>
      <title>Recipe Realm</title>
      <meta name="description" content="Post your legendary recipes!" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  );
}
