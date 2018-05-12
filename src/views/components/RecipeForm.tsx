import * as React from "react";
import { Field, WrappedFieldProps, FieldArray, WrappedFieldArrayProps, Validator } from "redux-form";

import api from "@root/api";
import res from "@root/resources";
import * as V from "./Themed";
import ImageField from "./ImageField";
import ReduxFormField from "./ReduxFormField";
import { notEmpty } from "@root/common/formUtils";
import { RecipeFormData } from "@root/reducers/form";

const nameRequired = notEmpty(res.strings.recipeFormErrorNameRequired());

const ingNameValidateCache: { [key: number]: Validator } = {};
const ingNameRequiredIfAmountIsNotEmpty = (index: number) => {
    if (ingNameValidateCache[index] === undefined) {
        let validate = (data: string, all: RecipeFormData) => {
            if ((data === undefined || data === "") &&
                (all.ingredients && all.ingredients[index].amount !== undefined)) {
                return res.strings.recipeFormErrorIngredientNameRequired();
            } else {
                return undefined;
            }
        }
        ingNameValidateCache[index] = validate; 
    }
    return ingNameValidateCache[index];
}

export interface RecipeFormProperties {
}

interface State { }

export default class RecipeForm extends React.Component<RecipeFormProperties, State> {

    render() {
        return (
            <V.VBox style={styles.values.container}>
                <Field name="photo" component={this.renderPhotoField}/>
                <V.VBox style={styles.values.inputsContainer}>
                    <Field name="name" component={this.renderNameField} validate={[nameRequired]} />
                    <Field name="url" component={this.renderUrlField} />
                    <FieldArray name="ingredients" component={this.renderIngredientFieldArray as any} />
                </V.VBox>
            </V.VBox>
        );
    }

    renderPhotoField = (props: WrappedFieldProps) => {
        return <ImageField
            onPickImage={api.image.pickImage}
            onTakeImage={api.image.takePhoto}
            onChangeImage={(source) => props.input.onChange(source.uri)}
            initialImage={props.input.value !== "" ? { uri: props.input.value } : undefined}
            noImage={{ uri: res.images.noImage }}
            imageStyle={styles.values.image} />
    }

    renderNameField = (props: WrappedFieldProps) => (
        <ReduxFormField fieldProps={props}
            returnKeyType="next"
            nextField="url"
            keyboardType="default"
            label={res.strings.recipeFormNameLabel()}
            placeholder={res.strings.recipeFormNamePlaceholder()} />
    )

    renderUrlField = (props: WrappedFieldProps) => (
        <ReduxFormField fieldProps={props}
            returnKeyType="next"
            nextField="ingredients[0].name"
            keyboardType="default"
            label={res.strings.recipeFormUrlLabel()}
            placeholder={res.strings.recipeFormUrlPlaceholder()} />
    )

    renderIngredientFieldArray = (props: WrappedFieldArrayProps<any>) => {
        if (props.fields.length === 0) {
            props.fields.push({});
        }

        return (
            <V.VBox>
                {props.fields.map((name, index) => (
                    <V.HBox key={index.toString()} style={styles.values.ingContainer}>
                        <Field
                            name={`${name}.name`}
                            component={this.renderIngredientNameField}
                            label={index.toString()}
                            validate={[ingNameRequiredIfAmountIsNotEmpty(index)]} />
                        <Field
                            name={`${name}.amount`}
                            component={this.renderIngredientAmountField}
                            label={index.toString()} />
                    </V.HBox>
                ))}
                <V.TransparentAccentButton icon="add" style={styles.values.ingAddButton} onPress={() => props.fields.push({})} />
            </V.VBox>
        )
    };

    renderIngredientNameField = (props: WrappedFieldProps) => {
        let index = parseInt(props.label || "0");
        return (
            <ReduxFormField
                fieldProps={props}
                keyboardType={"default"}
                returnKeyType={"next"}
                nextField={`ingredients[${index}].amount`}
                label={index === 0 ? res.strings.recipeFormIngredientNameLabel() : ""}
                placeholder={res.strings.recipeFormIngredientNamePlaceholder()}
                style={styles.values.ingName} />
        );
    }

    renderIngredientAmountField = (props: WrappedFieldProps) => {
        let index = parseInt(props.label || "0");
        return (
            <ReduxFormField
                fieldProps={props}
                keyboardType={"numbers-and-punctuation"}
                returnKeyType={"next"}
                nextField={`ingredients[${index + 1}].name`}
                label={index === 0 ? res.strings.recipeFormIngredientAmountLabel() : ""}
                placeholder={res.strings.recipeFormIngredientAmountPlaceholder()}
                style={styles.values.ingAmountUnit} />
        );
    }
}

const styles = new V.Stylable({
    container: {
    },
    image: {
        width: "100%",
        height: 200,
    },
    inputsContainer: {
        margin: 12
    },
    ingContainer: {
        justifyContent: "space-between",
    },
    ingName: {
        width: "70%",
    },
    ingAmountUnit: {
        width: "25%",
    },
    ingAddButton: {
        width: "100%",
        alignSelf: "center",
    }
})