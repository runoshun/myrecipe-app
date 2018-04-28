import { bindCreateContainer } from "@root/utils/redux";
import { StoreState } from "@root/store";
import { Router } from "@root/navigators";
import { Dispatch } from "react-redux";
import { AppDispatcher, EntitiesDispatcher } from "@root/dispatchers";

export const createContainer = bindCreateContainer<StoreState>();
export default createContainer;

export interface DispatcherProps {
    router: Router,
    entities: EntitiesDispatcher,
    app: AppDispatcher,
}

export const createDispacherProps = (dispatch: Dispatch<any>): DispatcherProps => {
    return {
        router: new Router(dispatch),
        entities: new EntitiesDispatcher(dispatch),
        app: new AppDispatcher(dispatch)
    }
}