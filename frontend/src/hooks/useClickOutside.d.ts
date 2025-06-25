import { RefObject } from 'react';
type Event = MouseEvent | TouchEvent;
export declare const useClickOutside: <T extends HTMLElement = HTMLElement>(handler: (event: Event) => void, mouseEvent?: "mousedown" | "mouseup") => RefObject<T>;
export {};
