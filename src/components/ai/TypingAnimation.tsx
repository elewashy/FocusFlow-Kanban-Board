export function TypingAnimation() {
  return (
    <div className="flex space-x-2 items-center p-2">
      <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:-0.3s] shadow-sm"></div>
      <div className="w-2 h-2 bg-primary/90 rounded-full animate-bounce [animation-delay:-0.15s] shadow-sm"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-sm"></div>
    </div>
  );
}
