import type { Scenario } from "@/lib/lessons";

export default function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="scenario-card">
      <div className="scenario-head">
        <span className="scenario-emoji" aria-hidden="true">{scenario.emoji}</span>
        <h2>{scenario.title}</h2>
      </div>

      <p className="scenario-role">{scenario.role}</p>

      <h3 className="scenario-label">You want to</h3>
      <ul>
        {scenario.wants.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <h3 className="scenario-label">Good to know</h3>
      <ul>
        {scenario.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}