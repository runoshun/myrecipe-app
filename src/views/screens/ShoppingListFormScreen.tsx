import * as React from "react";

import { ShoppingListFormData } from "@root/reducers/app";

import ShoppingListItemForm from "@root/views/components/ShoppingListItemForm";
import { 
    createContainer,
    createAnchor,
    ThemedViews as V,
    res,
} from "./Imports";
import { reduxForm, InjectedFormProps } from "redux-form";

export interface ShoppingListFormScreenProperties {
    id: string | string[] | undefined,
}

type Props = ShoppingListFormScreenProperties & InjectedFormProps<{}, ShoppingListFormScreenProperties>;

interface State {
}

interface Params {
    id: string | string[] | undefined,
    data?: ShoppingListFormData,
}

const anchor = createAnchor<Params>("ShoppingListItemForm");

export class ShoppingListFormScreen extends React.Component<Props, State> {

    public static anchor = anchor;

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={this.props.handleSubmit(data => console.log(data))} />}
                />
                <ShoppingListItemForm />
            </V.Screen>
        );
    }
}

const _ShoppingListFormScreen = reduxForm<{}, ShoppingListFormScreenProperties>({
    form: "shoppingListItem",
})(ShoppingListFormScreen);

export default createContainer(_ShoppingListFormScreen)((_state, _dispatch, ownProps) => {
    let initialValues = ShoppingListFormScreen.anchor.getParam(ownProps, "data");
    let id = ShoppingListFormScreen.anchor.getParam(ownProps, "id");
    return { initialValues, id };
});