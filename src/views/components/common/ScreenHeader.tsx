import * as React from 'react';
import { View, Text, Platform } from "react-native";

import rn from "@root/utils/rn";
import Button, { ButtonProperties } from "./Button";
import Stylable from "./stylable";

const defaultStatusBarPadding = 
    (Platform.OS == "ios") ? 20 :
    rn.isRunningOnExpo() ? 28 : 0;

const defaultVars = {
    colorBackground: Platform.OS === "ios" ? "#f7f7f7" : "#fff",
    colorForeground: "#000",
    colorBorderBottom: "#ccc",
    textSizeTitle: 18,
    navBarHeight: 44,
    statusBarPadding: defaultStatusBarPadding,
};

type Vars = typeof defaultVars;

const defaultStyles = new Stylable({
    TUI_Header: {
        backgroundColor: (v: Vars) => v.colorBackground,
        height: (v: Vars) => v.navBarHeight + v.statusBarPadding,
        paddingTop: (v: Vars) => v.statusBarPadding,
        borderBottomColor: (v: Vars) => v.colorBorderBottom,
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
        justifyContent: "center",
        alignItems: "center",
        top: (v: Vars) => v.statusBarPadding,
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
                    <View style={{flex: 1}} />
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
        padding: 8,
    },
}).applyVars({
    colorBackground: "transparent",
    iconSize: 32,
    marginUnit: 0,
});

export interface ScreenHeaderButtonProperties extends ButtonProperties {
    tintColor?: string
}

export class ScreenHeaderButton extends React.Component<ScreenHeaderButtonProperties> {
    public static defaultStyles = screenHeaderButtonStyles;
    render() {
        let { tintColor, styles, ...rest } = this.props;

        let ss = styles || screenHeaderButtonStyles;
        if (tintColor) {
            let vars = { colorForeground: tintColor };
            ss = ss.applyVars(vars)
        }
        return <Button {...rest} styles={ss} />
    }
}