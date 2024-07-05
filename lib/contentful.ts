import { createClient } from "contentful";

const client = createClient({
  space: process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN || "",
});

export const getHeroEntries = () => {
  return client.getEntries({
    content_type: "hero",
    include: 10,
    // @ts-ignore
    "metadata.tags.sys.id[in]": "baseline",
  });
};
