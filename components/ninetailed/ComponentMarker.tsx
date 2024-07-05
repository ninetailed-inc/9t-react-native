import { useEffect, useRef, forwardRef } from "react";
import { View } from "react-native";

export const ComponentMarker = forwardRef((_, ref) => {
  // TODO: What types to use with React Native for useRef?
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      const observableElement = getObservableElement(markerRef.current);

      if (ref) {
        if (typeof ref === "function") {
          ref(observableElement);
        } else {
          ref.current = observableElement;
        }
      }
    }
  }, []);

  return <View style={{ display: "none" }} ref={markerRef} />;
});

const getObservableSibling = (element: Element): Element | null => {
  const nextSibling = element.nextElementSibling;

  if (!nextSibling) {
    return null;
  }

  const nextSiblingStyle = getComputedStyle(nextSibling);

  // Elements with display: none are not observable by the IntersectionObserver
  if (nextSiblingStyle.display !== "none") {
    return nextSibling;
  }

  return getObservableSibling(nextSibling);
};

const getObservableElement = (element: Element): Element | null => {
  const observableSibling = getObservableSibling(element);

  if (observableSibling) {
    return observableSibling;
  }

  const { parentElement } = element;

  if (!parentElement) {
    return null;
  }

  return getObservableElement(parentElement);
};

ComponentMarker.displayName = "ComponentMarker";
