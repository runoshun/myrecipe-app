import * as React from "react";

import { RecipeFormData } from "@root/reducers/app";
import RecipeForm from "@root/views/components/RecipeForm";
import {
    createContainer, createAnchor,
    ThemedViews as V,
    res,
} from "./Imports";
import { ScrollView } from "react-native";
import { InjectedFormProps, reduxForm } from "redux-form";
import logger from "@root/utils/logger";

const log = logger.create("form");

export interface RecipeFormScreenProperties{
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
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={() => undefined} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={this.props.handleSubmit((data) => log(data))} />}
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

export default createContainer(_RecipeFormScreen)((_state, _dispatch, ownProps) => {
    let initialValues = RecipeFormScreen.anchor.getParam(ownProps, "data");
    let id = RecipeFormScreen.anchor.getParam(ownProps, "id");
    return {
        initialValues,
        id,
    }
})