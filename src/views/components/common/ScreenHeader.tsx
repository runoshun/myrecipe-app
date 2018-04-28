import * as React from 'react';
import { View, Text, Platform } from "react-native";

import Button, { ButtonProperties } from "./Button";
import Stylable from "./stylable";

const defaultVars = {
    colorBackground: Platform.OS === "ios" ? "#f7f7f7" : "#fff",
    colorForeground: "#000",
    textSizeTitle: 18,
    dimNavBarHeight: 44,
};

type Vars = typeof defaultVars;

const statusBarPadding = (Platform.OS == "ios") ? 20 : 0;

const defaultStyles = new Stylable({
    TUI_Header: {
        backgroundColor: (v: Vars) => v.colorBackground,
        height: (v: Vars) => v.dimNavBarHeight + statusBarPadding,
        paddingTop: statusBarPadding,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    TUI_HeaderTitle: {
        color: (v: Vars) => v.colorForeground,
        fontSize: (v: Vars) => v.textSizeTitle,
        fontWeight: "bold",
        marginHorizontal: 48,
    },
    TUI_HeaderButtons: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        top: statusBarPadding,
        left: 0,
        right: 0,
        bottom: 0,
    },
    TUI_HeaderLeft: {
        flexDirection: "row",
        marginLeft: 4,
    },
    TUI_HeaderRight: {
        flexDirection: "row",
        marginRight: 4,
    },
}, defaultVars);

export interface ScreenHeaderProperties {
    title?: string,
    renderCenter?: (tintColor: string) => JSX.Element | JSX.Element[] | null,
    renderLeft?: (tintColor: string) => JSX.Element | JSX.Element[] | null,
    renderRight?: (tintColor: string) => JSX.Element | JSX.Element[] | null,
    styles?: typeof defaultStyles,
};

interface State {
    showBack: boolean,
}

export default class ScreenHeader extends React.Component<ScreenHeaderProperties, State> {

    public static defaultStyles = defaultStyles;

    render() {
        let props = this.props;
        let s = this.props.styles || defaultStyles;

        let tint = s.rawVars.colorForeground;
        return (
            <View style={s.values.TUI_Header}>
                {
                    props.renderCenter
                        ? props.renderCenter(tint)
                        : <Text numberOfLines={1} ellipsizeMode="tail" style={s.values.TUI_HeaderTitle}>{props.title}</Text>
                }
                <View style={s.values.TUI_HeaderButtons}>
                    <View style={s.values.TUI_HeaderLeft}>
                        {props.renderLeft && props.renderLeft(tint)}
                    </View>
                    <View style={s.values.TUI_HeaderRight}>
                        {props.renderRight && props.renderRight(tint)}
                    </View>
                </View>
            </View>
        );
    }
}

const screenHeaderButtonStyles = Button.defaultStyles.override({
    TUI_ButtonContainer: {
        padding: 4,
    },
}).applyVars({
    colorBackground: "transparent",
    iconSize: 32,
    marginUnit: 0,
});

export interface ScreenHeaderButtonProperties extends ButtonProperties {
    tintColor?: string
}

export const ScreenHeaderButton = (props: ScreenHeaderButtonProperties) => {
    let { tintColor, styles, ...rest } = props;

    let ss = styles || screenHeaderButtonStyles;
    if (tintColor) {
        let vars = { colorForeground: tintColor };
        ss = ss.applyVars(vars)
    } 
    return <Button {...rest} styles={ss} />
}