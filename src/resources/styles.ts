import { ViewStyle } from "react-native";

export const shadow = (elevation: number): ViewStyle => ({
    elevation,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#000000",
    shadowOpacity: 0.6,
    shadowRadius: elevation,
})

export const absolute = (top?: number, right?: number, bottom?: number, left?: number): ViewStyle => ({
    position: "absolute",
    top,
    right,
    bottom,
    left,
})

export const margin = (top: number | string, right = top, bottom = top, left = right): ViewStyle => ({
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left,
});

export const padding = (top: number | string, right = top, bottom = top, left = right): ViewStyle => ({
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
});