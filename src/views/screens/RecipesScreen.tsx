import * as React from "react";
import { FlatList } from "react-native";

import * as Types from "@root/EntityTypes";
import { 
    createContainer,
    createDispacherProps,
    DispatcherProps,
    ThemedViews as V,
    strings,
    selectors,
} from "./Imports";

import RecipeCard from "@root/views/components/RecipeCard";
import { RecipeDetailScreen } from "./RecipeDetailScreen";
import { AddRecipeScreen } from "@root/views/screens/AddRecipeScreen";

export interface RecipesScreenProperties extends DispatcherProps {
    recipes: Types.RecipeEntity[],
}

interface State {
}

class RecipeFlatList extends FlatList<Types.RecipeEntity | string> {}

export class RecipesScreen extends React.Component<RecipesScreenProperties, State> {

    onPressCard = (recipe: Types.RecipeEntity) => {
        this.props.router.navigate(RecipeDetailScreen.anchor, { recipeId: recipe.id });
    }

    onPressAdd = () => {
        this.props.router.navigate(AddRecipeScreen.anchor, { })
    }

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={strings.recipesTitle()} />
                <RecipeFlatList
                    numColumns={2}
                    keyExtractor={recipe => typeof recipe === "string" ? recipe : recipe.id}
                    data={[...this.props.recipes, "addButton"]}
                    renderItem={(info) => {
                        if (typeof info.item !== "string") {
                            return <RecipeCard
                                recipe={info.item}
                                onPress={this.onPressCard}
                                showDetail={false}
                                style={styles.values.card} />
                        } else {
                            return (
                                <V.Card style={styles.values.card}>
                                    <V.FullAccentButton icon="add" style={styles.values.addButton} onPress={this.onPressAdd} />
                                </V.Card>
                            );
                        }
                    }}
                />
            </V.Screen>
        );
    }
}

export default createContainer(RecipesScreen)((state, dispatch) => ({
    recipes: selectors.entities.recipesArray(state.entities),
    ...createDispacherProps(dispatch)
}));

const styles = new V.Stylable({
    card: {
        width: "46%",
        height: 120,
        marginHorizontal: "2%",
        marginVertical: 8,
    },
    addButton: {
        flex: 1,
        flexDirection: "row",
    }
})