import { AnimationControls } from 'framer-motion';
interface UseAnimationOptions {
    duration?: number;
    delay?: number;
    ease?: string;
}
export declare const useCustomAnimation: ({ duration, delay, ease }?: UseAnimationOptions) => {
    controls: import("motion-dom").LegacyAnimationControls;
    isAnimating: boolean;
    fadeIn: (options?: {
        [key: string]: any;
    }) => Promise<void>;
    fadeOut: (options?: {
        [key: string]: any;
    }) => Promise<void>;
    slideIn: (direction: "left" | "right" | "top" | "bottom", options?: {
        [key: string]: any;
    }) => Promise<void>;
    pulse: (options?: {
        [key: string]: any;
    }) => Promise<void>;
    shake: (options?: {
        [key: string]: any;
    }) => Promise<void>;
    bounce: (options?: {
        [key: string]: any;
    }) => Promise<void>;
    animate: (variants: {
        [key: string]: any;
    }, options?: {
        [key: string]: any;
    }) => Promise<void>;
};
export declare const fadeInUp: {
    initial: {
        opacity: number;
        y: number;
    };
    animate: {
        opacity: number;
        y: number;
    };
    exit: {
        opacity: number;
        y: number;
    };
    transition: {
        duration: number;
    };
};
export declare const fadeIn: {
    initial: {
        opacity: number;
    };
    animate: {
        opacity: number;
    };
    exit: {
        opacity: number;
    };
    transition: {
        duration: number;
    };
};
export declare const slideIn: {
    initial: {
        x: number;
        opacity: number;
    };
    animate: {
        x: number;
        opacity: number;
    };
    exit: {
        x: number;
        opacity: number;
    };
    transition: {
        duration: number;
    };
};
export declare const scaleIn: {
    initial: {
        scale: number;
        opacity: number;
    };
    animate: {
        scale: number;
        opacity: number;
    };
    exit: {
        scale: number;
        opacity: number;
    };
    transition: {
        duration: number;
    };
};
export declare const useOddsAnimation: (value: number) => AnimationControls;
export declare const bounceIn: {
    initial: {
        scale: number;
    };
    animate: {
        scale: number;
    };
    transition: {
        type: string;
        stiffness: number;
        damping: number;
    };
};
export declare const staggerChildren: {
    initial: {
        opacity: number;
    };
    animate: {
        opacity: number;
        transition: {
            staggerChildren: number;
        };
    };
};
export {};
