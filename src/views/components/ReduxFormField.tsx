import * as React from "react";
import * as V from "./Themed";
import { WrappedFieldProps, focus } from "redux-form";

import logger from "@root/utils/logger";
const log = logger.create("form")

export interface ReduxFormFieldProps extends V.TextFieldProperties {
    fieldProps: WrappedFieldProps,
}

export const ReduxFormField = (props: ReduxFormFieldProps) => {
    let { fieldProps: { input, meta }, ...rest } = props;
    log(`FormField(${input.name}) = `, (typeof input.value === "string" ? input.value.substring(0, 20) : input.value));
    return (
        <V.FormField
            onChange={input.onChange}
            onBlur={input.onBlur as any}
            onFocus={input.onFocus as any}
            error={meta.touched && meta.error}
            focus={meta.active}
            value={input.value}
            onFocusNext={(next) => meta.dispatch(focus(meta.form, next || "none"))}
            {...rest}
        />
    )
}

export default ReduxFormField;