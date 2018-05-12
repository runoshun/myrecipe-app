import * as React from "react";
import { FlatList, SectionList, Image, View } from "react-native";

import { 
    createContainer,
    createDispacherProps,
    createAnchor,
    DispatcherProps,
    ThemedViews as V,
    res,
} from "./Imports";
import { WebBrowserScreen } from "@root/views/screens/WebBrowserScreen";
import { RecipeFormScreen } from "@root/views/screens/RecipeFormScreen";

export interface AddRecipeScreenProperties extends DispatcherProps {
}

interface State {
}

interface Params {
}

type AddMethod =
    | { type: "browser", uri: string, icon: string, title: string }
    | { type: "form", icon: string, title: string }
    ;

class AddMethodList extends FlatList<AddMethod> {}

const methodlList: AddMethod[] = [
    { type: "browser", icon: res.images.noImage, uri: "https://www.google.com", title: "Google" },
    { type: "browser", icon: res.images.noImage, uri: "https://erecipe.woman.excite.co.jp", title: "E レシピ" },
    { type: "form", icon: res.images.noImage, title: "自分で追加" }
] 

export class AddRecipeScreen extends React.Component<AddRecipeScreenProperties, State> {

    public static anchor = createAnchor<Params>("AddRecipe");

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.addRecipeTitle()} 
                    renderLeft={() => <V.AppScreenHeaderButton key="close" icon="close" onPress={() => this.props.router.back("AddRecipe")} />} />
                <AddMethodList
                    data={methodlList}
                    keyExtractor={item => item.title}
                    ItemSeparatorComponent={() => <View style={styles.values.itemSeparator} />}
                    renderItem={info => {
                        let item = info.item;
                        switch(item.type) {
                            case "browser":
                                return this.renderItem(item.icon, item.title, this.openBrowser.bind(this, item.uri));
                            case "form":
                                return this.renderItem(item.icon, item.title, this.openForm.bind(this));
                        }
                    }}
                />
            </V.Screen>
        );
    }

    private renderItem(icon: string, title: string, onPressHandler: () => void) {
        return (
            <V.Touchable onPress={onPressHandler}>
                <V.HBox style={styles.values.itemContainer}>
                    <Image source={{ uri: icon }} style={styles.values.itemImage} />
                    <V.Texts.H3 style={styles.values.itemTitle}>{title}</V.Texts.H3>
                    <V.Icon name="arrow-forward" style={styles.values.itemArrow} />
                </V.HBox>
            </V.Touchable>
        );
    }

    private openBrowser(uri: string) {
        this.props.router.navigate(WebBrowserScreen.anchor, { uri })
    }

    private openForm() {
        this.props.router.navigate(RecipeFormScreen.anchor, { id: undefined })
    }
}

export default createContainer(AddRecipeScreen)((_state, dispatch) => createDispacherProps(dispatch));

const styles = new V.Stylable({
    itemContainer: {
        alignItems: "center",
        padding: 8,
    },
    itemImage: {
        width: 40,
        height: 40,
    },
    itemTitle: {
        flex: 1,
        marginLeft: 12,
    },
    itemArrow: {
        fontSize: 18,
    },
    itemSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: res.colors.lightGray,
    }
})
