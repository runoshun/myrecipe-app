import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";
import { RecipeFormData, RecipeFormErrors } from "@root/reducers/app";
import { FromProps } from "@root/utils/redux";
import * as Types from "@root/EntityTypes";

import ImageField from "./ImageField";
import IngredientsField from "./IngredientsField";

import * as image from "@root/api/image";

export type InputNames = "name" | "photo" | "url";

type RecipeFormInitial = {
    id?: string,
    photo?: string,
    name?: string,
    url?: string,
    ingredients?: Partial<Types.Ingredient>[],
} | undefined;
export interface RecipeFormProperties extends FromProps<RecipeFormData, any, RecipeFormErrors> {
    data: RecipeFormInitial,
}

interface State { }

export default class RecipeForm extends React.Component<RecipeFormProperties, State> {

    private propsFor(name: InputNames) {
        let val = this.props.data !== undefined ? this.props.data[name] : undefined;
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
                    onPickImage={image.pickImage}
                    onTakeImage={image.takePhoto}
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
                        data={this.props.data && this.props.data.ingredients}
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