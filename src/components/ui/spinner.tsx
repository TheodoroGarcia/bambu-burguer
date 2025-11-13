interface SpinnerProps {
  height?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
}

export default function Spinner({ 
  height, 
  size = "md", 
  variant = "default" 
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  };

  const borderSize = {
    sm: "border-2",
    md: "border-4",
    lg: "border-6"
  };

  if (variant === "minimal") {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: height ? `${height}px` : "auto" }}
      >
        <div className={`${sizeClasses[size]} ${borderSize[size]} border-bambu-green rounded-full border-t-bambu-beige animate-spin`}></div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center bg-bambu-beige"
      style={{ height: height ? `${height}px` : "100vh" }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-bambu-brown/10 rounded-full blur-sm animate-pulse"></div>
        
        <div className={`relative ${sizeClasses[size]} ${borderSize[size]} border-bambu-green rounded-full border-t-bambu-beige animate-spin`}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-bambu-brown rounded-full flex items-center justify-center">
            <span className="text-xs">🍔</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-bambu-brown font-semibold text-lg">
          Bambu Burger
        </h3>
        <p className="text-bambu-green-dark text-sm mt-1 animate-pulse">
          Preparando algo delicioso...
        </p>
      </div>

      <div className="flex gap-1 mt-3">
        <div className="w-2 h-2 bg-bambu-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-bambu-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-bambu-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
