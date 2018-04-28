import * as React from "react";
import { Text, View, ViewStyle, ViewProperties } from "react-native";

import Icon from "./Icon";
import Touchable, { TouchableProperties } from './Touchable';
import Stylable from "./stylable";

const defaultVars = {
    colorForeground: "#fff",
    colorBackground: "#000",
    iconSize: 24,
    labelSize: 16,
    marginUnit: 4,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#00000000",
};

type Vars = typeof defaultVars;

const defaultStyles = new Stylable({
    TUI_ButtonContainer: {
        backgroundColor: (vars: Vars) => vars.colorBackground,
        alignItems: "center",
        justifyContent: "center",
        flex:1,
        borderRadius: (vars: Vars) => vars.borderRadius,
        borderWidth: (vars: Vars) => vars.borderWidth,
        borderColor: (vars: Vars) => vars.borderColor,
    },
    TUI_ButtonText: {
        margin: (vars: Vars) => vars.marginUnit * 2,
        color: (vars: Vars) => vars.colorForeground,
        fontSize: (vars: Vars) => vars.labelSize,
    },
    TUI_ButtonIcon: {
        color: (vars: Vars) => vars.colorForeground,
        fontSize: (vars: Vars) => vars.iconSize,
        width: (vars: Vars) => vars.iconSize,
        height: (vars: Vars) => vars.iconSize,
        textAlign: "center",
        alignSelf: "center",
    },
    TUI_ButtonIconTop: {
        marginTop: (vars: Vars) => vars.marginUnit,
        marginBottom: (vars: Vars) => - vars.marginUnit,
    },
    TUI_ButtonIconLeft: {
        marginLeft: (vars: Vars) => vars.marginUnit * 2,
    },
    TUI_ButtonIconRight: {
        marginRight: (vars: Vars) => vars.marginUnit * 2,
    },
    TUI_ButtonIconBottom: {
        marginTop: (vars: Vars) => - vars.marginUnit,
        marginBottom: (vars: Vars) => vars.marginUnit,
    },
    TUI_ButtonIconNoLabel: {
        margin: (vars: Vars) => vars.marginUnit,
    },
    TUI_ButtonDisabled: {
        opacity: 0.2
    }
}, defaultVars);

export interface ButtonProperties extends TouchableProperties, ViewProperties {
    label?: string,
    icon?: string,
    iconPosition?: "left" | "right" | "top" | "bottom",
    styles?: typeof defaultStyles,
}

export default class Button extends React.Component<ButtonProperties> {

    public static defaultStyles = defaultStyles;

    render() {
        let { label, icon, disabled,
            onPress, onLongPress, onPressIn, onPressOut,
            delayLongPress, delayPressIn, delayPressOut,
            iconPosition, style, styles, ...rest } = this.props;
        let s = styles || defaultStyles;

        let dir: ViewStyle["flexDirection"] = undefined;
        let iconStyle: any = undefined;
        if (this.props.label) {
            switch (this.props.iconPosition || "left") {
                case "left": dir = "row"; iconStyle = s.values.TUI_ButtonIconLeft; break;
                case "right": dir = "row-reverse"; iconStyle = s.values.TUI_ButtonIconRight; break;
                case "top": dir = "column"; iconStyle = s.values.TUI_ButtonIconTop; break;
                case "bottom": dir = "column-reverse"; iconStyle = s.values.TUI_ButtonIconBottom; break;
            }
        } else {
            iconStyle = s.values.TUI_ButtonIconNoLabel;
        }

        let disabledStyle = disabled && s.values.TUI_ButtonDisabled;

        return (
            <Touchable
                style={style} disabled={disabled}
                onPress={onPress} onLongPress={onLongPress} onPressIn={onPressIn} onPressOut={onPressOut}
                delayLongPress={delayLongPress} delayPressIn={delayPressIn} delayPressOut={delayPressOut}>
                <View style={[s.values.TUI_ButtonContainer, { flexDirection: dir }, disabledStyle]} {...rest}>
                    {icon ? <Icon name={icon} style={[s.values.TUI_ButtonIcon, iconStyle]} /> : null}
                    {this.props.children}
                    {label ? <Text style={s.values.TUI_ButtonText}>{label}</Text> : null}
                </View>
            </Touchable>
        );
    }
} 
