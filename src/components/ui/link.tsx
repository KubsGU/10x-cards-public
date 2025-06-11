import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ className, href, children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      className={cn("text-foreground hover:text-primary transition-colors duration-200", className)}
      {...props}
    >
      {children}
    </a>
  );
});

Link.displayName = "Link";

export { Link };
