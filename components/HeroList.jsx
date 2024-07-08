import React, { useEffect } from "react";
import { Image, StyleSheet, Text, FlatList, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { parseExperiences } from "../lib/experiences";
import {
  Experience,
  useExperience,
  useNinetailed,
} from "@ninetailed/experience.js-react";
// import { ComponentTracker } from "./ninetailed/ComponentTracker";

const Hero = React.forwardRef((props, ref) => {
  return (
    <View style={styles.hero} ref={ref}>
      <Text style={styles.title}>{props.fields.internalName}</Text>
      <Image
        style={styles.image}
        source={{ uri: `https:${props.fields.image.fields.file.url}` }}
      />
    </View>
  );
});

function HeroExperienceWrapper({ item }) {
  return <HeroExperience item={item} />;
}

function HeroExperience({ item }) {
  const ninetailed = useNinetailed();

  const baseline = {
    ...item,
    id: item.sys.id,
  };
  const { loading, experience, variant, variantIndex } = useExperience({
    baseline,
    experiences: parseExperiences(item),
  });

  // Dummy element
  const Tracker = <View style={{ display: "none" }}>Test</View>;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (variant) {
    if (experience) {
      // TODO: This throws ERROR Unhandled promise rejection [TypeError: Cannot read property 'href' of undefined]
      ninetailed.trackComponentView({
        element: Tracker,
        experience,
        audience: experience.audience,
        variant,
        variantIndex,
      });
    }

    return (
      <View>
        <Hero {...variant} />
      </View>
    );
  }
  return <Hero {...baseline} />;
  // Normally, you'd use <Experience> from our React SDK
  // You can't here, because it uses <div> which isn't available in React Native
  // return (
  //   <Experience
  //     id={item.sys.id}
  //     {...item}
  //     experiences={parseExperiences(item)}
  //     component={Hero}
  //   />
  // );
}

export default function HeroList({ entries }) {
  const { track, reset, page } = useNinetailed();
  return (
    <SafeAreaView>
      <Button title="Send 9T Event" onPress={() => track("sampleEvent")} />
      <Button
        title="Reset"
        onPress={() => {
          reset();
          page();
        }}
      />
      <Text style={styles.hud}>
        There are {entries.length} baseline heroes defined in this Contentful
        space.
      </Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.sys.id}
        renderItem={HeroExperienceWrapper}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 28,
  },
  hud: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    height: 100,
    width: 100,
  },
  title: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 8,
  },
});
