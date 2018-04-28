import * as React from "react";

import { MeelPrepFormData } from "@root/reducers/app";
import MeelPrepForm, { MeelPrepFormProperties } from "@root/views/components/MeelPrepForm";
import { 
    createContainer,
    createAnchor,
    createDispacherProps,
    createFormProps,
    FromProps,
    ThemedViews as V,
    actions,
    selectors,
    res,
} from "./Imports";

export interface MeelPrepFormScreenProperties{
    formProps: FromProps<MeelPrepFormData>
}

interface State {
}

interface Params {
    data?: MeelPrepFormProperties["data"];
}

const anchor = createAnchor<Params>("MeelPrepForm");

export class MeelPrepFormScreen extends React.Component<MeelPrepFormScreenProperties, State> {

    public static anchor = anchor;

    render() {
        let data = anchor.getParam(this.props, "data");
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={this.props.formProps.onCancel} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={() => this.props.formProps.onSubmit(data && data.id)} />}
                />
                <MeelPrepForm data={anchor.getParam(this.props, "data")} {...this.props.formProps} />
            </V.Screen>
        );
    }
}

export default createContainer(MeelPrepFormScreen)((state, dispatch) => {
    let dispatchers = createDispacherProps(dispatch);
    return {
        formProps: createFormProps(
            state.app.meelPrepForm,
            dispatch,
            actions.app.MEEL_PREP_FORM,
            {
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
            },
        )
    }
})