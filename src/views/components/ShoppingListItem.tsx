import * as React from "react";
import { View, ViewProperties } from "react-native";

import res from "@root/resources";
import * as V from "@root/views/components/Themed";
import { Expandable } from "./common/anim/PropAnimationView";


export interface ShoppingListItemProperties {
    checked: boolean,
    name: string,
    amount: string,
    onToggleCheck: () => void,
    onDelete: () => void,
    onEdit?: () => void,
    style?: ViewProperties["style"],
}

interface State {
    moreMenuVisible: boolean,
}

export default class ShoppingListItem extends React.Component<ShoppingListItemProperties, State> {

    constructor(p: any) {
        super(p);
        this.state = {
            moreMenuVisible: false,
        }
    }

    private toggleMore = () => {
        this.setState({ moreMenuVisible: !this.state.moreMenuVisible })
    }

    private handleDelete = () => {
        if (this.state.moreMenuVisible) {
            this.props.onDelete();
        }
    }

    private handleEdit = () => {
        if (this.state.moreMenuVisible) {
            this.props.onEdit && this.props.onEdit();
        }
    }

    render() {
        let textStyle = [styles.values.text];
        let lineThroughStyle = [];

        let checked = this.props.checked;
        let name = this.props.name;
        let amount = this.props.amount;

        if (checked) {
            textStyle.push(styles.values.checkedText);
            lineThroughStyle.push(styles.values.lineThrough);
        }

        return (
            <V.Card style={styles.values.card}>
                <V.Touchable onPress={this.props.onToggleCheck}>
                    <V.HBox style={[styles.values.container, this.props.style, {overflow: "visible"}]}>
                        <V.Checkbox checked={checked} styles={checkboxStyles} onIcon="checkmark-circle" offIcon="checkmark-circle-outline" />
                        <V.Texts.Body style={textStyle}>{name}</V.Texts.Body>
                        <View style={{ flex: 1 }} />
                        <V.Texts.Body style={textStyle}>{!amount ? "" : amount}</V.Texts.Body>
                        <Expandable expanded={this.state.moreMenuVisible} animationType={{ type: "width" }} style={styles.values.moreButtonsContainer}>
                            <V.TransparentAccentButton icon={"trash-outline"} onPress={this.handleDelete} style={styles.values.actionButton} />
                            {
                                this.props.onEdit &&
                                <V.TransparentAccentButton icon={"create-outline"} onPress={this.handleEdit} style={styles.values.actionButton} />
                            }
                        </Expandable>
                        <V.TransparentAccentButton icon={this.state.moreMenuVisible ? "close" : "more"} onPress={this.toggleMore} style={styles.values.actionButton} />
                        <View style={lineThroughStyle} />
                    </V.HBox>
                </V.Touchable>
            </V.Card>
        );
    }
}

const checkboxStyles = V.Checkbox.defaultStyles.applyVars({
    checkboxSize: 24,
    colorForeground: res.colors.accent,
}).override({
    TUI_Checkbox: {
        marginRight: 8,
    }
})

const styles = new V.Stylable({
    card: {
        padding: 4,
        marginHorizontal: 8,
        marginVertical: 4,
        shadowOpacity: 0.1,
    },
    container: {
        width: "100%",
        alignItems: "center"
    },
    text: {
    },
    checkedText: {
        opacity: 0.8,
    },
    lineThrough: {
        position: "absolute",
        top: "50%",
        bottom: "50%",
        left: 32,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: res.colors.accent,
    },
    moreButtonsContainer: {
        flexDirection: "row",
    },
    actionButton: {
        padding: 4,
    }
})