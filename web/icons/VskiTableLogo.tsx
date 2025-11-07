import { h } from "preact";

export function VskiTableLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210 30"
      class="font-mono h-16 w-78"
    >
      <style>
        {`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
        .text {
          font-size: 32px;
          fill: url(#logo-gradient);
        }
        .dot {
          fill: #007bff;
          animation: pulse 2s ease-in-out infinite;
        }
      `}
      </style>
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#055fb8ff" />
          <stop offset="100%" stop-color="#038db3ff" />
        </linearGradient>
      </defs>
      <text x="0" y="30" class="text">vski</text>
      <circle cx="95" cy="20" r="5" class="dot" />
      <text x="110" y="30" class="text">table</text>
    </svg>
  );
}
