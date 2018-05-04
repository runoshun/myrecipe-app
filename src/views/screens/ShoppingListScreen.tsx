import * as React from "react";
import { FlatList, SectionList } from "react-native";

import * as Types from "@root/EntityTypes";
import { 
    createContainer,
    createDispacherProps,
    DispatcherProps,
    ThemedViews as V,
    selectors,
    res,
} from "./Imports";

import ShoppingListItem from "@root/views/components/ShoppingListItem";
import { ShoppingListType } from "@root/reducers/app";
import { ShoppingListSectionHeader } from "@root/views/components/ShoppingListSectionHeader";
import { ShoppingListFormScreen } from "@root/views/screens/ShoppingListFormScreen";

export interface ShoppingListScreenProperties extends DispatcherProps {
    listType: ShoppingListType,
    mergedItems: Types.MergedShoppingListItem[],
    withRecipeItems: { [key: string]: Types.ShoppingListItemEntity[] },
    individualItems: Types.ShoppingListItemEntity[],
}

interface State {
}

class MergedShoppingList extends FlatList<Types.MergedShoppingListItem> {}
const WithRecipeShoppingList: SectionList<Types.ShoppingListItemEntity> = SectionList;

export class ShoppingListScreen extends React.Component<ShoppingListScreenProperties, State> {

    private handleToggleCheck = (item: Types.ShoppingListItemEntity) => {
        this.props.entities.toggleShoppingListItemChecked(item.id, item.checked);
    }

    private handleToggleCheckMerged = (item: Types.MergedShoppingListItem) => {
        item.id.forEach(id => 
            this.props.entities.toggleShoppingListItemChecked(id, item.checked)
        );
    }

    private handleAddItem = () => {
        this.props.router.navigate(ShoppingListFormScreen.anchor, { id: undefined })
    }

    private handleEdit = (item: Types.ShoppingListItemEntity) => {
        this.props.router.navigate(ShoppingListFormScreen.anchor, {data: item, id: item.id})
    }

    private handleEditMerged = (item: Types.MergedShoppingListItem) => {
        this.props.router.navigate(ShoppingListFormScreen.anchor, {data: item, id: item.id})
    }

    private handleDeleteMerged = (item: Types.MergedShoppingListItem) => {
        item.id.forEach(id => {
            this.props.entities.deleteShoppingListItem(id);
        });
        V.UndoSnackbar.show({
            message: res.strings.shoppingListItemDeleted(item.name),
            onUndo: () => this.props.entities.undoEntities()
        })
    }

    private handleDelete = (item: Types.ShoppingListItemEntity) => {
        this.props.entities.deleteShoppingListItem(item.id);
        V.UndoSnackbar.show({
            message: res.strings.shoppingListItemDeleted(item.name),
            onUndo: () => this.props.entities.undoEntities()
        })
    }

    private handleClearList = () => {
        if (this.props.individualItems.length > 0) {
            this.props.entities.clearShoppingList();
            V.UndoSnackbar.show({
                message: res.strings.shoppingListCleared(),
                onUndo: () => this.props.entities.undoEntities()
            })
        }
    }

    private setListType = (type: ShoppingListType) => {
        V.AppMenu.hide();
        this.props.app.setShoppingListType(type);
    }

    private showListTypeMenu = () => {
        V.AppMenu.show({
            items: [
                { icon: "albums-outline", label: res.strings.shoppingListTypeMerged(), onPress: () => this.setListType("merged") },
                { icon: "restaurant-outline", label: res.strings.shoppingListTypeWithRecipe(), onPress: () => this.setListType("withRecipe") }
            ]
        });
    }

    render() {
        let isEmpty = this.props.individualItems.length === 0;
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.shoppingListTitle()} 
                    renderRight={() => <V.AppScreenHeaderButton key="clear" icon="trash-outline" onPress={this.handleClearList} disabled={isEmpty} />}
                    renderLeft={() => <V.AppScreenHeaderButton key="listtype" icon="list-outline" onPress={this.showListTypeMenu} />}
                    />
                {isEmpty ? this.renderEmptyView() : this.renderList()}
            </V.Screen>
        );
    }

    private renderList() {
        switch(this.props.listType) {
            case "merged": 
                return this.renderMergedList(this.props.mergedItems)
            case "withRecipe":
                return this.renderWithRecipeList(this.props.withRecipeItems);
            default:
                return null;
        }
    }

    private renderMergedList = (items: Types.MergedShoppingListItem[]) => (
        <MergedShoppingList
            data={items}
            keyExtractor={(item) => item.id[0]}
            renderItem={(info) =>
                <ShoppingListItem
                    name={info.item.name}
                    amount={info.item.amount}
                    unit={info.item.unit}
                    checked={info.item.checked}
                    onDelete={() => this.handleDeleteMerged(info.item)}
                    onEdit={() => this.handleEditMerged(info.item)}
                    onToggleCheck={() => this.handleToggleCheckMerged(info.item)}
                />
            }
            ListFooterComponent={this.renderListFooter}
        />
    );

    private renderWithRecipeList = (items: { [key: string]: Types.ShoppingListItemEntity[] }) => {
        let sections = Object.entries(items).map(([key, value]) => ({ data: value, title: key }));
        return (
            <WithRecipeShoppingList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderSectionHeader={(info) =>
                    <ShoppingListSectionHeader title={info.section.title} />
                }
                renderItem={(info) =>
                    <ShoppingListItem
                        name={info.item.name}
                        amount={info.item.amount}
                        unit={info.item.unit}
                        checked={info.item.checked}
                        onDelete={() => this.handleDelete(info.item)}
                        onEdit={() => this.handleEdit(info.item)}
                        onToggleCheck={() => this.handleToggleCheck(info.item)}
                    />
                }
                ListFooterComponent={this.renderListFooter}
            />
        );
    };

    private renderListFooter = () => <V.TransparentAccentButton icon="add-outline" onPress={this.handleAddItem} />

    private renderEmptyView = () =>
        <V.VBox style={styles.values.emptyViewContainer}>
            <V.Texts.Body style={styles.values.emptyViewTexts}>{res.strings.shoppingListEmptyMessage1()}</V.Texts.Body>
            <V.Texts.AccentBody style={styles.values.emptyViewTexts} onPress={this.handleAddItem}>{res.strings.shoppingListEmptyMessage2()}</V.Texts.AccentBody>
            <V.Texts.Body style={styles.values.emptyViewTexts}>{res.strings.shoppingListEmptyMessage3()}</V.Texts.Body>
        </V.VBox>

}

export default createContainer(ShoppingListScreen)((state, dispatch) => {
    return {
        listType: state.app.shoppingList.listType,
        mergedItems: selectors.entities.mergedShoppingList(state.entities),
        withRecipeItems: selectors.entities.withRecipeShoppingList(state.entities),
        individualItems: selectors.entities.shoppingListArray(state.entities),
        ...createDispacherProps(dispatch)
    }
});

const styles = new V.Stylable({
    emptyViewContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    emptyViewTexts: {
        padding: 4,
    },
})