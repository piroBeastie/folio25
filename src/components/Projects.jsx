import './Projects.css'
import data from './projectsData.js'

function Projects() {
  return (
    <div id="projectRefs">
      {data.map((proj) => (
        <p className="projectPara" key={proj.key}>
          <a href={proj.link} target="_blank" rel="noopener noreferrer">
            {proj.name}
          </a>
          <sup className="sup">({proj.year})</sup>
        </p>
      ))}
    </div>
  )
}

export default Projects
