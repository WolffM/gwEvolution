import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export type NameplateProps = {
  title: string;
  color: string; // accent color
  icon: string; // url/path to icon
  lottieUrl?: string; // optional lottie json path (public or resolved url)
};

export function Nameplate({ title, color, icon, lottieUrl }: NameplateProps) {
  const lottieRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lottieUrl || !lottieRef.current) return;
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: lottieUrl,
    });
    return () => anim?.destroy();
  }, [lottieUrl]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(17, 17, 20, 0.75)",
        border: `1px solid ${color}80`,
        boxShadow: `0 6px 20px ${color}26, inset 0 0 20px ${color}1a`,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        color: "#fff",
        maxWidth: 460,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: `${color}33`,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          border: `1px solid ${color}66`,
        }}
      >
        {lottieUrl ? (
          <div ref={lottieRef} style={{ width: 40, height: 40 }} />
        ) : (
          <img src={icon} alt="icon" style={{ width: 28, height: 28 }} />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span
          style={{
            fontSize: 14,
            lineHeight: 1.1,
            opacity: 0.8,
            marginBottom: 2,
          }}
        >
          Selected Class
        </span>
        <strong
          style={{
            fontSize: 18,
            lineHeight: 1.15,
            textShadow: `0 1px 0 #000`,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </strong>
      </div>
    </div>
  );
}
