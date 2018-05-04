import * as React from "react";

import { RecipeFormData, RecipeFormErrors } from "@root/reducers/app";
import RecipeForm, { RecipeFormProperties } from "@root/views/components/RecipeForm";
import {
    createContainer, createAnchor, createDispacherProps,
    createFormProps, FormProps, ThemedViews as V,
    actions, selectors, res,
} from "./Imports";
import { ScrollView } from "react-native";

export interface RecipeFormScreenProperties{
    id?: string,
    formProps: FormProps<RecipeFormData, any, RecipeFormErrors>
}

interface State {
}

interface Params {
    id: string | undefined,
    data?: RecipeFormProperties["initialData"];
}

const anchor = createAnchor<Params>("RecipeForm");

export class RecipeFormScreen extends React.Component<RecipeFormScreenProperties, State> {

    public static anchor = anchor;

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={this.props.formProps.onCancel} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={() => this.props.formProps.onSubmit(this.props.id)} />}
                />
                <ScrollView>
                    <RecipeForm {...this.props.formProps} />
                </ScrollView>
            </V.Screen>
        );
    }
}

export default createContainer(RecipeFormScreen)((state, dispatch, ownProps) => {
    let dispatchers = createDispacherProps(dispatch);
    let initialData = RecipeFormScreen.anchor.getParam(ownProps, "data");
    let id = RecipeFormScreen.anchor.getParam(ownProps, "id");
    return {
        id,
        formProps: createFormProps({
            formState: state.app.recipeForm,
            dispatch,
            actions: actions.app.RECIPE_FORM,
            initialData,
            errorsSelector: selectors.app.recipeFormErrorsSelector,
            performCancel: () => dispatchers.router.back("RecipeForm"),
            performSubmit: (data, id) => {
                if (id === undefined) {
                    dispatchers.entities.addRecipe(data);
                } else {
                    dispatchers.entities.updateRecipe(id, data);
                }
                dispatchers.router.back("RecipeForm");
            }
        })
    }
})