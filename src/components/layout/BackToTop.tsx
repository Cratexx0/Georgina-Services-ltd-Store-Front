import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-40 h-10 w-10 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:opacity-90"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
};

export default BackToTop;
