import * as React from "react";
import { View, ViewProperties, ViewStyle } from "react-native";

import Stylable from "./stylable";

export interface BoxProperties extends ViewProperties {
    alignItems?: ViewStyle["alignItems"];
    justifyContent?: ViewStyle["justifyContent"];
}

export const HBox: React.StatelessComponent<BoxProperties> = (props) => {
    let { style, alignItems, justifyContent, ...rest } = props;
    let _alignItems = alignItems;
    let _justifyContent = justifyContent;
    let layoutStyle = { alignItems: _alignItems, justifyContent: _justifyContent };
    return <View {...rest} style={[styles.values.TUI_HBox, layoutStyle, style]} />
}

export const VBox: React.StatelessComponent<BoxProperties> = (props) => {
    let { style, alignItems, justifyContent, ...rest } = props;
    let _alignItems = alignItems;
    let _justifyContent = justifyContent;
    let layoutStyle = { alignItems: _alignItems, justifyContent: _justifyContent };
    return <View {...rest} style={[styles.values.TUI_VBox, layoutStyle, style]} />
}

const styles = new Stylable({
    TUI_HBox: {
        flexDirection: "row"
    },
    TUI_VBox: {
        flexDirection: "column"
    }
})
