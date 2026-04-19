export default function Loading() {
  return (
    <div className="admin-route-loader">
      <div className="admin-route-loader-inner">
        <div className="admin-route-loader-mark">
          <span className="admin-route-loader-initials">ST</span>
        </div>
        <p className="admin-route-loader-title">
          Opening admin area
        </p>
        <p className="admin-route-loader-kicker">
          One moment
        </p>
      </div>

      <style>{`
        .admin-route-loader {
          min-height: calc(100vh - var(--nav-h));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 96px 20px 72px;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAFBFE 100%);
        }

        .admin-route-loader-inner {
          text-align: center;
        }

        .admin-route-loader-mark {
          width: 60px;
          height: 60px;
          margin: 0 auto 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 36px rgba(13,31,60,0.16);
        }

        .admin-route-loader-initials {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--gold-3);
        }

        .admin-route-loader-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
        }

        .admin-route-loader-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
        }
      `}</style>
    </div>
  )
}