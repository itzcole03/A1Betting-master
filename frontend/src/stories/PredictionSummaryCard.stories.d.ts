import { Meta, StoryObj } from '@storybook/react';
import { PredictionSummaryCard } from '../components/ui/PredictionSummaryCard';
declare const meta: Meta<typeof PredictionSummaryCard>;
export default meta;
type Story = StoryObj<typeof PredictionSummaryCard>;
export declare const Default: Story;
export declare const WithCallbacks: Story;
export declare const HighRisk: Story;
export declare const LowRisk: Story;
