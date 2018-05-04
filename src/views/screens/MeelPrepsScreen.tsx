import * as React from "react";

import * as Types from "@root/EntityTypes";
import { 
    createContainer,
    createDispacherProps,
    DispatcherProps,
    ThemedViews as V,
    res,
    selectors,
} from "./Imports";
import { FlatList } from "react-native";

import MeelPrepListItem from "../components/MeelPrepListItem";
import { MeelPrepFormScreen } from "@root/views/screens/MeelPrepFormScreen";

export interface StocksScreenProperties extends DispatcherProps {
    meelPreps: Types.MeelPrepEntity[],
}

interface State {
}

class MeelPrepList extends FlatList<Types.MeelPrepEntity> {};

export class MeelPrepsScreen extends React.Component<StocksScreenProperties, State> {

    render() {
        let isEmpty = this.props.meelPreps.length === 0;
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()} />
                {isEmpty ? this.renderEmptyView() : this.renderList()}
            </V.Screen>
        );
    }

    private handleAddItem = () => {
        this.props.router.navigate(MeelPrepFormScreen.anchor, { id: undefined });
    }

    private handleDeleteItem = (item: Types.MeelPrepEntity) => {
        this.props.entities.deleteMeelPrep(item.id);
        V.UndoSnackbar.show({
            message: res.strings.meelPrepsDeleted(item.name),
            onUndo: this.props.entities.undoEntities,
        })
    }

    private handleEditItem = (item: Types.MeelPrepEntity) => {
        this.props.router.navigate(MeelPrepFormScreen.anchor, { data: item, id: item.id })
    }

    private renderEmptyView = () => 
        <V.VBox style={styles.values.emptyViewContainer}>
            <V.Texts.Body style={styles.values.emptyViewTexts}>{res.strings.meelPrepsEmptyMessage1()}</V.Texts.Body>
            <V.Texts.AccentBody style={styles.values.emptyViewTexts} onPress={this.handleAddItem}>{res.strings.meelPrepsEmptyMessage2()}</V.Texts.AccentBody>
            <V.Texts.Body style={styles.values.emptyViewTexts}>{res.strings.meelPrepsEmptyMessage3()}</V.Texts.Body>
        </V.VBox>

    private renderList = () => {
        return (
            <MeelPrepList
                data={this.props.meelPreps}
                keyExtractor={(item) => item.id}
                renderItem={(info) =>
                    <MeelPrepListItem
                        name={info.item.name}
                        amount={info.item.amount}
                        photo={info.item.photo}
                        createdAt={info.item.createdAt}
                        expiredAt={info.item.expiredAt}
                        onDelete={() => this.handleDeleteItem(info.item)}
                        onEdit={() => this.handleEditItem(info.item)}
                        />
                }
                ListFooterComponent={<V.TransparentAccentButton icon="add-outline" onPress={this.handleAddItem} />}
            />
        );
    }
}

export default createContainer(MeelPrepsScreen)((state, dispatch) => {
    return {
        meelPreps: selectors.entities.meelPrepsArray(state.entities),
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