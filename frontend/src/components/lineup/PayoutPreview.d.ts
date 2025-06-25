// Type definition
interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  salary: number;
  confidence: number;
  projectedPoints?: number;
}
interface PayoutPreviewProps {
  selectedPlayers: Player[];
  entryFee: number;
  className?: string;
}
export declare function PayoutPreview({
  selectedPlayers,
  entryFee,
  className,
}: PayoutPreviewProps): import("react/jsx-runtime").JSX.Element;
export {};
