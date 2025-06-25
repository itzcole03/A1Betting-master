type StateConfig<TState extends string, TEvent extends string> = {
    [K in TState]: {
        on?: {
            [E in TEvent]?: {
                target: TState;
                action?: (context: unknown) => void;
                guard?: (context: unknown) => boolean;
            };
        };
        onEnter?: (context: unknown) => void;
        onExit?: (context: unknown) => void;
    };
};
interface StateMachineOptions<TState extends string, TEvent extends string> {
    initial: TState;
    states: StateConfig<TState, TEvent>;
    context?: unknown;
    onTransition?: (from: TState, to: TState, event: TEvent) => void;
}
interface StateMachineResult<TState extends string, TEvent extends string> {
    state: TState;
    context: unknown;
    send: (event: TEvent) => void;
    can: (event: TEvent) => boolean;
    matches: (state: TState) => boolean;
    history: Array<{
        state: TState;
        event: TEvent | null;
    }>;
}
export declare function useStateMachine<TState extends string, TEvent extends string>({ initial, states, context: initialContext, onTransition }: StateMachineOptions<TState, TEvent>): StateMachineResult<TState, TEvent>;
export {};
