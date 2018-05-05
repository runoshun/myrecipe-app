import * as React from "react";
import { Field, WrappedFieldProps, FieldArray, WrappedFieldArrayProps } from "redux-form";

import api from "@root/api";
import res from "@root/resources";
import * as V from "./Themed";
import ImageField from "./ImageField";
import ReduxFormField from "./ReduxFormField";

export interface RecipeFormProperties {
}

interface State { }

export default class RecipeForm extends React.Component<RecipeFormProperties, State> {

    render() {
        return (
            <V.VBox style={styles.values.container}>
                <Field name="photo" component={this.renderPhotoField} />
                <V.VBox style={styles.values.inputsContainer}>
                    <Field name="name" component={this.renderNameField} />
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
            nextField="amount"
            keyboardType="default"
            label={res.strings.recipeFormUrlLabel()}
            placeholder={res.strings.recipeFormUrlPlaceholder()} />
    )

    renderIngredientFieldArray = (props: WrappedFieldArrayProps<any>) => (
        <V.VBox>
            {props.fields.map((name, index) => (
                <V.HBox key={index.toString()} style={styles.values.ingContainer}>
                    <Field
                        name={`${name}.name`}
                        component={this.renderIngredientNameField}
                        label={index === 0 ? res.strings.recipeFormIngredientNameLabel() : undefined} />
                    <Field
                        name={`${name}.amount`} 
                        component={this.renderIngredientAmountField}
                        label={index === 0 ? res.strings.recipeFormIngredientAmountLabel() : undefined} />
                    <Field
                        name={`${name}.unit`}
                        component={this.renderIngredientUnitField}
                        label={index === 0 ? res.strings.recipeFormIngredientUnitLabel() : undefined} />
                </V.HBox>
            ))}
            <V.TransparentAccentButton icon="add" style={styles.values.ingAddButton} onPress={() => props.fields.push({})} />
        </V.VBox>
    );

    renderIngredientNameField = (props: WrappedFieldProps) => (
        <ReduxFormField
            fieldProps={props}
            keyboardType={"default"}
            label={props.label}
            placeholder={res.strings.recipeFormIngredientNamePlaceholder()}
            style={styles.values.ingName} />
    );

    renderIngredientAmountField = (props: WrappedFieldProps) => (
        <ReduxFormField
            fieldProps={props}
            keyboardType={"numbers-and-punctuation"}
            label={props.label}
            placeholder={res.strings.recipeFormIngredientAmountPlaceholder()}
            style={styles.values.ingAmountUnit} />
    );

    renderIngredientUnitField = (props: WrappedFieldProps) => (
        <ReduxFormField
            fieldProps={props}
            keyboardType={"default"}
            label={props.label}
            placeholder={res.strings.recipeFormIngredientUnitPlaceholder()}
            style={styles.values.ingAmountUnit} />
    )
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
        width: "55%",
    },
    ingAmountUnit: {
        width: "18%",
    },
    ingAddButton: {
        width: "100%",
        alignSelf: "center",
    }
})