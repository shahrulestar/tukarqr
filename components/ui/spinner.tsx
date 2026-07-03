import { LoaderIcon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof LoaderIcon>, "icon">) {
  return (
    <LoaderIcon
      data-slot="spinner"
      className={cn("size-4", className)}
      {...props}
    />
  );
}

export { Spinner };
