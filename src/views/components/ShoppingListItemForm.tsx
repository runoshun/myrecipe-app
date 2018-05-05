import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";
import ReduxFormField from "./ReduxFormField";
import { Field, WrappedFieldProps } from "redux-form";

export interface ShoppingListItemFormProperties {
}

interface State { }

export default class ShoppingListItemForm extends React.Component<ShoppingListItemFormProperties, State> {

    render() {
        return (
            <V.VBox style={styles.values.container}>
                <Field name="name" component={this.renderNameField} />
                <Field name="amount" component={this.renderAmountField} />
                <Field name="unit" component={this.renderUnitField} />
            </V.VBox>
        )
    }

    renderNameField(props: WrappedFieldProps) {
        return <ReduxFormField 
            fieldProps={props}
            label={res.strings.shoppingListFormNameLabel()}
            placeholder={res.strings.shoppingListFormNamePlaceholder()}
            keyboardType="default"
            returnKeyType="next"
            nextField="amount" />
    }

    renderAmountField(props: WrappedFieldProps) {
        return <ReduxFormField 
            fieldProps={props}
            label={res.strings.shoppingListFormAmountLabel()}
            placeholder={res.strings.shoppingListFormAmountPlaceholder()}
            keyboardType="default"
            returnKeyType="next"
            nextField="unit" />
    }

    renderUnitField(props: WrappedFieldProps) {
        return <ReduxFormField 
            fieldProps={props}
            label={res.strings.shoppingListFormUnitLabel()}
            placeholder={res.strings.shoppingListFormUnitPlaceholder()}
            keyboardType="default"
            returnKeyType="next"
            nextField="unit" />
    }

}

const styles = new V.Stylable({
    container: {
        marginHorizontal: 12,
        marginVertical: 12,
    },
})