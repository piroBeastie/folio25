import connectData from './connectData.js'
import './Connect.css'

function Connect() {
  return (
    <div id="connectDiv">
      {connectData.map((link) => (
        <p key={link.name}>
          {link.link ? (
            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              {...(link.download ? { download: 'Nanakjot_Singh_Chahal_Resume.pdf' } : {})}
            >
              <span className="connectLabel">{link.name}</span>
              <svg className="connectArrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M17 7H8M17 7V16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <span className="connectLabel connectStatic">
              {link.name}
              {link.handle ? <span className="connectHandle">{link.handle}</span> : null}
            </span>
          )}
        </p>
      ))}
    </div>
  )
}

export default Connect
