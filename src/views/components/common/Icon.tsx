import * as React from "react";
import { TextProperties, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export interface IconProperties extends TextProperties {
    os?: string,
    size?: number,
    color?: string,
    name: string | { [os: string]: string },
}

const mdOutlineIcons = [
    "md-checkbox-outline",
    "md-checkmark-outline",
    "md-cloud-outline",
    "md-heart-outline",
    "md-notifications-outline",
    "md-square-outline",
    "md-star-outline",
];

export const Icon = (props: IconProperties) => {
    let { name, ...restProps } = props;
    let iconName: string;
    let os = props.os || Platform.OS;
    if (typeof name === "string") {
        if (!name.startsWith("md-") && !name.startsWith("ios-") && !name.startsWith("logo-")) {
            iconName = (os == "ios" ? "ios-" : "md-") + name;
        } else {
            iconName = name;
        }

        if (iconName.startsWith("md-") && iconName.endsWith("-outline") && !mdOutlineIcons.includes(iconName)) {
            iconName = iconName.replace("-outline", "");
        }
    } else {
        iconName = name[os];
        if (iconName === undefined) {
            iconName = name[(Object.keys(name)[0])];
        }
    }

    return <Ionicons name={iconName} {...restProps} />
}

export default Icon;