import dynamic from "next/dynamic";

const GanttChart = dynamic(() => import("@/components/grannChart"), {
  ssr: false,
});
export default function Home() {
  return (
    <div style={{ marginBottom: "1rem", backgroundColor: "white" }}>
      <h1>Gantt Chart Example</h1>
      <GanttChart />
    </div>
  );
}
