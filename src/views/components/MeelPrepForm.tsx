import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Field, WrappedFieldProps } from "redux-form";

import api from "@root/api";
import res from "@root/resources";
import { notEmpty, isDate, isNumber, formatDate, parseDate } from "@root/api/common/formUtils";

import * as V from "./Themed";
import ImageField from "./ImageField";
import ReduxFormField from "@root/views/components/ReduxFormField";

export interface MeelPrepFormProperties {
}

interface State { }

const nameRequired = notEmpty(res.strings.meelPrepFormErrorNameRequired());
const amountMustBeNumber = isNumber(res.strings.meelPrepFormErrorAmountIsNonNumber());
const invalidDate = isDate(res.strings.meelPrepFormErrorInValidDate());

export default class MeelPrepForm extends React.Component<MeelPrepFormProperties, State> {

    render() {
        return (
            <V.VBox style={styles.values.container}>
                <Field name="photo" component={this.renderPhotoField} />
                <V.HBox style={styles.values.halfInputsContainer}>
                    <Field
                        name="name"
                        component={this.renderNameField}
                        validate={[nameRequired]} />
                    <Field
                        name="amount"
                        component={this.renderAmountField}
                        validate={[amountMustBeNumber]}
                         />
                </V.HBox>
                <Field
                    name={"createdAt"}
                    component={this.renderDatePickerField}
                    label={res.strings.meelPrepFormCreateAtLabel()}
                    validate={[invalidDate]} />
                <Field
                    name={"expiredAt"}
                    component={this.renderDatePickerField}
                    label={res.strings.meelPrepFormExpiredAtLabel()}
                    validate={[invalidDate]} />
            </V.VBox>
        );
    }

    renderPhotoField = (props: WrappedFieldProps) => (
        <ImageField
            onPickImage={api.image.pickImage}
            onTakeImage={api.image.takePhoto}
            onChangeImage={(source) => props.input.onChange(source.uri)}
            initialImage={props.input.value && { uri: props.input.value }}
            noImage={{ uri: res.images.noImage }}
            imageStyle={styles.values.image} />
    )

    renderNameField = (props: WrappedFieldProps) => (
        <ReduxFormField
            fieldProps={props}
            returnKeyType={"next"}
            nextField={"amount"}
            keyboardType={"default"}
            label={res.strings.meelPrepFormNameLabel()}
            placeholder={res.strings.meelPrepFormNamePlaceholder()}
            style={styles.values.nameInput} />
    )

    renderAmountField = (props: WrappedFieldProps) => (
        <ReduxFormField
            fieldProps={props}
            returnKeyType={"next"}
            nextField={"createdAt"}
            keyboardType={"numbers-and-punctuation"}
            label={res.strings.meelPrepFormAmountLabel()}
            placeholder={res.strings.meelPrepFormAmountPlaceholder()}
            style={styles.values.amountInput} />
    )

    renderDatePickerField = (props: WrappedFieldProps) => (
        <TouchableOpacity activeOpacity={0.9} onPress={this.openDatePicker(props.input.onChange, props.input.value)}>
            <ReduxFormField
                fieldProps={props}
                editable={false}
                pointerEvents={"none"}
                keyboardType={"numbers-and-punctuation"}
                label={props.label} />
        </TouchableOpacity>
    )

    private openDatePicker = (onChange: (value: any) => void, dateStr?: string) => async () => {
        let time = parseDate(dateStr) || Date.now();
        let result = await V.DatePicker.open({
            date: new Date(time),
            localeIOS: "ja"
        });
        if (result.type === "selected") {
            let date = new Date(result.year, result.month, result.day);
            onChange(formatDate(date.getTime()))
        }
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