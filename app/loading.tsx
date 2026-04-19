export default function Loading() {
  return (
    <div className="route-loader" aria-live="polite" aria-busy="true">
      <div className="route-loader-inner">
        <div className="route-loader-mark">
          <span className="route-loader-initials">
            ST
          </span>
        </div>
        <p className="route-loader-title">
          Loading page
        </p>
        <p className="route-loader-kicker">
          Please wait
        </p>
        <div className="route-loader-track">
          <div className="route-loader-bar" />
        </div>
      </div>
      <style>{`
        .route-loader {
          min-height: calc(100vh - var(--nav-h));
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAFBFE 100%);
          padding: 96px 20px 64px;
        }

        .route-loader-inner {
          text-align: center;
        }

        .route-loader-mark {
          width: 68px;
          height: 68px;
          border-radius: 18px;
          margin: 0 auto 18px;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 36px rgba(13,31,60,0.16);
        }

        .route-loader-initials {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--gold-3);
          line-height: 1;
        }

        .route-loader-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
        }

        .route-loader-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .route-loader-track {
          width: 180px;
          height: 2px;
          margin: 18px auto 0;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(13,31,60,0.08);
        }

        .route-loader-bar {
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-3), transparent);
          animation: route-loader 1.1s ease-in-out infinite;
        }

        @keyframes route-loader {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}