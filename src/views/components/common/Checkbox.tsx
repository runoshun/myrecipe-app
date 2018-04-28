import * as React from "react";
import { TextProperties } from "react-native";
import Icon from "./Icon";

import Stylable from "./stylable";

const defaultVars = {
    colorForeground: "#000",
    opacityOff: 0.8,
    checkboxSize: 16,
}

const defaultStyles = new Stylable({
    TUI_Checkbox: {
        color: (vars: any) => vars.colorForeground,
        fontSize: (vars: any) => vars.checkboxSize,
        paddingHorizontal: 4,
    },
    TUI_CheckboxOn: {
    },
    TUI_CheckboxOff: {
        opacity: (vars: any) => vars.opacityOff,
    }
}, defaultVars);

interface CheckboxProperties extends TextProperties {
    checked?: boolean,
    onIcon?: string,
    offIcon?: string,
    styles?: typeof defaultStyles,
}

export default class Checkbox extends React.Component<CheckboxProperties> {

    public static defaultStyles = defaultStyles;

    render() {
        let { checked, style, onIcon, offIcon, styles, ...rest } = this.props;
        let ss = styles || defaultStyles;
        let iconName;
        if (checked) {
            iconName = onIcon ? onIcon : "checkbox";
        } else {
            iconName = offIcon ? offIcon : (onIcon ? onIcon : "square-outline")
        }
        let style_ = checked ? ss.values.TUI_CheckboxOn : ss.values.TUI_CheckboxOff;
        return <Icon name={iconName} style={[ss.values.TUI_Checkbox, style_, style]} {...rest} />
    }
};