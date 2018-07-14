import * as React from "react";

import { ScrollView } from "react-native";
import { InjectedFormProps, reduxForm } from "redux-form";
import { RecipeFormData } from "@root/reducers/form";
import RecipeForm from "@root/views/components/RecipeForm";
import {
    createContainer, createAnchor,
    ThemedViews as V,
    res,
    DispatcherProps,
    createDispacherProps,
} from "./Imports";

import api from "@root/api";

export interface RecipeFormScreenProperties extends DispatcherProps {
    id?: string,
}

interface State {
}

interface Params {
    id: string | undefined,
    data?: RecipeFormData,
}

const anchor = createAnchor<Params>("RecipeForm");

type Props = InjectedFormProps<RecipeFormData, RecipeFormScreenProperties> & RecipeFormScreenProperties;

export class RecipeFormScreen extends React.Component<Props, State> {

    public static anchor = anchor;

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.recipeFormTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={() => this.props.router.back("RecipeForm")} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={this.props.handleSubmit(async (data) => {
                        data.photo = await api.image.maybeDownloadImage(data.photo);
                        this.props.entities.submitRecipeForm(this.props.id, data);
                        this.props.router.reset("MainTab", {});
                    })} />}
                />
                <ScrollView>
                    <RecipeForm />
                </ScrollView>
            </V.Screen>
        );
    }
}

const _RecipeFormScreen = reduxForm<RecipeFormData, RecipeFormScreenProperties>({
    form: "recipe",
})(RecipeFormScreen);

export default createContainer(_RecipeFormScreen)((_state, dispatch, ownProps) => {
    let initialValues = RecipeFormScreen.anchor.getParam(ownProps, "data");
    let id = RecipeFormScreen.anchor.getParam(ownProps, "id");
    return {
        initialValues,
        id,
        ...createDispacherProps(dispatch)
    }
})