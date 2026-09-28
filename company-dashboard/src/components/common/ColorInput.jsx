import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ColorInput({ name, label, value, onChange }) {
  const colorVal = value || '#000000';

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-gray-700">{label}</Label>
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none z-10">
          <span
            className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs block shrink-0 transition-colors"
            style={{ backgroundColor: colorVal }}
          />
        </div>
        <Input
          type="color"
          value={colorVal}
          onChange={(e) => onChange(e.target.value)}
          className="absolute left-2.5 w-5 h-5 opacity-0 cursor-pointer p-0 border-0 z-20"
        />
        <Input
          type="text"
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 text-xs font-mono font-semibold uppercase tracking-wider h-9"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
