import * as React from "react";

import { ShoppingListFormData } from "@root/reducers/app";

import ShoppingListItemForm, { ShoppingListItemFormProperties } from "@root/views/components/ShoppingListItemForm";
import { 
    createContainer,
    createAnchor,
    createDispacherProps,
    createFormProps,
    FromProps,
    ThemedViews as V,
    actions,
    selectors,
    res,
} from "./Imports";

export interface ShoppingListFormScreenProperties {
    formProps: FromProps<ShoppingListFormData>
}

interface State {
}

interface Params {
    data?: ShoppingListItemFormProperties["data"];
}

const anchor = createAnchor<Params>("ShoppingListItemForm");

export class ShoppingListFormScreen extends React.Component<ShoppingListFormScreenProperties, State> {

    public static anchor = anchor;

    render() {
        let data = anchor.getParam(this.props, "data");
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={this.props.formProps.onCancel} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={() => this.props.formProps.onSubmit(data && data.id)} />}
                />
                <ShoppingListItemForm data={anchor.getParam(this.props, "data")} {...this.props.formProps} />
            </V.Screen>
        );
    }
}

export default createContainer(ShoppingListFormScreen)((state, dispatch) => {
    let dispatchers = createDispacherProps(dispatch);
    return {
        formProps: createFormProps(
            state.app.shoppingListForm,
            dispatch,
            actions.app.SHOPPING_LIST_FORM,
            {
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
            },
        )
    }
})