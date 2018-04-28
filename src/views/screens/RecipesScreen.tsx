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
import { RecipeFormScreen } from "@root/views/screens/RecipeFormScreen";

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
        this.props.router.navigate(RecipeFormScreen.anchor, {})
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
                                <V.TransparentAccentButton icon="add" style={styles.values.card} onPress={this.onPressAdd} />
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
        width: "45%",
        height: 120,
        margin: 8
    },
    addButton: {
    }
})