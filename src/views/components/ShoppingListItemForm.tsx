import * as React from "react";

import * as V from "./Themed";
import res from "@root/resources";
import { ShoppingListFormData } from "@root/reducers/app";
import { FromProps } from "@root/utils/redux";

export type InputNames = keyof ShoppingListFormData;

type ShoppingListFormInitial = {
    id?: string | string[],
    name?: string,
    amount?: number,
    unit?: string,
} | undefined;
export interface ShoppingListItemFormProperties extends FromProps<ShoppingListFormData, string | string[] | undefined> {
    data: ShoppingListFormInitial,
}

interface State { }

export default class ShoppingListItemForm extends React.Component<ShoppingListItemFormProperties, State> {

    private propsFor(name: InputNames) {
        let val = this.props.data !== undefined ? this.props.data[name] : undefined;
        return {
            name: name,
            onUpdate: this.props.onUpdateData,
            onFocus: () => this.props.onFocusField(name),
            onFocusNext: (next?: string) => this.props.onFocusField(next || "none"),
            error: this.props.form.touched[name] ? this.props.errors[name] : undefined,
            focus: this.props.form.focus === name,
            value: (val === undefined || Object.is(val, NaN)) ? undefined : val.toString(),
        }
    }

    render() {
        return (
            <V.VBox style={styles.values.container}>
                <V.FormField
                    {...this.propsFor("name")}
                    returnKeyType={"next"}
                    nextField={"amount"}
                    keyboardType={"default"}
                    label={res.strings.shoppingListFormNameLabel()}
                    placeholder={res.strings.shoppingListFormNamePlaceholder()} />
                <V.FormField
                    {...this.propsFor("amount")}
                    returnKeyType={"next"}
                    nextField={"unit"}
                    keyboardType={"numbers-and-punctuation"}
                    label={res.strings.shoppingListFormAmountLabel()}
                    placeholder={res.strings.shoppingListFormAmountPlaceholder()} />
                <V.FormField
                    {...this.propsFor("unit")}
                    returnKeyType={"next"}
                    nextField={"name0"}
                    keyboardType={"default"}
                    label={res.strings.shoppingListFormUnitLabel()}
                    placeholder={res.strings.shoppingListFormUnitPlaceholder()} />
            </V.VBox>
        );
    }

    componentWillUnmount() {
        this.props.onCancel();
    }
}

const styles = new V.Stylable({
    container: {
        marginHorizontal: 12,
        marginVertical: 12,
    },
})