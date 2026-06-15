import { useState } from "react";

function CandidateRanking() {
  const [candidates] = useState([
    {
      id: 1,
      name: "Tejaswi",
      email: "teju@gmail.com",
      atsScore: 95,
      status: "Shortlisted"
    },
    {
      id: 2,
      name: "Rahul",
      email: "rahul@gmail.com",
      atsScore: 88,
      status: "Review"
    },
    {
      id: 3,
      name: "Anjali",
      email: "anjali@gmail.com",
      atsScore: 75,
      status: "Review"
    },
    {
      id: 4,
      name: "Kiran",
      email: "kiran@gmail.com",
      atsScore: 62,
      status: "Rejected"
    }
  ]);

  return (
    <div className="container py-5">
      <div className="card shadow border-0">

        <div className="card-body">

          <h2 className="mb-4">
            ATS Candidate Ranking
          </h2>

          <table className="table table-hover">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Email</th>
                <th>ATS Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {candidates
                .sort(
                  (a, b) =>
                    b.atsScore - a.atsScore
                )
                .map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>#{index + 1}</td>

                    <td>
                      {candidate.name}
                    </td>

                    <td>
                      {candidate.email}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          candidate.atsScore >= 85
                            ? "bg-success"
                            : candidate.atsScore >= 70
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                      >
                        {candidate.atsScore}%
                      </span>
                    </td>

                    <td>
                      {candidate.status}
                    </td>
                  </tr>
                ))}

            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
}

export default CandidateRanking;