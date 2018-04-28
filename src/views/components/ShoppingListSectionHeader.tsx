import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";

export interface ShoppingListSectionHeaderProperties {
    title: string
}

export const ShoppingListSectionHeader = (props: ShoppingListSectionHeaderProperties) => {
    return (
        <V.HBox style={styles.values.container}>
            <V.Icon name="book" style={styles.values.icon} />
            <V.Texts.Body
                numberOfLines={1}
                style={styles.values.text}>
                {props.title}
            </V.Texts.Body>
        </V.HBox>
    );
}

const styles = new V.Stylable({
    container: {
        backgroundColor: res.colors.accentThin,
        alignItems: "center",
    },
    text: {
        color: res.colors.white,
        fontWeight: "bold",
        padding: 8
    },
    icon: {
        fontSize: 18,
        paddingLeft: 8,
        color: res.colors.white,
    }
})

export default ShoppingListSectionHeader;