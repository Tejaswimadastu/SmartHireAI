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
        width: 150,
        margin: "auto"
      }}
    >
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textSize: "18px",
          pathColor: "var(--primary)",
          textColor: "var(--text-main)",
          trailColor: "var(--card-border)"
        })}
      />

      <h6
        className="text-center mt-3 fw-bold"
        style={{ color: "var(--text-main)" }}
      >
        {title}
      </h6>
    </div>
  );
}

export default ATSScoreCircle;
