import * as React from "react";

import res from "@root/resources";
import { FromProps } from "@root/utils/redux";
import { RecipeFormData, RecipeFormErrors } from "@root/reducers/app";
import * as Types from "@root/EntityTypes";
import * as V from "./Themed";

export interface IngredientsFieldProperties {
    data?: Partial<Types.Ingredient>[],
    onFocusField: FromProps<RecipeFormData>["onFocusField"],
    onUpdateData: FromProps<RecipeFormData>["onUpdateData"],
    errors: RecipeFormErrors,
    form: FromProps<RecipeFormData>["form"],
}

interface State {
    ingredients: Partial<Types.Ingredient>[],
    numOfFields: number;
}

export default class IngredientsField extends React.Component<IngredientsFieldProperties, State> {

    constructor(props: any) {
        super(props);
        let numOfFields = this.props.data ? this.props.data.length : 1;
        let ingredients = this.props.data ? this.props.data : [{}];
        this.state = {
            ingredients,
            numOfFields,
        }
    }

    private onPressAdd = () => {
        this.setState({
            numOfFields: this.state.numOfFields + 1,
            ingredients: [...this.state.ingredients, {}],
        })
    }

    private onUpdate = (prefix: keyof Types.Ingredient, index: number) => (data: { [key: string]: string }) => {
        let ingredients = [...this.state.ingredients];
        ingredients[index][prefix] = data[prefix + index];
        this.setState({ ingredients })
        this.props.onUpdateData({ ingredients })
    }

    private propsFor(prefix: keyof Types.Ingredient, index: number, next?: keyof Types.Ingredient) {
        let val = this.props.data !== undefined ? this.props.data[index][prefix] : undefined;
        let name = prefix + index;
        let errors = this.props.errors.ingredients && this.props.errors.ingredients[index]
        let error = errors && errors[prefix];
        return {
            name: name,
            returnKeyType: (next ? "next" : "done") as "next" | "done",
            nextField: next ? next + index : "none",
            onUpdate: this.onUpdate(prefix, index),
            onFocus: () => this.props.onFocusField(name),
            onFocusNext: (next?: string) => this.props.onFocusField(next || "none"),
            error: error,
            focus: this.props.form.focus === name,
            value: (val === undefined || Object.is(val, NaN)) ? undefined : val.toString(),
        }
    }

    render() {
        return (
            <V.VBox>
                {Array.from(Array(this.state.numOfFields).keys()).map(index => {
                    let isFirst = index === 0;
                    return (
                    <V.HBox key={index.toString()} style={styles.values.container}>
                        <V.FormField
                            {...this.propsFor("name", index, "amount")}
                            keyboardType={"default"}
                            label={isFirst ? res.strings.recipeFormIngredientNameLabel() : undefined}
                            placeholder={res.strings.recipeFormIngredientNamePlaceholder()}
                            style={styles.values.name} />
                        <V.FormField
                            {...this.propsFor("amount", index, "unit")}
                            keyboardType={"numbers-and-punctuation"}
                            label={isFirst ? res.strings.recipeFormIngredientAmountLabel() : undefined}
                            placeholder={res.strings.recipeFormIngredientAmountPlaceholder()}
                            style={styles.values.amountUnit} />
                        <V.FormField
                            {...this.propsFor("unit", index)}
                            keyboardType={"default"}
                            label={isFirst ? res.strings.recipeFormIngredientUnitLabel() : undefined}
                            placeholder={res.strings.recipeFormIngredientUnitPlaceholder()}
                            style={styles.values.amountUnit} />
                    </V.HBox>
                    );
                })}
                <V.TransparentAccentButton icon="add" style={styles.values.addButton} onPress={this.onPressAdd} />
            </V.VBox>
        );
    }
}

const styles = new V.Stylable({
    container: {
        justifyContent: "space-between",
    },
    name: {
        width: "55%",
    },
    amountUnit: {
        width: "18%",
    },
    addButton: {
        width: "100%",
        alignSelf: "center",
    }
})