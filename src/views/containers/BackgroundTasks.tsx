import * as React from "react";
import { createContainer, createDispacherProps, DispatcherProps } from "../createContainer";

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
            console.error(e)
        }
    }
}

export default createContainer(BackgroundTasks)((_state, dispatch) => ({
    ...createDispacherProps(dispatch)
}));