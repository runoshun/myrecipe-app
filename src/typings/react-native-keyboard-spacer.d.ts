declare module "react-native-keyboard-spacer" {

    import * as React from "react";
    import { LayoutAnimationConfig, ViewProperties } from "react-native";

    export interface KeyboardSpacerProperties {
        topSpacing?: number,
        animationConfig?: LayoutAnimationConfig,
        onToggle?: (toggleState: boolean, keyboardSpace: number) => void,
        style?: ViewProperties["style"],
    }

    export default class KeyboardSpacer extends React.Component<KeyboardSpacerProperties> { }
}