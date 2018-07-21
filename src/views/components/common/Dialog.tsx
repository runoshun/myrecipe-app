import * as React from "react";
import { Text, View } from "react-native";

import Popup, { PopupProperties } from "./Popup";

const defaultStyles = Popup.defaultStyles.extend({
    TUI_DialogContainer: {
        flexDirection: "column",
        minWidth: "70%",
        maxWidth: "85%",
        borderRadius: 4,
        backgroundColor: "#f7f7f7",
        overflow: "hidden",
    },
    TUI_DialogTitle: {
        padding: 12,
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: "center",
    },
    TUI_DialogMessage: {
        paddingHorizontal: 12,
        paddingBottom: 12,
        fontSize: 18,
    },
});

export interface DialogProperties extends PopupProperties {
    title?: string,
    message?: string,
    styles?: typeof defaultStyles,
}

export default class Dialog extends React.Component<DialogProperties> {

    render() {
        const { title, message, styles: s, ...rest } = this.props;
        let styles = s || defaultStyles;
        return (
            <Popup {...rest} styles={styles}>
                <View pointerEvents="auto" style={styles.values.TUI_DialogContainer}>
                    {title && <Text style={styles.values.TUI_DialogTitle}>{title}</Text>}
                    {message && <Text style={styles.values.TUI_DialogMessage}>{message}</Text>}
                    {this.props.children}
                </View>
            </Popup>
        );
    }
};