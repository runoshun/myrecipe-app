import * as React from "react";
import { View, TouchableOpacity, ViewProperties } from "react-native";

import res from "@root/resources";
import * as Types from "@root/EntityTypes";
import * as V from "./Themed";

export interface RecipeCardProperties {
    recipe: Types.RecipeEntity,
    showDetail: boolean,
    style?: ViewProperties["style"],
    onPress?: (recipe: Types.RecipeEntity) => void,
}

interface State {
}

export default class RecipeCard extends React.Component<RecipeCardProperties, State> {

    onPressRecipe = () => {
        this.props.onPress && this.props.onPress(this.props.recipe);
    }

    render() {
        let photo =
            this.props.recipe.photo ||
            this.props.recipe.photoSecondary ||
            res.images.noImage;
        return (
            <TouchableOpacity activeOpacity={0.8} style={this.props.style} onPress={this.onPressRecipe}>
                <V.Card fullImage styles={cardStyles} image={{ uri: photo }}>
                    <View style={styles.values.nameContainer}>
                        <V.Texts.Body style={styles.values.name} ellipsizeMode="tail" numberOfLines={1}>
                            {this.props.recipe.name}
                        </V.Texts.Body>
                    </View>
                </V.Card>
            </TouchableOpacity>
        );
    }
}

const radius = 4;

const cardStyles = V.Card.defaultStyles.applyVars({
    borderRadius: radius,
});

const styles = new V.Stylable({
    nameContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#00000090",
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
    },
    name: {
        color: res.colors.white,
        margin: 8,
    }
});