import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, combineReducers as _combineReducers, Dispatch, Reducer } from "redux";
import { Omit, PartialExcept } from "./types";

export interface BaseAction<T, P={}, M={}> extends AnyAction {
    type: T,
    payload: P,
    meta?: M,
}

export interface ErrorPayload {
    message: string,
    code: number,
}

export interface ActionCreator<Payload, Meta> {
    (payload: Payload, meta?: Meta): BaseAction<string, Payload>,
    type: string,
}

export interface AsyncActionCreator<Success, Error, SuccessMeta = never, ErrorMeta = never> {
    START: ActionCreator<{}, never>,
    SUCCESS: ActionCreator<Success, SuccessMeta>,
    ERROR: ActionCreator<Error, ErrorMeta>,
    baseType: string,
    types: string[],

    isLoading: (loadingState: LoadingState<any>) => boolean,
    getError: (loadingState: LoadingState<Error>) => Error | undefined,
}

export interface LoadingState<ErrorState = ErrorPayload> {
    loadingKeys: string[],
    errors: { [key: string]: ErrorState | undefined }
}

export interface EntityBase {
    id: string
}

export interface EntityActionCreator<Entity extends EntityBase> {
    LOAD: ActionCreator<EntityState<Entity>, never>,
    ADD: ActionCreator<Omit<Entity, "id">, never>,
    ADD_MANY: ActionCreator<Omit<Entity, "id">[], never>,
    DELETE: ActionCreator<{ id: Entity["id"]}, never>,
    DELETE_ALL: ActionCreator<{}, never>,
    UPDATE: ActionCreator<PartialExcept<Entity, "id">, never>,
    baseType: string,
    types: string[],
}

export interface EntityState<Entity extends EntityBase> {
    [id: string]: Entity | undefined
}

export interface UndoableState<BaseState> {
    past: BaseState[],
    present: BaseState,
    future: BaseState[],
}

export interface UndoableActionCreator {
    UNDO: ActionCreator<{}, never>,
    REDO: ActionCreator<{}, never>,
    CLEAR: ActionCreator<{}, never>
}

export type AnyActionCreator = ActionCreator<any, any>;
export type AnyAsyncActionCreator = AsyncActionCreator<any, any, any>;


export type ReduceHandler<State, Payload, Meta> = (state: State, payload: Payload, type: string, meta?: Meta) => State;
export type DefaultReduceHandler<State> = (state: State, action: AnyAction) => State;

export const actionWithMeta = function<Payload, Meta>(type: string): ActionCreator<Payload, Meta> {
    return Object.assign((payload: Payload, meta?: Meta) => ({ type, payload, meta }), { type })
}

export const action = function<Payload>(type: string): ActionCreator<Payload, never> {
    return actionWithMeta<Payload, never>(type);
}

export const asyncAction = function<Success, Error = ErrorPayload>(type: string): AsyncActionCreator<Success, Error> {
    let creators: AsyncActionCreator<Success, Error> = {
        START: action(type + "/start"),
        SUCCESS: action(type + "/success"),
        ERROR: action(type + "/error"),

        baseType: type,
        types: [],
        isLoading: (loadingState) => loadingState.loadingKeys.includes(type),
        getError: (loadingState) => loadingState.errors[type],
    }
    creators.types.push(
        creators.START.type,
        creators.ERROR.type,
        creators.SUCCESS.type,
    );
    return creators;
}

export const entityAction = function<Entity extends EntityBase>(type: string): EntityActionCreator<Entity> {
    const creator: EntityActionCreator<Entity> = {
        LOAD: action(type + "/load"),
        ADD: action(type + "/add"),
        ADD_MANY: action(type + "/add_many"),
        DELETE: action(type + "/delete"),
        DELETE_ALL: action(type + "/delete_all"),
        UPDATE: action(type + "/update"),
        
        baseType: type,
        types: [],
    };
    creator.types.push(
        creator.ADD.type,
        creator.ADD_MANY.type,
        creator.DELETE.type,
        creator.DELETE_ALL.type,
        creator.LOAD.type,
        creator.UPDATE.type,
    );
    return creator;
}

export const undoableAction = function(type: string): UndoableActionCreator {
    return {
        CLEAR: action(type + "/clear"),
        REDO: action(type + "/redo"),
        UNDO: action(type + "/undo")
    }
}

export class ReducerBuilder<State> {

