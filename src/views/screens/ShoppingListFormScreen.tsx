import * as React from "react";

import { ShoppingListFormData } from "@root/reducers/form";

import ShoppingListItemForm from "@root/views/components/ShoppingListItemForm";
import { 
    createContainer,
    createAnchor,
    ThemedViews as V,
    res,
    createDispacherProps,
    DispatcherProps,
} from "./Imports";
import { reduxForm, InjectedFormProps } from "redux-form";

export interface ShoppingListFormScreenProperties extends DispatcherProps {
    id: string | string[] | undefined,
}

type Props = ShoppingListFormScreenProperties & InjectedFormProps<ShoppingListFormData, ShoppingListFormScreenProperties>;

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
                <V.AppScreenHeader title={res.strings.shoppingListFormTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={() => this.props.router.back("ShoppingListItemForm")} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={this.props.handleSubmit(data => {
                        this.props.entities.submitShoppingListForm(this.props.id, data);
                        this.props.router.back("ShoppingListItemForm");
                    })} />}
                />
                <ShoppingListItemForm />
            </V.Screen>
        );
    }
}

const _ShoppingListFormScreen = reduxForm<ShoppingListFormData, ShoppingListFormScreenProperties>({
    form: "shoppingListItem",
})(ShoppingListFormScreen);

export default createContainer(_ShoppingListFormScreen)((_state, _dispatch, ownProps) => {
    let initialValues = ShoppingListFormScreen.anchor.getParam(ownProps, "data");
    let id = ShoppingListFormScreen.anchor.getParam(ownProps, "id");
    return { initialValues, id, ...createDispacherProps(_dispatch) };
});