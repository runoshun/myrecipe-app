import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";
import { MeelPrepFormData } from "@root/reducers/app";
import { FormProps } from "@root/utils/redux";

import ImageField from "./ImageField";

import api from "@root/api";

export type InputNames = keyof MeelPrepFormData;

export interface MeelPrepFormProperties extends FormProps<MeelPrepFormData, string | undefined> {
}

interface State { }

export default class MeelPrepForm extends React.Component<MeelPrepFormProperties, State> {

    private formatDate = (time?: number) => {
        if (time) {
            let date = new Date(time);
            return `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
        } else {
            return undefined;
        }
    }

    private propsFor(name: InputNames) {
        let val = this.props.initialData ? this.props.initialData[name] : undefined;
        if ((name === "createdAt" || name === "expiredAt")) {
            val = this.formatDate(val as number);
        }
        return {
            name: name,
            onUpdate: this.props.onUpdateData,
            onFocus: () => this.props.onFocusField(name),
            onFocusNext: (next?: string) => this.props.onFocusField(next || "none"),
            error: this.props.form.touched[name] ? this.props.errors[name] : undefined,
            focus: this.props.form.focus === name,
            initialValue: (val == undefined || Object.is(val, NaN)) ? undefined : val.toString(),
        }
    }

    private openCreateDatePicker = async () => {
        let time = this.props.form.data.createdAt;
        let date = time ? new Date(time) : new Date();
        let result = await V.DatePicker.open({
            date,
            maxDate: new Date(Date.now())
        });
        if (result.type === "selected") {
            let date = new Date(result.year, result.month, result.day);
            this.props.onUpdateData({ createdAt: this.formatDate(date.getTime()) })
        }
    }

    private openExpiredDatePicker = async () => {
        let time = this.props.form.data.expiredAt;
        let date = time ? new Date(time) : new Date();
        let result = await V.DatePicker.open({ date });
        if (result.type === "selected") {
            let date = new Date(result.year, result.month, result.day);
            this.props.onUpdateData({ expiredAt: this.formatDate(date.getTime()) })
        }
    }

    render() {
        let photo = (this.props.initialData && this.props.initialData.photo);
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
                    value={this.formatDate(this.props.form.data.createdAt)}
                    onTouchStart={this.openCreateDatePicker}
                    keyboardType={"numbers-and-punctuation"}
                    label={res.strings.meelPrepFormCreateAtLabel()}
                    placeholder={res.strings.meelPrepFormCreateAtPlaceholder()} />
                <V.FormField
                    {...this.propsFor("expiredAt")}
                    returnKeyType={"done"}
                    nextField={"none"}
                    value={this.formatDate(this.props.form.data.expiredAt)}
                    onTouchStart={this.openExpiredDatePicker}
                    keyboardType={"numbers-and-punctuation"}
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