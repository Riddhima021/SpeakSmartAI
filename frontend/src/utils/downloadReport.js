import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadReport = (interview) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SpeakSmart AI Interview Report", 14, 20);

  doc.setFontSize(12);

  doc.text(`Company: ${interview.company}`, 14, 35);
  doc.text(`Role: ${interview.role}`, 14, 45);
  doc.text(`Type: ${interview.type}`, 14, 55);
  doc.text(`Difficulty: ${interview.difficulty}`, 14, 65);
  doc.text(`Overall Score: ${interview.overallScore}%`, 14, 75);

  autoTable(doc, {
    startY: 90,
    head: [["Question", "Score", "Feedback"]],
    body: interview.questions.map((q) => [
      q.question,
      `${q.score}/10`,
      q.feedback,
    ]),
  });

  doc.save("Interview_Report.pdf");
};

export default downloadReport;