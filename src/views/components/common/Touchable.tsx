import * as React from "react";
import {
     Platform, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback,
     TouchableWithoutFeedbackProperties, BackgroundPropType
} from "react-native";

const useRipple = (Platform.OS === "android" && Platform.Version >= 21);

export interface TouchableProperties extends TouchableWithoutFeedbackProperties {
    background?: BackgroundPropType;
    useForeground?: boolean;
    activeOpacity?: number;
    withoutFeedback?: boolean;
}

export default class Touchable extends React.Component<TouchableProperties> {
    render() {
        const {children, background, useForeground, activeOpacity, withoutFeedback, ...props} = this.props;
        if (withoutFeedback) {
            return (
                <TouchableWithoutFeedback {...props}>
                    {children}
                </TouchableWithoutFeedback>
            );
        } else if (useRipple) {
            return (
                <TouchableNativeFeedback
                    background={background}
                    useForeground={useForeground}
                    {...props}>
                    {children}
                </TouchableNativeFeedback>
            );
        } else {
            return (
                <TouchableOpacity activeOpacity={activeOpacity} {...props}>
                    {children}
                </TouchableOpacity>
            );
        }
    }

    static Ripple = (color: string, borderless?: boolean) => {
        if (useRipple) {
            return (TouchableNativeFeedback as any).Ripple(color, borderless);
        }
        else {
            return undefined;
        }
    }
}
