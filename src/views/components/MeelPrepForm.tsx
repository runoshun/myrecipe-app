import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";
import { MeelPrepFormData } from "@root/reducers/app";
import { FromProps } from "@root/utils/redux";

import ImageField from "./ImageField";

import api from "@root/api";

export type InputNames = keyof MeelPrepFormData;

type MeelPrepFormInitial = {
    id?: string,
    photo?: string,
    name?: string,
    amount?: number,
    expiredAt?: number,
    createdAt?: number,
} | undefined;
export interface MeelPrepFormProperties extends FromProps<MeelPrepFormData, string | undefined> {
    data: MeelPrepFormInitial,
}

interface State { }

export default class MeelPrepForm extends React.Component<MeelPrepFormProperties, State> {

    private propsFor(name: InputNames) {
        let val = this.props.data !== undefined ? this.props.data[name] : undefined;
        if (val && (name === "createdAt" || name === "expiredAt")) {
            let date = new Date(val as number);
            val = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
        }
        return {
            name: name,
            onUpdate: this.props.onUpdateData,
            onFocus: () => this.props.onFocusField(name),
            onFocusNext: (next?: string) => this.props.onFocusField(next || "none"),
            error: this.props.form.touched[name] ? this.props.errors[name] : undefined,
            focus: this.props.form.focus === name,
            value: (val === undefined || Object.is(val, NaN)) ? undefined : val.toString(),
        }
    }

    render() {
        let photo = (this.props.data && this.props.data.photo);
        return (
            <V.VBox style={styles.values.container}>
                <ImageField 
                    onPickImage={api.image.pickImage}
                    onTakeImage={api.image.takePhoto}
                    onChangeImage={(source) => this.props.onUpdateData({photo: source.uri})}
                    initialImage={photo !== undefined ? { uri: photo } : undefined}
                    noImage={{ uri: res.images.noImage }}
                    imageStyle={styles.values.image} />
                <V.HBox style={styles.values.halfInputsContainer}>
                    <V.FormField
                        {...this.propsFor("name")}
                        returnKeyType={"next"}
                        nextField={"amount"}
                        keyboardType={"default"}
                        label={res.strings.meelPrepFormNameLabel()}
                        placeholder={res.strings.meelPrepFormNamePlaceholder()}
                        style={styles.values.nameInput} />
                    <V.FormField
                        {...this.propsFor("amount")}
                        returnKeyType={"next"}
                        nextField={"createdAt"}
                        keyboardType={"numbers-and-punctuation"}
                        label={res.strings.meelPrepFormAmountLabel()}
                        placeholder={res.strings.meelPrepFormAmountPlaceholder()}
                        style={styles.values.amountInput} />
                </V.HBox>
                    <V.FormField
                        {...this.propsFor("createdAt")}
                        returnKeyType={"next"}
                        nextField={"expiredAt"}
                        keyboardType={"numbers-and-punctuation"}
                        mask={V.TextField.maskByDigits("9999/99/99")}
                        label={res.strings.meelPrepFormCreateAtLabel()}
                        placeholder={res.strings.meelPrepFormCreateAtPlaceholder()} />
                    <V.FormField
                        {...this.propsFor("expiredAt")}
                        returnKeyType={"done"}
                        nextField={"none"}
                        keyboardType={"numbers-and-punctuation"}
                        mask={V.TextField.maskByDigits("9999/99/99")}
                        label={res.strings.meelPrepFormExpiredAtLabel()}
                        placeholder={res.strings.meelPrepFormExpiredAtPlaceholder()} />
            </V.VBox>
        );
    }

    componentWillUnmount() {
        this.props.onCancel();
    }
}

const styles = new V.Stylable({
    container: {
        marginHorizontal: 12,
        marginVertical: 12,
    },
    image: {
        width: 68,
        height: 68
    },
    halfInputsContainer: {
        justifyContent: "space-between",
    },
    halfInputs: {
        width: "48%"
    },
    nameInput: {
        width: "70%"
    },
    amountInput: {
        width: "25%"
    }
})