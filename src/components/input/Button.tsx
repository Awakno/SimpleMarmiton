interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const Button = ({
    className = "",
    children,
    onClick,
}: ButtonProps) => {
    const baseStyles = "px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
    const colorStyles = "bg-[#e07a5f] hover:bg-[#d4694a] focus:ring-[#e07a5f]";
    
    return (
        <button
            className={`${baseStyles} ${colorStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
