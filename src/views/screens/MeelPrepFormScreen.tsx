import * as React from "react";

import MeelPrepForm from "@root/views/components/MeelPrepForm";
import { 
    createContainer,
    createAnchor,
    ThemedViews as V,
    res,
    DispatcherProps,
    createDispacherProps,
} from "./Imports";
import { InjectedFormProps, reduxForm } from "redux-form";
import { meelPrepEntityToFormData, MeelPrepFormData, MeelPrepFormEntity } from "@root/reducers/form";

export interface MeelPrepFormScreenProperties extends DispatcherProps {
    id?: string,
}

interface State {
}

interface Params {
    id: string | undefined,
    data?: MeelPrepFormEntity,
}

type Props = InjectedFormProps<MeelPrepFormData, MeelPrepFormScreenProperties> & MeelPrepFormScreenProperties;

export class MeelPrepFormScreen extends React.Component<Props, State> {

    public static anchor = createAnchor<Params>("MeelPrepForm");;

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepFormTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={() => this.props.router.back("MeelPrepForm")} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={this.props.handleSubmit(data => {
                        this.props.entities.submitMeelPrepForm(this.props.id, data);
                        this.props.router.back("MeelPrepForm");
                    })} />}
                />
                <MeelPrepForm />
            </V.Screen>
        );
    }
}

const _MeelPrepFormScreen = reduxForm<MeelPrepFormData, MeelPrepFormScreenProperties>({
    form: "meepPrep"
})(MeelPrepFormScreen);

export default createContainer(_MeelPrepFormScreen)((_state, dispatch, ownProps) => {
    let initialEntity = MeelPrepFormScreen.anchor.getParam(ownProps, "data");
    let id = MeelPrepFormScreen.anchor.getParam(ownProps, "id");
    let initialValues = initialEntity && meelPrepEntityToFormData(initialEntity);
    return {
        id,
        initialValues,
        ...createDispacherProps(dispatch)
    }
});