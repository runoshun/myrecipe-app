import * as _ThemedViews from "@root/views/components/Themed";

export { default as res, strings, colors, styles } from "@root/resources";
export { createAnchor, Router } from "@root/navigators"
export { createContainer, createDispacherProps, DispatcherProps } from "@root/views/createContainer";
export { EntitiesDispatcher } from "@root/dispatchers/EntitiesDispatcher";
export { selectors, actions } from "@root/reducers";

export const ThemedViews = _ThemedViews;