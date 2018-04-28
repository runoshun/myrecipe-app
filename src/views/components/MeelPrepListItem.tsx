import * as React from "react";
import { View, ViewProperties, Image } from "react-native";

import res from "@root/resources";
import * as V from "@root/views/components/Themed";
import { Expandable } from "./common/anim/PropAnimationView";

export interface MeelPrepItemProperties {
    name: string,
    amount: number,
    createdAt?: number,
    expiredAt?: number,
    photo?: string,

    onDelete: () => void,
    onEdit?: () => void,
    style?: ViewProperties["style"],
}

interface State {
    moreMenuVisible: boolean,
}

export default class MeelPrepItem extends React.Component<MeelPrepItemProperties, State> {

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
        let name = this.props.name;
        let amount = this.props.amount;
        let createdAt = this.props.createdAt;
        let expiredAt = this.props.expiredAt;
        let photo = this.props.photo;

        return (
            <V.Card style={styles.values.card}>
                <V.HBox style={[styles.values.container, this.props.style, { overflow: "visible" }]}>
                    <Image source={{uri: photo}} style={styles.values.image} />
                    <V.VBox>
                        <V.Texts.H3 style={textStyle}>{name}</V.Texts.H3>
                        <V.Texts.Body style={textStyle}>{createdAt ? res.strings.meelPrepsCreated(createdAt) : ""}</V.Texts.Body>
                        <V.Texts.Body style={textStyle}>{expiredAt ? res.strings.meelPrepsExpired(expiredAt) : ""}</V.Texts.Body>
                    </V.VBox>
                    <View style={{ flex: 1 }} />
                    <V.Texts.Body style={textStyle}>{isNaN(amount) ? "" : amount}</V.Texts.Body>
                    <Expandable expanded={this.state.moreMenuVisible} animationType={{ type: "width" }} style={styles.values.moreButtonsContainer}>
                        <V.TransparentAccentButton icon={"trash-outline"} onPress={this.handleDelete} style={styles.values.actionButton} />
                        {
                            this.props.onEdit &&
                            <V.TransparentAccentButton icon={"create-outline"} onPress={this.handleEdit} style={styles.values.actionButton} />
                        }
                    </Expandable>
                    <V.TransparentAccentButton icon={this.state.moreMenuVisible ? "close" : "more"} onPress={this.toggleMore} style={styles.values.actionButton} />
                </V.HBox>
            </V.Card>
        );
    }
}

const styles = new V.Stylable({
    card: {
        marginHorizontal: 8,
        marginVertical: 4,
        shadowOpacity: 0.1,
        overflow: "hidden",
    },
    container: {
        width: "100%",
        alignItems: "center"
    },
    text: {
    },
    image: {
        height: 68,
        width: 68,
        marginRight: 8,
    },
    moreButtonsContainer: {
        flexDirection: "row",
    },
    actionButton: {
        padding: 4,
    }
})