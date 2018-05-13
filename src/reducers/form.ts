import * as Types from "@root/EntityTypes";
import { Omit } from "@root/utils/types";
import formUtils from "@root/common/formUtils";

type EntityExluceCommon = "id" | "_version" | "_lastModified";
type IngredientFormData = {
    name: string | undefined,
    amount: string | undefined,
}
export type RecipeFormData = {
    [P in keyof Omit<Types.RecipeEntity, EntityExluceCommon | "ingredients">]: string | undefined;
} & { ingredients: IngredientFormData[] | undefined } ;

export type MeelPrepFormData = {
    [P in keyof Omit<Types.MeelPrepEntity, EntityExluceCommon>]: string | undefined
};

export type ShoppingListFormData = {
    [P in keyof Omit<Types.ShoppingListItemEntity, EntityExluceCommon | "checked" | "recipeId">]: string | undefined
};

export type MeelPrepFormEntity = Omit<Types.MeelPrepEntity, EntityExluceCommon>;

export const meelPrepEntityToFormData = (entity: MeelPrepFormEntity): MeelPrepFormData => {
    return {
        name: entity.name,
        amount: isNaN(entity.amount) ? "" : entity.amount.toString(),
        photo: entity.photo || "",
        createdAt: formUtils.formatDate(entity.createdAt),
        expiredAt: formUtils.formatDate(entity.expiredAt),
    }
}