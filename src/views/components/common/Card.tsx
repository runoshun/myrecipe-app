import * as React from "react";
import { View, Image, ViewStyle, ImageProperties } from "react-native";

import Stylable from "./stylable";

export interface CardProperties {
    style?: ViewStyle,
    styles?: typeof defaultStyles,
    image?: ImageProperties["source"],
    fullImage?: boolean,
}

interface State {
}

const defaultVars = {
    borderRadius: 4,
    imageHeight: (100 as ViewStyle["height"]),
    imageWidth: ("100%" as ViewStyle["width"])
}

type Vars = typeof defaultVars;

const defaultStyles = new Stylable({
    TUI_Card_Container: {
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#ffffff",
        borderRadius: (vars: Vars) => vars.borderRadius,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 0 },
    },
    TUI_Card_ImageWrapper: {
        borderTopLeftRadius: (vars: Vars) => vars.borderRadius,
        borderTopRightRadius: (vars: Vars) => vars.borderRadius,
        overflow: "hidden",
        width: (vars: Vars) => vars.imageWidth,
    },
    TUI_Card_ImageWrapperFull: {
        borderBottomLeftRadius: (vars: Vars) => vars.borderRadius,
        borderBottomRightRadius: (vars: Vars) => vars.borderRadius,
    },
    TUI_Card_Image: {
        width: (vars: Vars) => vars.imageWidth,
        height: (vars: Vars) => vars.imageHeight,
    },
    TUI_Card_ImageFull: {
        width: "100%",
        height: "100%",
    }
}, defaultVars)

export default class Card extends React.Component<CardProperties, State> {
    public static readonly defaultStyles = defaultStyles;

    render() {
        let styles = this.props.styles || defaultStyles;
        let wrapperStyle = [styles.values.TUI_Card_ImageWrapper];
        let imageStyle = styles.values.TUI_Card_Image;
        if (this.props.fullImage) {
            wrapperStyle.push(styles.values.TUI_Card_ImageWrapperFull)
            imageStyle = styles.values.TUI_Card_ImageFull;
        }
        let image = this.props.image ?
            <View style={wrapperStyle}>
                <Image source={this.props.image} resizeMode="cover" style={imageStyle} />
            </View> :
            null;

        return (
            <View style={[styles.values.TUI_Card_Container, this.props.style]}>
                {image}
                {this.props.children}
            </View>
        );
    }
}