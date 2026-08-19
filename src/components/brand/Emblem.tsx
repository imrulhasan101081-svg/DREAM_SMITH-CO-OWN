/**
 * Dream Smith Co-Own emblem — the diamond badge with sun, palm, house.
 * Inlined SVG so it inherits page fonts and stays crisp at any size.
 */

let uid = 0;

export default function Emblem({
  className = '',
  title,
}: {
  className?: string;
  title?: string;
}) {
  const k = `em${++uid}`;

  return (
    <svg
      viewBox="0 0 260 260"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${k}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0" stopColor="#F2D89D" />
          <stop offset=".4" stopColor="#D4AF6A" />
          <stop offset=".85" stopColor="#B08D4F" />
          <stop offset="1" stopColor="#8C6B32" />
        </linearGradient>
        <linearGradient id={`${k}-gg`} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#B08D4F" />
          <stop offset=".5" stopColor="#FDF2D6" />
          <stop offset="1" stopColor="#D4AF6A" />
        </linearGradient>
        <linearGradient id={`${k}-n`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#0E223D" />
          <stop offset="1" stopColor="#071120" />
        </linearGradient>
      </defs>

      <g transform="translate(130 130)">
        <rect
          x="-85" y="-85" width="170" height="170" rx="14"
          transform="rotate(45)"
          fill={`url(#${k}-n)`}
          stroke={`url(#${k}-g)`}
          strokeWidth="2.5"
        />
        <rect
          x="-74" y="-74" width="148" height="148" rx="8"
          transform="rotate(45)"
          fill="none"
          stroke="#D4AF6A"
          strokeOpacity=".35"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        <g transform="translate(0 8)">
          <g transform="translate(-32 -42)">
            <circle r="14" fill={`url(#${k}-gg)`} />
            <g stroke="#D4AF6A" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M-16-8C-22-14-19-20-19-20C-19-20-13-17-10-12M-8-17C-10-25-5-29-5-29C-5-29-2-23-3-17M5-18C6-26 13-28 13-28C13-28 12-22 8-17M16-10C22-15 27-13 27-13C27-13 23-8 18-6M-20 2C-28 0-30-6-30-6C-30-6-24-4-19-1" />
            </g>
          </g>

          <g transform="translate(32 -26) scale(.9)" fill="#D4AF6A">
            <path d="M-2 38Q-6 18-1 0Q3 18 1 38Z" />
            <path d="M0 0C-8-6-18-4-25 2C-18 7-8 3 0 0ZM0 0C-4-12-12-18-22-16C-17-9-8-5 0 0ZM0 0C4-14 10-20 18-20C16-11 8-5 0 0ZM0 0C12-10 22-10 26-2C18 1 9-2 0 0ZM0 0C14-2 24 6 24 16C16 11 8 5 0 0ZM0 0C-12 2-20 12-18 22C-13 14-6 6 0 0Z" />
          </g>

          <path
            d="M-48 10L-14-18L22 10Z"
            fill="none"
            stroke="#fff"
            strokeWidth="4.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M2-4V-16H12V4" fill="none" stroke="#fff" strokeWidth="2.5" />
          <rect x="5" y="-12" width="4" height="4" fill={`url(#${k}-g)`} />
          <g transform="translate(-19 -4)">
            <rect width="10" height="10" rx="1" fill={`url(#${k}-g)`} />
            <path d="M5 0V10M0 5H10" stroke="#071120" strokeWidth="1.2" />
          </g>

          <path d="M-60 22Q-10 2 52 24C20 16-25 15-60 22Z" fill={`url(#${k}-g)`} />
          <path d="M-52 30Q-10 12 44 32C15 24-22 23-52 30Z" fill="#fff" opacity=".6" />
        </g>

        <g fill="#D4AF6A">
          <circle cy="-104" r="3" />
          <circle cx="104" r="3" />
          <circle cy="104" r="3" />
          <circle cx="-104" r="3" />
        </g>
      </g>
    </svg>
  );
}
