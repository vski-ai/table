import { useEffect, useState } from "preact/hooks";

export const Background = () => {
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg)",
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = globalThis;
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);

      const rotateX = -y * 3;
      const rotateY = x * 3;
      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      );
    };

    globalThis.addEventListener("mousemove", handleMouseMove);

    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <>
      <div
        class="fixed -top-10 left-0 right-0 w-full h-[300vh] z-0 pointer-events-none"
        style={{ transform, transition: "transform 0.2s ease-out" }}
      >
        <div
          class="w-full h-full"
          style={{ animation: "slow-pan 30s ease-in-out infinite alternate" }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <rect width="40" height="40" fill="transparent" />
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  style={{ stroke: "var(--color-secondary)" }}
                  strokeWidth="1"
                  opacity="0.1"
                />
                <rect
                  x="5"
                  y="5"
                  width="40"
                  height="40"
                  style={{ fill: "var(--color-primary)" }}
                  opacity="0.01"
                  rx="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      <style>
        {`
          @keyframes slow-pan {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, 20px) scale(1.05); }
            100% { transform: translate(0, 0) scale(1); }
          }
        `}
      </style>
    </>
  );
};