    private _initialState: State;
    private _handlers: Map<string, ReduceHandler<State, any, any>> = new Map();
    private _defaultHandler: DefaultReduceHandler<State> | undefined = undefined;

    constructor(initialState: State) {
        this._initialState = initialState;
    }

    public case<Payload, Meta>(
        actionCreator: ActionCreator<Payload, Meta>,
        handler: ReduceHandler<State, Payload, Meta>
    ): ReducerBuilder<State> {
        this._handlers.set(actionCreator.type, handler);
        return this;
    }

    public default(handler: DefaultReduceHandler<State>): ReducerBuilder<State> {
        this._defaultHandler = handler;
        return this;
    }

    public build(): (state: State | undefined, action: AnyAction) => State {
        return (state = this._initialState, action) => {
            let handler = this._handlers.get(action.type)
            if (handler) {
                return handler(state, action.payload, action.type, action.meta);
            } else if (this._defaultHandler) {
                return this._defaultHandler(state, action);
            } else {
                return state;
            }
        }
    }
}

export class LoadingReducerBuilder<ErrorState = ErrorPayload> {

    private _builder = new ReducerBuilder<LoadingState<ErrorState>>({ loadingKeys: [], errors: {} });

    private start = (key: string) => (state: LoadingState<ErrorState>, _: any) => {
        if (state.loadingKeys.includes(key)) {
            return state;
        } else {
            let errors = Object.assign({}, state.errors);
            delete errors[key];
            return {
                loadingKeys: state.loadingKeys.concat([key]),
                errors,
            }
        }
    }

    private error = (key: string) => (state: LoadingState<ErrorState>, p: ErrorState) => {
        if (state.loadingKeys.includes(key)) {
            return {
                loadingKeys: state.loadingKeys.filter(loadingKey => loadingKey !== key),
                errors: {
                    ...state.errors,
                    [key]: p
                }
            }
        } else {
            console.warn("invalid state, error action received but not it is not loading. key = ", key);
            return state
        }
    }

    private success = (key: string) => (state: LoadingState<ErrorState>, _: any) => {
        if (state.loadingKeys.includes(key)) {
            return {
                loadingKeys: state.loadingKeys.filter(loadingKey => loadingKey !== key),
                errors: state.errors
            }
        } else {
            console.warn("invalid state, success action received but not it is not loading. key = ", key);
            return state;
        }
    }

    public add<Success>(creator: AsyncActionCreator<Success, ErrorState>): LoadingReducerBuilder<ErrorState> {
        this._builder = this._builder
            .case(creator.START, this.start(creator.baseType))
            .case(creator.ERROR, this.error(creator.baseType))
            .case(creator.SUCCESS, this.success(creator.baseType))
        
        return this;
    }

    public build() {
        return this._builder.build();
    }

}

export class EntityReducerBuilder<Entity extends EntityBase> {

    private builder: ReducerBuilder<EntityState<Entity>>;

    constructor(actionCreator: EntityActionCreator<Entity>, generateId: () => string, initialState: EntityState<Entity> = {}) {
        this.builder = new ReducerBuilder<EntityState<Entity>>(initialState);
        this.builder
            .case(actionCreator.LOAD, (state, payload) => {
                return { ...state, ...payload }
            })
            .case(actionCreator.ADD, (state, payload) => {
                let id = generateId();
                let entity: Entity = Object.assign({}, payload, { id }) as any;
                return {
                    ...state,
                    [id]: entity
                }
            })
            .case(actionCreator.ADD_MANY, (state, payload) => {
                return payload.reduce((state, entity) => {
                    let id = generateId();
                    state[id] = Object.assign({}, entity, { id }) as any
                    return state;
                }, Object.assign({}, state));
            })
            .case(actionCreator.DELETE, (state, payload) => {
                let newState = { ...state };
                delete newState[payload.id];
                return newState;
            })
            .case(actionCreator.DELETE_ALL, () => {
                return { };
            })
            .case(actionCreator.UPDATE, (state, payload) => {
                let oldValue = state[payload.id];
                let newValue = Object.assign({}, oldValue, payload) as any;
                return {
                    ...state,
                    [payload.id]: newValue 
                }
            })
    }

    public build() {
        return this.builder.build();
    }

}

export type ReducerMap<State> = {
    [P in keyof State]: Reducer<State[P]>
}

