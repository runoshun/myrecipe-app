import * as React from "react";
import { View, Image, StyleSheet, ImageProperties, Platform } from "react-native";

export interface ScreenProperties {
    centered?: boolean,
    noHeader?: boolean,
    backgroundImage?: ImageProperties["source"],
}

export const Screen: React.StatelessComponent<ScreenProperties> = (props) => {
    let style = [styles.screen];
    if (props.centered) {
        style.push(styles.centered)
    }
    if (props.noHeader) {
        style.push(styles.noHeader)
    }

    let image = props.backgroundImage &&
        <Image
            source={props.backgroundImage}
            style={styles.image}
            resizeMode="stretch" />;
    return (
        <View style={style}>
            {props.children}
            {image}
        </View>
    )
}


export default Screen;

const statusBarPadding = (Platform.OS == "ios") ? 20 : 0;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "transparent",
    },
    centered: {
        justifyContent: "center",
        alignItems: "center"
    },
    noHeader: {
        paddingTop: statusBarPadding,
    },
    image: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1000,
    }
});