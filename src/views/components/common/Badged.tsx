import * as React from 'react';
import { View, Text } from "react-native";
import Stylable from "./stylable";

export interface BadgedProperties {
    badge?: string | number | JSX.Element,
    styles?: typeof defaultStyles,
}

const defaultVars = {
    colorBadgeBackground: "red",
    colorBadgeForeground: "white",
}
type Vars = typeof defaultVars;

const defaultStyles = new Stylable({
    TUI_BadgeContainer: {
    },
    TUI_BadgeBackground: {
        position: "absolute",
        padding: 8,
        top: -12,
        right: -12,
        backgroundColor: (vars: Vars) => vars.colorBadgeBackground,
        borderRadius: 32,
    },
    TUI_BadgeText: {
        color: (vars: Vars) => vars.colorBadgeForeground,
    }
}, defaultVars);

export default class Badged extends React.Component<BadgedProperties> {

    private renderBadge = (styles: typeof defaultStyles): JSX.Element | undefined => {
        let content: JSX.Element;
        if (typeof this.props.badge === "undefined") {
            return undefined;
        } else if (typeof this.props.badge === "number" || typeof this.props.badge === "string") {
            content = <Text style={styles.values.TUI_BadgeText}>{this.props.badge}</Text>
        } else {
            content = this.props.badge;
        }

        return (
            <View style={styles.values.TUI_BadgeBackground}>
                {content}
            </View>
        );
    }

    render() {
        let styles = this.props.styles || defaultStyles;
        return (
            <View style={[styles.values.TUI_BadgeContainer]}>
                {this.props.children}
                {this.renderBadge(styles)}
            </View>
        );
    }
}