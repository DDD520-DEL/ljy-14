import { cn } from '@/lib/utils';

interface EmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function Empty({ icon, title, description, className }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="mb-4 text-gray-300">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-xl font-bold text-gray-500 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-400 max-w-md">
          {description}
        </p>
      )}
      {!icon && !title && !description && (
        <span className="text-gray-400">Empty</span>
      )}
    </div>
  );
}
