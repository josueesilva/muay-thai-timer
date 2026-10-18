import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';
import { DurationStepper } from './DurationStepper';

interface Props {
  value: number;
  onChange: (seconds: number) => void;
}

export function RestTimeInput({ value, onChange }: Props) {
  return (
    <Card>
      <SectionLabel>REST BETWEEN EXERCISES</SectionLabel>
      <DurationStepper value={value} onChange={onChange} step={5} min={0} max={300} />
    </Card>
  );
}
