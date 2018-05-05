import * as React from "react";

import { MeelPrepFormData } from "@root/reducers/app";
import MeelPrepForm from "@root/views/components/MeelPrepForm";
import { 
    createContainer,
    createAnchor,
    ThemedViews as V,
    res,
} from "./Imports";
import { InjectedFormProps, reduxForm } from "redux-form";

export interface MeelPrepFormScreenProperties{
    id?: string,
}

interface State {
}

interface Params {
    id: string | undefined,
    data?: MeelPrepFormData
}

type Props = InjectedFormProps<MeelPrepFormData, MeelPrepFormScreenProperties> & MeelPrepFormScreenProperties;

const anchor = createAnchor<Params>("MeelPrepForm");

export class MeelPrepFormScreen extends React.Component<Props, State> {

    public static anchor = anchor;

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.meelPrepsTitle()}
                    renderLeft={() => <V.AppScreenHeaderButton icon="close" onPress={() => null} />}
                    renderRight={() => <V.AppScreenHeaderButton icon="checkmark" onPress={this.props.handleSubmit(data => console.log(data))} />}
                />
                <MeelPrepForm />
            </V.Screen>
        );
    }
}

const _MeelPrepFormScreen = reduxForm<MeelPrepFormData, MeelPrepFormScreenProperties>({
    form: "meepPrep"
})(MeelPrepFormScreen);

export default createContainer(_MeelPrepFormScreen)((_state, _dispatch, ownProps) => {
    let initialValues = MeelPrepFormScreen.anchor.getParam(ownProps, "data");
    let id = MeelPrepFormScreen.anchor.getParam(ownProps, "id");
    return {
        id,
        initialValues
    }
});