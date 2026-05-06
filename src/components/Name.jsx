import './Name.css'

// Spans must be on a single line so JSX doesn't insert whitespace
// between them — the loader text "nanakchahal" must render seamlessly.
function Name() {
  return (
    <div id="loader">
      <span id="letterN">n</span><span className="loaderFill" id="fillAnak">anak</span><span id="letterC">c</span><span className="loaderFill" id="fillHahal">hahal</span>
    </div>
  )
}

export default Name
