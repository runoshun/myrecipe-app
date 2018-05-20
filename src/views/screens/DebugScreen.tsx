import * as React from "react";
import { View, TextInput, Text, Image } from "react-native";

import { 
    createContainer,
    createDispacherProps,
    createAnchor,
    DispatcherProps,
    ThemedViews as V,
} from "./Imports";

export interface AddRecipeScreenProperties extends DispatcherProps {
    entitiesState: string
}

interface State {
    import: string,
    imageUrl?: string,
}

interface Params {
}

export class DebugScreen extends React.Component<AddRecipeScreenProperties, State> {

    public static anchor = createAnchor<Params>("AddRecipe");

    constructor(props: any) {
        super(props);
        this.state = { import: "" };
    }

    render() {
        console.log(this.state)
        return (
            <V.Screen>
                <V.AppScreenHeader title={"Debug"} />
                <V.VBox>
                    <V.Texts.H3>Export</V.Texts.H3>
                    <Text numberOfLines={5} selectable={true}>{this.props.entitiesState}</Text>
                    <View style={{borderBottomWidth: 1, borderBottomColor: "#ccc", alignSelf: "stretch"}} />
                    <V.Texts.H3>Import</V.Texts.H3>
                    <TextInput onChangeText={text => this.setState({ import: text })} numberOfLines={5} style={{borderWidth: 1, borderColor: "#ccc", padding: 4}} />
                    <V.AccentButton label={"import data"} onPress={this.handleImport} />
                    <V.AccentButton label={"download blob"} onPress={this.handleDownload}/>
                    {this.state.imageUrl && <Image source={{ uri: this.state.imageUrl }} style={{width: 64, height: 64}}/>}
                </V.VBox>
            </V.Screen>
        );
    }

    handleImport = () => {
        try {
            let state = JSON.parse(this.state.import);
            this.props.entities.importData(state);
        } catch(e) {
            V.ConfimationDialog.show({message: "failed to import. " + e.toString()})
        }
    }

    handleDownload = () => {
        fetch("https://www.google.com/logos/doodles/2018/mothers-day-2018-6361329190305792-s.png", {
        }).then(res => res.blob())
            /*
            .then(blob => new Promise<string>((res, rej) => {
                let reader = new FileReader();
                reader.onload = function() { res(this.result) };
                reader.onerror = rej;
                reader.readAsDataURL(blob)
            })
            */
            .then(blob => URL.createObjectURL(blob))
            .then(url => { console.log(url); return url })
            .then(url => this.setState({ imageUrl: url }))
    }
}

export default createContainer(DebugScreen)((state, dispatch) => ({
    ...createDispacherProps(dispatch),
    entitiesState: JSON.stringify(state.entities),
}));
