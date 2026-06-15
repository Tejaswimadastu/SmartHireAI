import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function ATSScoreCircle({
  score,
  title
}) {
  return (
    <div
      style={{
        width: 180,
        margin: "auto"
      }}
    >
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textSize: "16px",
          pathColor: "#4f46e5",
          textColor: "#111827",
          trailColor: "#e5e7eb"
        })}
      />

      <h5
        className="text-center mt-3"
      >
        {title}
      </h5>
    </div>
  );
}

export default ATSScoreCircle;