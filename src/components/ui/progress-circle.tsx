interface ProgressCircleProps {
  value: number; // 0-100
}

export function ProgressCircle({ value }: ProgressCircleProps) {
  const strokeDashoffset = 282 - (value / 100) * 282;

  return (
    <div className="relative h-32 w-32">
      <svg className="h-full w-full rotate-[-90deg]">
        <circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="#E5E7EB"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray="282"
          strokeDashoffset={strokeDashoffset}
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
        {value}/100
      </div>
    </div>
  );
}
