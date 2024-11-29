"use client";
import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import "../app/globals.css";
import { TemplateContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

const GanttChart: React.FC = () => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const [timeScale, setTimeScale] = useState<string>("days");

  const configureTimeScale = () => {
    switch (timeScale) {
      case "hours":
        gantt.config.scales = [
          { unit: "day", step: 1, format: "%d %M" },
          { unit: "hour", step: 1, format: "%H:%i" },
        ];
        break;
      case "minutes-10":
        gantt.config.scales = [
          { unit: "day", step: 1, format: "%d %M" },
          { unit: "hour", step: 1, format: "%H:%i" },
          { unit: "minute", step: 10, format: "%H:%i" },
        ];
        break;
      case "minutes-15":
        gantt.config.scales = [
          { unit: "day", step: 1, format: "%d %M" },
          { unit: "hour", step: 1, format: "%H:%i" },
          { unit: "minute", step: 15, format: "%H:%i" },
        ];
        break;
      default: // days
        gantt.config.scales = [
          { unit: "month", step: 1, format: "%F %Y" },
          { unit: "day", step: 1, format: "%d %M" },
        ];
        break;
    }
    gantt.render();
  };

  useEffect(() => {
    if (ganttContainer.current) {
      gantt.config.date_format = "%Y-%m-%d %H:%i";
      gantt.config.open_tree_initially = true;

      gantt.config.columns = [
        { name: "text", label: "Task Name", tree: true, width: 200 },
        {
          name: "start_date",
          label: "Start Date & Time",
          align: "center",
          width: 150,
          template: (task) => {
            const format = gantt.date.date_to_str("%Y-%m-%d %H:%i");
            return format(task.start_date);
          },
        },
        { name: "duration", label: "Duration", align: "center", width: 80 },
        {
          name: "end_date",
          label: "End Date & Time",
          align: "center",
          width: 150,
          template: (task) => {
            const format = gantt.date.date_to_str("%Y-%m-%d %H:%i");
            const end_date = gantt.calculateEndDate(
              task.start_date,
              task.duration,
              gantt.config.work_time
            );
            return format(end_date);
          },
        },
        { name: "add", label: "", width: 44 },
      ];

      gantt.templates.task_class = (start, end, task) => {
        return `gantt-color-${task.id}`;
      };

      gantt.init(ganttContainer.current);
      gantt.parse({
        data: [
          // Main task
          {
            id: 1,
            text: "Main Task #1",
            start_date: "2023-11-26 09:00",
            duration: 3,
            progress: 0.6,
          },
          // Subtasks for Main Task #1
          {
            id: 2,
            text: "Subtask #1.1",
            start_date: "2023-11-26 10:00",
            duration: 1,
            progress: 0.8,
            parent: 1,
          },
          {
            id: 3,
            text: "Subtask #1.2",
            start_date: "2023-11-26 11:00",
            duration: 2,
            progress: 0.5,
            parent: 1,
          },
          // Another main task
          {
            id: 4,
            text: "Main Task #2",
            start_date: "2023-11-27 00:00",
            duration: 4,
            progress: 0.4,
          },
          // Subtasks for Main Task #2
          {
            id: 5,
            text: "Subtask #2.1",
            start_date: "2023-11-27 01:00",
            duration: 2,
            progress: 0.7,
            parent: 4,
          },
          {
            id: 6,
            text: "Subtask #2.2",
            start_date: "2023-11-27 03:00",
            duration: 1,
            progress: 0.9,
            parent: 4,
          },
        ],
      });
    }
    return () => {
      gantt.clearAll();
    };
  }, []);

  useEffect(() => {
    configureTimeScale();
  }, [timeScale]);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="timeScale">Time Scale: </label>
        <select
          id="timeScale"
          value={timeScale}
          onChange={(e) => setTimeScale(e.target.value)}
        >
          <option value="days">Days</option>
          <option value="hours">Hours</option>
          <option value="minutes-10">10 Minutes</option>
          <option value="minutes-15">15 Minutes</option>
        </select>
      </div>
      <div ref={ganttContainer} className="h-[1000px] w-[100%]" />
    </div>
  );
};

export default GanttChart;
