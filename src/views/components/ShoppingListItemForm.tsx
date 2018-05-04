import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";
import { Field, WrappedFieldProps } from "redux-form";
import { TextFieldProperties } from "@root/views/components/common/TextField";

export interface ShoppingListItemFormProperties {
}

interface State { }

const ReduxFormField = (style?: TextFieldProperties["style"]) => (props: WrappedFieldProps) => {
    return (
        <V.FormField
            name={props.input.name}
            onChange={props.input.onChange}
            onBlur={props.input.onBlur as any}
            onFocus={props.input.onFocus as any}
            error={props.meta.error}
            label={props.label}
            style={style}
        />
    )
}

export default class ShoppingListItemForm extends React.Component<ShoppingListItemFormProperties, State> {

    render() {
        return (
            <V.VBox style={styles.values.container}>
                <Field name="name" component={ReduxFormField()} label={res.strings.shoppingListFormNameLabel()} />
                <Field name="amount" component={ReduxFormField()} label={res.strings.shoppingListFormAmountLabel()} />
                <Field name="unit" component={ReduxFormField()} label={res.strings.shoppingListFormUnitLabel()} />
            </V.VBox>
        )
    }
}

const styles = new V.Stylable({
    container: {
        marginHorizontal: 12,
        marginVertical: 12,
    },
})