import * as React from "react";

import res from "@root/resources";
import { FormProps } from "@root/utils/redux";
import { RecipeFormData, RecipeFormErrors } from "@root/reducers/app";
import * as Types from "@root/EntityTypes";
import * as V from "./Themed";

export interface IngredientsFieldProperties {
    data?: Types.Ingredient[],
    onFocusField: FormProps<RecipeFormData>["onFocusField"],
    onUpdateData: FormProps<RecipeFormData>["onUpdateData"],
    errors: RecipeFormErrors,
    form: FormProps<RecipeFormData>["form"],
}

interface State {
    ingredients: Types.Ingredient[],
}

export default class IngredientsField extends React.Component<IngredientsFieldProperties, State> {

    constructor(props: any) {
        super(props);
        let ingredients = this.props.data ? this.props.data : [{ name: "", amount: NaN, unit: "" }];
        this.state = {
            ingredients,
        }
    }

    private onPressAdd = () => {
        this.setState({
            ingredients: [...this.state.ingredients, {name: "", amount: NaN, unit: ""}],
        })
    }

    private onUpdate = (prefix: keyof Types.Ingredient, index: number) => (data: { [key: string]: string }) => {
        let ingredients = [...this.state.ingredients];
        ingredients[index][prefix] = data[prefix + index];
        this.setState({ ingredients })
        this.props.onUpdateData({ ingredients: JSON.stringify(ingredients) })
    }

    private propsFor(prefix: keyof Types.Ingredient, index: number, next?: keyof Types.Ingredient) {
        let val = this.state.ingredients[index][prefix];
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
            initialValue: (val == undefined || Object.is(val, NaN)) ? undefined : val.toString(),
        }
    }

    render() {
        return (
            <V.VBox>
                {Array.from(Array(this.state.ingredients.length).keys()).map(index => {
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