import * as React from "react";

import { MeelPrepFormData } from "@root/reducers/app";
import MeelPrepForm, { MeelPrepFormProperties } from "@root/views/components/MeelPrepForm";
import { 
    createContainer,
    createAnchor,
    createDispacherProps,
    createFormProps,
    FormProps,
    ThemedViews as V,
    actions,
    selectors,
    res,
} from "./Imports";

export interface MeelPrepFormScreenProperties{
    formProps: FormProps<MeelPrepFormData>
    id?: string,
}

interface State {
}

interface Params {
    id: string | undefined,
    data?: MeelPrepFormProperties["initialData"];
}

const anchor = createAnchor<Params>("MeelPrepForm");

export class MeelPrepFormScreen extends React.Component<MeelPrepFormScreenProperties, State> {

    public static anchor = anchor;

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={this.props.formProps.onCancel} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={() => this.props.formProps.onSubmit(this.props.id)} />}
                />
                <MeelPrepForm {...this.props.formProps} />
            </V.Screen>
        );
    }
}

export default createContainer(MeelPrepFormScreen)((state, dispatch, ownProps) => {
    let dispatchers = createDispacherProps(dispatch);
    let initialData = MeelPrepFormScreen.anchor.getParam(ownProps, "data");
    let id = MeelPrepFormScreen.anchor.getParam(ownProps, "id");
    return {
        id,
        formProps: createFormProps({
            formState: state.app.meelPrepForm,
            dispatch,
            actions: actions.app.MEEL_PREP_FORM,
            initialData: initialData,
            errorsSelector: selectors.app.meelPrepFormErrorsSelector,
            performCancel: () => dispatchers.router.back("MeelPrepForm"),
            performSubmit: (data, id) => {
                if (id === undefined) {
                    dispatchers.entities.addMeelPrep(data);
                } else {
                    dispatchers.entities.updateMeelPrep(id, data);
                }
                dispatchers.router.back("MeelPrepForm");
            }
        })
    }
});