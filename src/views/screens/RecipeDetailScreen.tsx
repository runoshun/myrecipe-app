import * as React from "react";
import { Image, ScrollView } from "react-native";

import * as Types from "@root/EntityTypes";
import IngredientView from "@root/views/components/IngredientView";
import { WebBrowserScreen } from "@root/views/screens/WebBrowserScreen";
import { RecipeFormScreen } from "@root/views/screens/RecipeFormScreen";

import { createAnchor, createContainer, createDispacherProps, DispatcherProps, ThemedViews as V, res, } from "./Imports";
//import { MeelPrepFormScreen } from "@root/views/screens/MeelPrepFormScreen";

export interface RecipesDetailProperties extends DispatcherProps {
    recipes: { [id: string]: Types.RecipeEntity | undefined }
}

interface State {
    moreActionsMenuVisible: boolean,
}
interface ScreenParams {
    recipeId: string
}
const anchor = createAnchor<ScreenParams>("RecipeDetail");

export class RecipeDetailScreen extends React.Component<RecipesDetailProperties, State> {

    public static anchor = anchor;

    constructor(props: any) {
        super(props);
        this.state = {
            moreActionsMenuVisible: false,
        }
    }

    private onPressToShoppingList = (recipe?: Types.RecipeEntity) => {
        if (recipe) {
            this.props.entities.addIngredientsToShoppingList(recipe.ingredients, recipe.id);
            V.UndoSnackbar.show({ 
                message: res.strings.recipeDetailSnackbarMessage(),
                onUndo: () => this.props.entities.undoEntities()
            })
        }
    }

    private handleDeleteRecipe = (recipe?: Types.RecipeEntity) => {
        V.AppActionSheet.hide();
        if (recipe) {
            this.props.entities.deleteRecipe(recipe);
            this.props.router.back();
            V.UndoSnackbar.show({
                message: res.strings.recipeDetailDeletedMessage(),
                onUndo: () => this.props.entities.undoEntities()
            })
        }
    }

    private handleEditRecipe = (recipe?: Types.RecipeEntity) => {
        V.AppActionSheet.hide();
        if (recipe) {
            this.props.router.navigate(RecipeFormScreen.anchor, { data: recipe, id: recipe.id })
        }
    }

    private showMoteActionMenu = (recipe?: Types.RecipeEntity) => {
        V.AppActionSheet.show({
            items: [
                { icon: "create-outline", label: res.strings.recipeDetailEdit(), onPress: () => this.handleEditRecipe(recipe) },
                { icon: "trash-outline", label: res.strings.recipeDetailDelete(), onPress: () => this.handleDeleteRecipe(recipe) }
            ]
        })
    }

    private onPressOpenLink = (link?: string) => {
        link && this.props.router.navigate(WebBrowserScreen.anchor, { uri: link })
    }

    /*
    private addToMeelPrep = (recipe?: Types.RecipeEntity) => {
        if (recipe) {
            this.props.router.navigate(MeelPrepFormScreen.anchor, {
                id: undefined,
                data: {
                    name: recipe.name,
                    photo: recipe.photo,
                    amount: 1,
                    createdAt: Date.now(),
                    expiredAt: NaN,
                }
            })
        }
    }
    */

    render() {
        let recipeId = anchor.getParam(this.props, "recipeId");
        let recipe = recipeId !== undefined ? this.props.recipes[recipeId] : undefined;
        if (recipe) {
            let photo =
                recipe.photo ||
                recipe.photoSecondary ||
                res.images.noImage;
            return (
                <V.Screen>
                    <V.AppScreenHeader
                        title={recipe.name}
                        renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={() => this.props.router.back()} />}
                        /*renderRight={() => <V.AppScreenHeaderButton icon="restaurant-outline" onPress={() => this.addToMeelPrep(recipe)} />} */
                    />
                    <ScrollView style={styles.values.scrollView}>
                        <Image source={{ uri: photo }} style={styles.values.image} />
                        {
                            recipe.ingredients.length > 0 &&
                            <V.Card style={styles.values.contentCard}>
                                <V.Texts.H3 style={styles.values.label}>{res.strings.recipeDetailIngredient()}</V.Texts.H3>
                                {this.renderIngredients(recipe.ingredients)}
                            </V.Card>
                        }
                    </ScrollView>

                    <V.HBox style={styles.values.bottomBar}>
                        { recipe.url !== undefined &&
                            <V.TransparentAccentButton
                                icon="globe-outline"
                                label={res.strings.recipeDetailLink()}
                                onPress={() => this.onPressOpenLink(recipe && recipe.url)}
                                style={styles.values.actionButton} />
                        }
                        {
                            recipe.ingredients.length > 0 &&
                            <V.TransparentAccentButton
                                icon="cart-outline"
                                label={res.strings.recipeDetailToShoppingList()}
                                onPress={() => this.onPressToShoppingList(recipe)}
                                style={styles.values.actionButton} />
                        }
                        <V.TransparentAccentButton
                            icon="more-outline"
                            style={styles.values.actionButton}
                            onPress={() => this.showMoteActionMenu(recipe)} />
                    </V.HBox>
                </V.Screen>
            );
        }
        return null
    }

    renderIngredients(ingredients: Types.Ingredient[]) {
        return (
            ingredients.map((ingredient,index) =>
                <IngredientView key={index} item={ingredient} style={styles.values.ingredients} />
            )
        );
    }
}

export default createContainer(RecipeDetailScreen)((state, dispatch) => ({
    recipes: state.entities.present.recipes,
    ...createDispacherProps(dispatch)
}));

const styles = new V.Stylable({
    scrollView: {
        width: "100%",
    },
    image: {
        width: "100%",
        height: 200,
    },
    name: {
        alignSelf: "stretch",
        backgroundColor: "#00000090",
        color: "#ffffff",
        padding: 8,
        ...res.styles.absolute(0, 0, undefined, 0)
    },
    contentCard: {
        margin: 8,
        shadowOpacity: 0.1
    },
    label: {
        padding: 8,
    },
    ingredients: {
        ...res.styles.padding(4, 16)
    },
    actionButton: {
    },
    bottomBar: {
        backgroundColor: res.colors.background,
        borderTopWidth: 1,
        borderTopColor: res.colors.lightGray,
        alignSelf: "stretch",
        justifyContent: "flex-end",
        padding: 8,
    },
});