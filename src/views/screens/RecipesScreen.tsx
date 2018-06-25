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
    res,
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
                {
                    this.props.recipes.length > 0 ? this.renderList() : this.renderEmpty()
                }
            </V.Screen>
        );
    }

    renderList = () => (
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
                        <V.FullAccentButton icon="add" style={styles.values.addButton} onPress={this.onPressAdd} />
                    );
                }
            }}
        />
    );

    renderEmpty = () => (
        <V.VBox style={styles.values.emptyViewContainer}>
            <V.Texts.Body style={styles.values.emptyViewTexts}>{res.strings.recipeListEmptyMessage1()}</V.Texts.Body>
            <V.Texts.AccentBody style={styles.values.emptyViewTexts} onPress={this.onPressAdd}>{res.strings.recipeListEmptyMessage2()}</V.Texts.AccentBody>
        </V.VBox>
    )
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
        width: "46%",
        height: 120,
        marginHorizontal: "2%",
        marginVertical: 8,
    },
    emptyViewContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    emptyViewTexts: {
        padding: 4,
    },
})
