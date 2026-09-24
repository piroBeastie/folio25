import RollingText from './RollingText'
import './Resume.css'

const RESUME_FILE = 'Nanakjot_Singh_Chahal_Resume.pdf'

function Resume() {
  return (
    <a
      id="resumeLink"
      href={`/${RESUME_FILE}`}
      download={RESUME_FILE}
      aria-label="Download resume (PDF)"
    >
      <RollingText text="resume ↓" />
    </a>
  )
}

export default Resume
