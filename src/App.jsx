import React, { useState } from "react";

function gradeFromAverage(avg) {
  if (avg >= 90) return "A+";
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "F";
}

export default function App() {
  const initialMarks = { math: "", sci: "", eng: "", social: "", lan: "" };
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [marks, setMarks] = useState(initialMarks);
  const [result, setResult] = useState(null);
  const subjects = [
    { key: "math", label: "Maths" },
    { key: "sci", label: "Science" },
    { key: "eng", label: "English" },
    { key: "social", label: "Social" },
    { key: "lan", label: "Language" },
  ];

  function handleChange(e, key) {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setMarks(prev => ({ ...prev, [key]: value }));
    }
  }

  function calculate(e) {
    e.preventDefault();
    const numeric = subjects.map(s => Number(marks[s.key] || 0));
    const total = numeric.reduce((a,b) => a+b, 0);
    const average = +(total / numeric.length).toFixed(2);
    const grade = gradeFromAverage(average);
    const failedSubjects = numeric.map((m,i)=> ({sub: subjects[i].label, marks: m})).filter(x => x.marks < 33);
    const pass = failedSubjects.length === 0 && average >= 40;
    const details = subjects.map((s, i) => ({subject: s.label, marks: numeric[i]}));
    const res = { name, class: className, total, average, grade, pass, details, date: new Date().toLocaleString() };
    setResult(res);
  }

  function resetForm() {
    setName("");
    setClassName("");
    setMarks(initialMarks);
    setResult(null);
  }

  function downloadReport() {
    if (!result) return;
    const content = `Student Result\n\nName: ${result.name}\nClass: ${result.class}\nDate: ${result.date}\n\n` +
      result.details.map(d => `${d.subject}: ${d.marks}`).join("\n") +
      `\n\nTotal: ${result.total}\nAverage: ${result.average}\nGrade: ${result.grade}\nStatus: ${result.pass ? "PASS" : "FAIL"}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.name || "student"}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <h1>Student Result App</h1>
      <form className="card" onSubmit={calculate}>
        <div className="row">
          <label>Student Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. John Doe" />
        </div>
        <div className="row">
          <label>Class / Grade</label>
          <input value={className} onChange={e=>setClassName(e.target.value)} placeholder="e.g. 10A" />
        </div>

        <h3>Marks (0-100)</h3>
        {subjects.map(s => (
          <div className="row" key={s.key}>
            <label>{s.label}</label>
            <input value={marks[s.key]} onChange={e=>handleChange(e, s.key)} placeholder="0" />
          </div>
        ))}

        <div className="actions">
          <button type="submit">Calculate Result</button>
          <button type="button" onClick={resetForm}>Reset</button>
        </div>
      </form>

      {result && (
        <div className="card result">
          <h2>Result</h2>
          <p><strong>Name:</strong> {result.name || "-"}</p>
          <p><strong>Class:</strong> {result.class || "-"}</p>
          <p><strong>Date:</strong> {result.date}</p>
          <table className="result-table">
            <thead><tr><th>Subject</th><th>Marks</th></tr></thead>
            <tbody>
              {result.details.map(d => <tr key={d.subject}><td>{d.subject}</td><td>{d.marks}</td></tr>)}
            </tbody>
          </table>
          <p><strong>Total:</strong> {result.total}</p>
          <p><strong>Average:</strong> {result.average}</p>
          <p><strong>Grade:</strong> {result.grade}</p>
          <p><strong>Status:</strong> {result.pass ? "PASS" : "FAIL"}</p>
          <div className="actions">
            <button onClick={()=>window.print()}>Print</button>
            <button onClick={downloadReport}>Download Report</button>
          </div>
        </div>
      )}

      <footer className="card small">
        <p>Made for quick deployment. To run locally: <code>npm install</code> then <code>npm run dev</code>.</p>
      </footer>
    </div>
  );
}
