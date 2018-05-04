import * as React from "react";

import { ShoppingListFormData } from "@root/reducers/app";

import ShoppingListItemForm, { ShoppingListItemFormProperties } from "@root/views/components/ShoppingListItemForm";
import { 
    createContainer,
    createAnchor,
    createDispacherProps,
    createFormProps,
    FormProps,
    ThemedViews as V,
    actions,
    selectors,
    res,
} from "./Imports";

export interface ShoppingListFormScreenProperties {
    id?: string | string[],
    formProps: FormProps<ShoppingListFormData>
}

interface State {
}

interface Params {
    id: string | string[] | undefined,
    data?: ShoppingListItemFormProperties["initialData"];
}

const anchor = createAnchor<Params>("ShoppingListItemForm");

export class ShoppingListFormScreen extends React.Component<ShoppingListFormScreenProperties, State> {

    public static anchor = anchor;

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={this.props.formProps.onCancel} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={() => this.props.formProps.onSubmit(this.props.id)} />}
                />
                <ShoppingListItemForm {...this.props.formProps} />
            </V.Screen>
        );
    }
}

export default createContainer(ShoppingListFormScreen)((state, dispatch, ownProps) => {
    let dispatchers = createDispacherProps(dispatch);
    let initialData = ShoppingListFormScreen.anchor.getParam(ownProps, "data");
    let id = ShoppingListFormScreen.anchor.getParam(ownProps, "id");
    return {
        id,
        formProps: createFormProps({
            formState: state.app.shoppingListForm,
            dispatch,
            actions: actions.app.SHOPPING_LIST_FORM,
            initialData,
            errorsSelector: selectors.app.shoppingListItemFormErrorsSelector,
            performCancel: () => dispatchers.router.back("ShoppingListItemForm"),
            performSubmit: (data, id) => {
                if (id === undefined) {
                    dispatchers.entities.addShoppingListItem(data);
                } else {
                    dispatchers.entities.updateShoppingListItem(id, data);
                }
                dispatchers.router.back("ShoppingListItemForm");
            },
        })
    }
})