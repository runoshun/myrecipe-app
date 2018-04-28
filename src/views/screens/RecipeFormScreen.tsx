import * as React from "react";

import { RecipeFormData, RecipeFormErrors } from "@root/reducers/app";
import RecipeForm, { RecipeFormProperties } from "@root/views/components/RecipeForm";
import {
    createContainer, createAnchor, createDispacherProps,
    createFormProps, FromProps, ThemedViews as V,
    actions, selectors, res,
} from "./Imports";
import { ScrollView } from "react-native";

export interface RecipeFormScreenProperties{
    formProps: FromProps<RecipeFormData, any, RecipeFormErrors>
}

interface State {
}

interface Params {
    data?: RecipeFormProperties["data"];
}

const anchor = createAnchor<Params>("RecipeForm");

export class RecipeFormScreen extends React.Component<RecipeFormScreenProperties, State> {

    public static anchor = anchor;

    render() {
        let data = anchor.getParam(this.props, "data");
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={this.props.formProps.onCancel} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={() => this.props.formProps.onSubmit(data && data.id)} />}
                />
                <ScrollView>
                    <RecipeForm data={anchor.getParam(this.props, "data")} {...this.props.formProps} />
                </ScrollView>
            </V.Screen>
        );
    }
}

export default createContainer(RecipeFormScreen)((state, dispatch) => {
    let dispatchers = createDispacherProps(dispatch);
    return {
        formProps: createFormProps(
            state.app.recipeForm,
            dispatch,
            actions.app.RECIPE_FORM,
            {
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
            },
        )
    }
})