import React, { useEffect, useCallback, useState, type ReactNode } from "react";

interface ImageZoomOverlayProps {
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}

export default function ImageZoomOverlay({
  src,
  alt,
  caption,
  onClose,
}: ImageZoomOverlayProps): ReactNode {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    // Prevent body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200); // Wait for exit animation
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // Parse caption: split "Figure N:" prefix from the rest
  const renderCaption = () => {
    if (!caption) return null;

    const figureMatch = caption.match(/^(Figure\s+\d+)(?::\s*(.*))?$/);
    if (figureMatch) {
      const figureLabel = figureMatch[1];
      const rest = figureMatch[2] || "";
      return (
        <div className="image-zoom-caption">
          <strong>{figureLabel}</strong>
          {rest ? `: ${rest}` : ""}
        </div>
      );
    }

    return <div className="image-zoom-caption">{caption}</div>;
  };

  return (
    <div
      className={`image-zoom-overlay ${visible ? "image-zoom-overlay--visible" : ""}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Zoomed image"}
    >
      <button
        className="image-zoom-close"
        onClick={handleClose}
        aria-label="Close"
      >
        ✕
      </button>
      <div
        className="image-zoom-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className="image-zoom-img"
          src={src}
          alt={alt}
        />
        {renderCaption()}
      </div>
    </div>
  );
}
