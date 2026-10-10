import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel = "Continue Shopping",
  actionTo = "/category/clothes",
  onAction,
  className,
}) => {
  return (
    <div className={cn("text-center py-16 px-4", className)}>
      {icon && (
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
      {onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : (
        <Button asChild>
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
