import { Icon as IconifyIcon } from "@iconify/react";

interface IconProps {
    icon: string;
    size?: string | number;
    color?: string;
    className?: string;
    style?: Record<string, any>;
}

export function Icon({ icon, size = "20px", color, className, style }: IconProps) {
    return (
        <IconifyIcon
            icon={icon}
            className={className}
            style={{
                fontSize: size,
                color: color,
                display: "inline-block",
                verticalAlign: "middle",
                ...style,
            }}
        />
    );
}