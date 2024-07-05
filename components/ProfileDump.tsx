import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useProfile } from "@ninetailed/experience.js-react";

export default function ProfileDump() {
  const { profile } = useProfile();
  return (
    <ScrollView style={styles.container}>
      <Text>Profile:</Text>
      <Text>{JSON.stringify(profile, null, 2)}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
  },
});
