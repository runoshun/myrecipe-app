import * as React from "react";
import { createContainer, createDispacherProps, DispatcherProps } from "../createContainer";
import firebase from "react-native-firebase";
import { BACKGROUND_TASKS_FAILED } from "@root/resources/errorCodes";

interface BackgroundTasksProperties extends DispatcherProps {
}

class BackgroundTasks extends React.Component<BackgroundTasksProperties> {
    render() { return null }

    async componentDidMount() {
        try {
            let userId = await this.props.app.signInAnonymously();
            await this.props.app.uploadRecipesIfModified(userId);
        }
        catch(e) {
            firebase.crashlytics().recordError(
                BACKGROUND_TASKS_FAILED,
                e.message || e.toString()
            )
        }
    }
}

export default createContainer(BackgroundTasks)((_state, dispatch) => ({
    ...createDispacherProps(dispatch)
}));