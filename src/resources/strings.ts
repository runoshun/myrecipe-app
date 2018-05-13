
export const commonOk = () => "OK"; 
export const commonCancel = () => "キャンセル";
export const commonUndo = () => "元に戻す";
export const commonConfirmationTitle = () => "確認";
export const commonDelete = () => "削除";
export const commonEdit = () => "編集";

export const recipesTitle = () => "レシピ一覧";
export const meelPrepsTitle = () => "作り置き一覧";
export const shoppingListTitle = () => "買い物リスト";

export const tabbarLabelRecipes = () => "レシピ";
export const tabbarLabelStocks = () => "作り置き";
export const tabbarLabelShoppingList = () => "買い物リスト";

export const imageFieldTakePhoto = () => "カメラで撮影";
export const imageFieldPickImage = () => "ライブラリから選択";
export const imageFieldInputUrl = () => "URLから取得";
export const imageFieldDeleteImage = () => "画像を削除";

export const recipeListEmptyMessage1 = () => "レシピが登録されていません。";
export const recipeListEmptyMessage2 = () => "こちらから追加";

export const recipeDetailIngredient = () => "材料一覧";
export const recipeDetailLink = () => "リンクを開く";
export const recipeDetailToShoppingList = () => "リストに追加";
export const recipeDetailSnackbarMessage = () => "買い物リストに追加しました";
export const recipeDetailEdit = () => "レシピを編集";
export const recipeDetailDelete = () => "このレシピを削除";
export const recipeDetailDeletedMessage = () => "レシピを削除しました";

export const addRecipeTitle = () => "レシピを追加";

export const recipeFormTitle = () => "レシピ";
export const recipeFormNameLabel = () => "レシピ名";
export const recipeFormNamePlaceholder = () => "レシピ名";
export const recipeFormUrlLabel = () => "URL(任意)";
export const recipeFormUrlPlaceholder = () => "URL";
export const recipeFormIngredientNameLabel = () => "材料名";
export const recipeFormIngredientNamePlaceholder = () => "材料名";
export const recipeFormIngredientAmountLabel = () => "数量(任意)";
export const recipeFormIngredientAmountPlaceholder = () => "数量";
export const recipeFormIngredientUnitLabel = () => "単位(任意)";
export const recipeFormIngredientUnitPlaceholder = () => "単位";

export const recipeFormErrorNameRequired = () => "レシピ名を入力してください";
export const recipeFormErrorIngredientNameRequired = () => "材料名を入力してください";

export const shoppingListTypeMerged = () => "同じ材料をまとめて表示";
export const shoppingListTypeWithRecipe = () => "レシピごとに表示";
export const shoppingListCleared = () => "買い物リストをクリアしました。";
export const shoppingListEmptyMessage1 = () => "買い物リストが登録されていません。";
export const shoppingListEmptyMessage2 = () => "こちらから追加";
export const shoppingListEmptyMessage3 = () => "またはレシピ詳細から追加してください。"
export const shoppingListItemDeleted = (name: string) => `${name}を削除しました。`;
export const shoppingListSectionOther = () => "その他";


export const shoppingListFormTitle = () => "買い物リスト";
export const shoppingListFormNameLabel = () => "商品/材料名";
export const shoppingListFormNamePlaceholder = () => "商品/材料名"
export const shoppingListFormAmountLabel = () => "数量";
export const shoppingListFormAmountPlaceholder = () => "数量(オプション)";
export const shoppingListFormUnitLabel = () => "単位";
export const shoppingListFormUnitPlaceholder = () => "単位(オプション)";
export const shoppingListFormSubmitAddLabel = () => "買い物リストに追加";
export const shoppingListFormSubmitUpdateLabel = () => "買い物リストを更新";
export const shoppingListFormErrorNameRequired = () => "商品/材料名を入力してください";
export const shoppingListFormErrorAmountIsNonNumber = () => "数字で入力してください";

export const meelPrepsEmptyMessage1 = () => "作り置きの記録がありません。";
export const meelPrepsEmptyMessage2 = () => "こちらから追加";
export const meelPrepsEmptyMessage3 = () => "またはレシピ詳細から追加してください。";
export const meelPrepsDeleted = (name: string) => `作り置き: ${name}を削除しました。`;

const formatDate = (time: number) => {
    let date = new Date(time);
    return `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;
}
export const meelPrepsCreated = (createdAt: number) => `作った日: ${formatDate(createdAt)}`;
export const meelPrepsExpired = (expiredAt: number) => `消費期限: ${formatDate(expiredAt)}`;

export const meelPrepFormTitle = () => "作り置き"
export const meelPrepFormNameLabel = () => "名前";
export const meelPrepFormNamePlaceholder = () => "名前";
export const meelPrepFormCreateAtLabel = () => "作った日";
export const meelPrepFormCreateAtPlaceholder = () => "YYYY/MM/DD(オプション)";
export const meelPrepFormExpiredAtLabel = () => "消費期限";
export const meelPrepFormExpiredAtPlaceholder = () => "YYYY/MM/DD(オプション)";
export const meelPrepFormAmountLabel = () => "数量";
export const meelPrepFormAmountPlaceholder = () => "数量(オプション)";
export const meelPrepFormErrorNameRequired = () => "名前を入力してください";
export const meelPrepFormErrorAmountIsNonNumber = () => "数字で入力してください";
export const meelPrepFormErrorInValidDate = () => "正しい日付を入力してください";

export const webBrowserUrlDialogTitle = () => "URLを入力";