export const combineReducers = function <State>(map: ReducerMap<State>) {
    return (_combineReducers<State>(map) as (state: State | undefined, action: AnyAction) => State);
}

export abstract class DispatcherBase<State> {

    protected dispatch: Dispatch<any>;

    constructor(dispatch: Dispatch<any>) {
        this.dispatch = dispatch;
    }

    protected disptachAsync<Success, Error>(
        asyncActionCreator: AsyncActionCreator<Success, Error>,
        handler: (getState: () => State) => Promise<Success>,
        handleError: (dispatch:Dispatch<any>, errorActionCreator: ActionCreator<Error, never>, e: any) => void
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.dispatch(async (dispatch, getState: () => State) => {
                try {
                    dispatch(asyncActionCreator.START({}));
                    let success = await handler(getState);
                    dispatch(asyncActionCreator.SUCCESS(success));
                    resolve(true);
                } catch (e) {
                    handleError(dispatch, asyncActionCreator.ERROR, e);
                    resolve(false);
                }
            })
        });
    }
}

export interface UndoableConfig {
    limit: number,
    initAction: string,
    filter: (action: AnyAction) => boolean,
}

const defaultUndoableConfig: UndoableConfig = {
    limit: 10,
    initAction: "@@UNDOABLE/INIT",
    filter: (_) => true
}

export const undoable = function<State>(reducer: (state: State | undefined, action: AnyAction) => State, actions: UndoableActionCreator, config?: Partial<UndoableConfig>) {
    const mergedConfig = Object.assign({}, defaultUndoableConfig, config);

    const initialPresent = reducer(undefined, { type: mergedConfig.initAction });
    const initialState = {
        past: [],
        present: initialPresent,
        future: []
    }
    let builder = new ReducerBuilder<UndoableState<State>>(initialState);
    builder
        .case(actions.CLEAR, (_state, _payload) => initialState)
        .case(actions.UNDO, (state) => {
            if (state.past.length > 0) {
                let present = state.past[0];
                return {
                    past: state.past.slice(1),
                    present,
                    future: [state.present, ...state.future]
                }
            } else {
                return state;
            }
        })
        .case(actions.REDO, (state) => {
            if (state.future.length > 0) {
                let present = state.future[0];
                return {
                    past: [state.present, ...state.past],
                    present,
                    future: state.future.slice(1)
                }
            } else {
                return state;
            }
        })
        .default((state, action) => {
            if (mergedConfig.filter(action)) {
                let newState = reducer(state.present, action);
                if (newState === state.present) {
                    return state;
                } else {
                    return {
                        past: [state.present, ...state.past.slice(0, mergedConfig.limit - 1)],
                        present: newState,
                        future: []
                    }
                }
            }
            return state;
        })
    return builder.build();
}

export interface MapToProps<RootState, Props, OwnProps> {
    (state: RootState, dispatch: Dispatch<any>, ownProps: OwnProps): Props & Children
}

type ReadOnlyChildren = Readonly<{ children?: React.ReactNode }>
export type Children = { children?: React.ReactNode }

export function bindCreateContainer<State>() {
    return function componentWrapper<Props>(comp: React.ComponentType<Props> | React.StatelessComponent<Props>) {
        return function createContainer<OwnProps>(mapToProps: MapToProps<State, Props, OwnProps & ReadOnlyChildren>, passThroughOwnProps?: boolean) {
            const decorator = connect(
                (state: State) => ({ state: state }),
                (dispatch: Dispatch<any>) => ({ dispatch: dispatch }),
                (state, dispatch, ownProps: OwnProps & ReadOnlyChildren) => {
                    const mapped = mapToProps(state.state, dispatch.dispatch, ownProps);
                    if (!mapped.children) {
                        ownProps.children;
                    }
                    if (passThroughOwnProps || mapToProps.length <= 2) {
                        let mappedAsAny = (mapped as any);
                        Object.entries(ownProps).forEach(([key, value]) => {
                            if (!mappedAsAny[key]) {
                                mappedAsAny[key] = value;
                            }
                        })
                    }
                    return mapped;
                });
            return decorator(comp);
        }
    }
}

export default {
    bindCreateContainer,
    combineReducers,

    action,
    actionWithMeta,
    asyncAction,
    entityAction,
    undoableAction,

    ReducerBuilder,
    LoadingReducerBuilder,
    EntityReducerBuilder,
    undoable,

    DispatcherBase,
}
