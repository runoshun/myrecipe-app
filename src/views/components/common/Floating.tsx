import * as React from 'react';
import { View, ViewStyle, ViewProperties } from "react-native";

import Stylable from "./stylable";

export type FloatingPosition = {row: ViewStyle["alignSelf"], col: ViewStyle["justifyContent"]}
export const defaultPosition: FloatingPosition = { row: "flex-end", col: "flex-end" };

const defaultVars = {
    shadow: true,
};

type Vars = typeof defaultVars;

const defaultFloatingStyles = new Stylable({
    TUI_Floating_Wrapper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    TUI_Floating_Inner: {
        elevation: (vars: Vars) => vars.shadow ? 5 : 0,
        shadowColor: "#000000",
        shadowOpacity: (vars: Vars) => vars.shadow ? 0.3: 0,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    }
}, defaultVars);

export type FloatingProperties = {
    floatingPosition?: FloatingPosition,
    pointerEvents?: ViewProperties["pointerEvents"],
    styles?: typeof defaultFloatingStyles,
};

export default class Floating extends React.Component<FloatingProperties> {

    public static readonly defaultStyles = defaultFloatingStyles;

    render() {
        let { floatingPosition, children } = this.props;
        let ss = this.props.styles;
        if (ss === undefined) {
            ss = defaultFloatingStyles;
        };

        let colStyle = {
            justifyContent: floatingPosition ?
                floatingPosition.col :
                defaultPosition && defaultPosition.col
        };
        let rowStyle = {
            alignSelf: floatingPosition ?
                floatingPosition.row :
                defaultPosition && defaultPosition.row
        };

        let pointerEvents = this.props.pointerEvents || "box-none";

        return (
            <View pointerEvents={pointerEvents} style={[ss.values.TUI_Floating_Wrapper, colStyle]}>
                <View style={[ss.values.TUI_Floating_Inner, rowStyle]}>
                    {children}
                </View>
            </View>
        );
    }
}