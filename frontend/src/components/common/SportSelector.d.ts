interface SportSelectorProps {
    selectedSport: string;
    onSportChange: (sport: string) => void;
    label?: string;
}
export declare function SportSelector({ selectedSport, onSportChange, label }: SportSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
