import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";
import { RecipeFormData, RecipeFormErrors } from "@root/reducers/app";
import { FormProps } from "@root/utils/redux";

import ImageField from "./ImageField";
import IngredientsField from "./IngredientsField";

import api from "@root/api";

export type InputNames = "name" | "photo" | "url";

export interface RecipeFormProperties extends FormProps<RecipeFormData, any, RecipeFormErrors> {
}

interface State { }

export default class RecipeForm extends React.Component<RecipeFormProperties, State> {

    private propsFor(name: InputNames) {
        let val = this.props.initialData !== undefined ? this.props.initialData[name] : undefined;
        return {
            name: name,
            onUpdate: this.props.onUpdateData,
            onFocus: () => this.props.onFocusField(name),
            onFocusNext: (next?: string) => this.props.onFocusField(next || "none"),
            error: this.props.form.touched[name] ? this.props.errors[name] : undefined,
            focus: this.props.form.focus === name,
            initialValue: (val === undefined || Object.is(val, NaN)) ? undefined : val.toString(),
        }
    }

    render() {
        let photo = (this.props.initialData && this.props.initialData.photo);
        return (
            <V.VBox style={styles.values.container}>
                <ImageField 
                    onPickImage={api.image.pickImage}
                    onTakeImage={api.image.takePhoto}
                    onChangeImage={(source) => this.props.onUpdateData({ photo: source.uri })}
                    initialImage={photo !== undefined ? { uri: photo } : undefined}
                    noImage={{ uri: res.images.noImage }}
                    imageStyle={styles.values.image} />
                <V.VBox style={styles.values.inputsContainer}>
                    <V.FormField
                        {...this.propsFor("name") }
                        returnKeyType={"next"}
                        nextField={"url"}
                        keyboardType={"default"}
                        label={res.strings.recipeFormNameLabel()}
                        placeholder={res.strings.recipeFormNamePlaceholder()} />
                    <V.FormField
                        {...this.propsFor("url") }
                        returnKeyType={"next"}
                        nextField={"amount"}
                        keyboardType={"default"}
                        label={res.strings.recipeFormUrlLabel()}
                        placeholder={res.strings.recipeFormUrlPlaceholder()} />
                    <IngredientsField
                        data={this.props.initialData && this.props.initialData.ingredients}
                        onFocusField={this.props.onFocusField}
                        onUpdateData={this.props.onUpdateData}
                        errors={this.props.errors}
                        form={this.props.form}
                    />
                </V.VBox>
            </V.VBox>
        );
    }

    componentWillUnmount() {
        this.props.onCancel();
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
})