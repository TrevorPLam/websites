/**
 * @file admin/src/shared/ui/MetricCard.tsx
 * @summary Shared utilities and components.
 * @description Reusable functionality across admin application.
 * @security none
 * @requirements none
 */
interface MetricCardProps {
  label: string;
  value: number;
  color?: 'gray' | 'green' | 'blue' | 'red';
}

export function MetricCard({ label, value, color = 'gray' }: MetricCardProps) {
  const colorMap: Record<string, string> = {
    gray: 'text-gray-900',
    green: 'text-green-700',
    blue: 'text-blue-700',
    red: 'text-red-700',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-4xl font-extrabold mt-1 ${colorMap[color]}`}>{value.toLocaleString()}</p>
    </div>
  );
}
