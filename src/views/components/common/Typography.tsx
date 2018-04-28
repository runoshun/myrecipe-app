import * as React from "react";
import { Text, TextStyle, TextProperties } from "react-native";
import { bindDefaultStyle } from "./utils";

export interface TypographyStyles {
    [name: string]: TextStyle
}

export type Typographies<T, Props> = {
    [P in keyof T]: React.ComponentClass<Props>
};

const create = function <Props extends TextProperties>(Base: React.ComponentType<Props>) {
    return function <T extends TypographyStyles>(styles: T) {
        let typographies: Typographies<T, Props> = ({} as any);

        Object.keys(styles).forEach((key: keyof T) => {
            typographies[key] = bindDefaultStyle(Base, styles[key])
        })
        return typographies;
    }
};

export default {
    createText: create(Text),
};