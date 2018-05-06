import * as React from "react";
import { View, ViewProperties } from "react-native";

import * as V from "@root/views/components/Themed";

export interface IngredientViewProperties {
    item: {
        name: string,
        amount: string,
    },
    style?: ViewProperties["style"],
}

interface State {
}

export default class IngredientView extends React.Component<IngredientViewProperties, State> {
    render() {
        return (
            <V.HBox style={this.props.style}>
                <V.Texts.Body>{this.props.item.name}</V.Texts.Body>
                <View style={{ flex: 1 }} />
                <V.Texts.Body>{this.props.item.amount || ""}</V.Texts.Body>
            </V.HBox>
        );
    }
}