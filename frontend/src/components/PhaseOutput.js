const PhaseOutput = ({ title, data }) => (
  <div style={{ marginBottom: "1rem" }}>
    <h3>{title}</h3>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

export default PhaseOutput;
