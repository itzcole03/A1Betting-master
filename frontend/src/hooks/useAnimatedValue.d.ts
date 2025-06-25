interface SpringConfig {
    stiffness: number;
    damping: number;
    mass: number;
    precision?: number;
}
interface AnimationConfig {
    duration?: number;
    spring?: SpringConfig;
    onComplete?: () => void;
}
export declare function useAnimatedValue(initialValue: number, config?: AnimationConfig): {
    value: number;
    isAnimating: boolean;
    animateTo: (target: number, newConfig?: AnimationConfig) => void;
    jumpTo: (target: number) => void;
    cancel: () => void;
};
export {};
