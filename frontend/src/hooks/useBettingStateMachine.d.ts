import { BettingDecision, PlayerProp } from '@/types';
type BettingState = 'idle' | 'selecting' | 'analyzing' | 'reviewing' | 'confirming' | 'submitting' | 'completed' | 'error';
type BettingEvent = 'SELECT' | 'ANALYZE' | 'REVIEW' | 'CONFIRM' | 'SUBMIT' | 'RETRY' | 'RESET';
interface BettingContext {
    selectedProps: PlayerProp[];
    analysis: BettingDecision | null;
    stake: number;
    error: Error | null;
}
interface UseBettingStateMachineOptions {
    onStateChange?: (from: BettingState, to: BettingState) => void;
    onSubmit?: (context: BettingContext) => Promise<void>;
}
export declare function useBettingStateMachine({ onStateChange, onSubmit }?: UseBettingStateMachineOptions): {
    state: BettingState;
    context: unknown;
    can: (event: BettingEvent) => boolean;
    send: (event: BettingEvent) => void;
    selectProps: (props: PlayerProp[]) => void;
    setStake: (stake: number) => void;
    setAnalysis: (analysis: BettingDecision) => void;
};
export {};
