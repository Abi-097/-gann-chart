"use client";
import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import "../app/globals.css";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { createRoot } from "react-dom/client";
// import Image from "next/image";
import { Input } from "./ui/input";
interface Task {
  id: number | string;
  text: string;
  start_date: string;
  duration: number;
  progress: number;
  parent?: number | string;
}

const GanttChart: React.FC = () => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const [timeScale, setTimeScale] = useState<string>("days");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const configureTimeScale = () => {
    gantt.config.scale_height = 75;
    // gantt.config.min_column_width = 50;

    switch (timeScale) {
      case "minutes-5":
        gantt.config.scales = [
          { unit: "day", step: 1, format: "%d %M" },
          { unit: "hour", step: 1, format: "%H:%i" },
          { unit: "minute", step: 5, format: "%H:%i" },
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
      case "minutes-30":
        gantt.config.scales = [
          { unit: "day", step: 1, format: "%d %M" },
          { unit: "hour", step: 1, format: "%H:%i" },
          { unit: "minute", step: 30, format: "%H:%i" },
        ];
        break;
      case "hours":
        gantt.config.scales = [
          { unit: "day", step: 1, format: "%d %M" },
          { unit: "hour", step: 1, format: "%H:%i" },
        ];
        break;
      case "month":
        gantt.config.scales = [
          { unit: "year", step: 1, format: "%Y" },
          { unit: "month", step: 1, format: "%F" },
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

  const toggleReadOnly = (readOnly: boolean) => {
    gantt.config.readonly = readOnly;
    gantt.render(); // Re-render the chart to apply the setting
  };

  useEffect(() => {
    toggleReadOnly(isReadOnly);
  }, [isReadOnly]);

  useEffect(() => {
    if (ganttContainer.current) {
      gantt.config.date_format = "%Y-%m-%d %H:%i";
      gantt.config.open_tree_initially = true;
      gantt.config.duration_unit = "minute";
      gantt.config.tooltip = true;

      gantt.plugins({
        tooltip: true,
      });

      // Configure tooltip template
      gantt.templates.tooltip_text = (start: Date, end: Date, task: Task) => {
        const formatDuration = (duration: number): string => {
          const days = Math.floor(duration / 1440); // Total minutes in a day
          const hours = Math.floor((duration % 1440) / 60);
          const minutes = Math.floor(duration % 60);
          const seconds = Math.floor((duration * 60) % 60);

          const parts = [];
          if (days > 0) parts.push(`${days} Day${days > 1 ? "s" : ""}`);
          if (hours > 0) parts.push(`${hours} Hour${hours > 1 ? "s" : ""}`);
          if (minutes > 0)
            parts.push(`${minutes} Minute${minutes > 1 ? "s" : ""}`);
          if (seconds > 0)
            parts.push(`${seconds} Second${seconds > 1 ? "s" : ""}`);
          return parts.join(", ");
        };

        const formatCustomDate = (dateString: string): string => {
          const date = new Date(dateString);

          const options = {
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          } as const;
          const day = date.getDate();
          const ordinalSuffix = (day: number) => {
            if (day > 3 && day < 21) return "th";
            switch (day % 10) {
              case 1:
                return "st";
              case 2:
                return "nd";
              case 3:
                return "rd";
              default:
                return "th";
            }
          };

          return `${date.toLocaleString("en-US", {
            month: "short",
          })} ${day}${ordinalSuffix(day)}, ${date.getFullYear()} ${
            date.toLocaleString("en-US", options).split(", ")[1]
          }`;
        };

        // <b style="color: #ff5722;">Task:</b> <b style="color: black;">${
        //   task.text
        // }</b><br/>
        return `
          <div>
           
            <b style="color: #03a9f4;">Start Date & Time:</b>  <b style="color: black;">${formatCustomDate(
              task.start_date
            )} </b><br/>
            <b style="color: #4caf50;">End Date & Time:</b>  <b style="color: black;">${formatCustomDate(
              gantt.calculateEndDate(task.start_date, task.duration)
            )} </b><br/>
            <b style="color: #9c27b0;">Duration:</b>  <b style="color: black;">${formatDuration(
              task.duration
            )}</b><br/>
             <b style="color: #9c27b0;">Status:</b>  <b style="color: black;"> Pending </b>
          </div>
        `;
      };

      const formatCustomDate = (dateString: string): string => {
        const date = new Date(dateString);

        const options = {
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        } as const;
        const day = date.getDate();
        const ordinalSuffix = (day: number) => {
          if (day > 3 && day < 21) return "th";
          switch (day % 10) {
            case 1:
              return "st";
            case 2:
              return "nd";
            case 3:
              return "rd";
            default:
              return "th";
          }
        };

        return `${date.toLocaleString("en-US", {
          month: "short",
        })} ${day}${ordinalSuffix(day)}, ${date.getFullYear()} ${
          date.toLocaleString("en-US", options).split(", ")[1]
        }`;
      };

      gantt.config.columns = [
        { name: "text", label: "Task Name", tree: true, width: 200 },
        // {
        //   name: "start_date",
        //   label: "Start Date & Time",
        //   align: "center",
        //   width: 250,

        //   template: (task: Task) => formatCustomDate(task.start_date),
        // },
        // {
        //   name: "duration",
        //   label: "Duration",
        //   align: "center",
        //   width: 150,
        //   // template: (task: Task) => `${task.duration} min`,
        //   template: (task: Task) => {
        //     const days = Math.floor(task.duration / 1440);
        //     const hours = Math.floor((task.duration % 1440) / 60);
        //     const minutes = task.duration % 60;
        //     const seconds = Math.floor((task.duration * 60) % 60);
        //     // Build human-readable format
        //     const parts = [];
        //     if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
        //     if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
        //     if (minutes > 0)
        //       parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
        //     if (seconds > 0)
        //       parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
        //     return parts.join(", ");
        //   },
        // },
        // {
        //   name: "end_date",
        //   label: "End Date & Time",
        //   align: "center",
        //   width: 250,
        //   template: (task: Task) => {
        //     const endDate = gantt.calculateEndDate(
        //       task.start_date,
        //       task.duration,
        //       gantt.config.work_time
        //     );
        //     return formatCustomDate(endDate);
        //   },
        // },
      ];

      gantt.templates.task_class = (start: Date, end: Date, task: Task) => {
        return `gantt-color-${task.id}`;
      };

      gantt.init(ganttContainer.current);
      gantt.parse({
        data: [
          {
            id: 1,
            text: "Job Package",
            start_date: "2023-11-26 09:00",
            duration: 3 * 1440,
            progress: 0.4,
          },
          {
            id: 2,
            text: "Job",
            start_date: "2023-11-26 09:00",
            duration: 3 * 700, // 3 days
            progress: 0.6,
            parent: 1, // Belongs to Work Space
          },
          {
            id: 5,
            text: "Workflow",
            start_date: "2023-11-26 10:30",
            duration: 220, // 12 hours
            progress: 0.8,
            parent: 2, // Belongs to Job
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

  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();

    gantt.eachTask((task: Task) => {
      const taskNode = gantt.getTaskNode(task.id);
      const rowNode = document.querySelector(
        `.gantt_row[task_id='${task.id}']`
      ) as HTMLElement;

      const isMatch = task.text.toLowerCase().includes(lowercasedSearchTerm);

      if (taskNode) {
        taskNode.style.display = isMatch ? "" : "none";
      }

      if (rowNode) {
        rowNode.style.display = isMatch ? "" : "none";
      }
    });
  };

  return (
    <div>
      <div
        style={{ marginBottom: "1rem" }}
        className="flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <Input
            className="w-15"
            type="text"
            placeholder="Search Task Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <Input type="text" placeholder="Select Folder" className="w-15" />
        <Input type="text" placeholder="Select Job" className="w-15" />

        <select
          onChange={(e) => setIsReadOnly(e.target.value === "readonly")}
          defaultValue="editable"
          className="p-1 border rounded"
        >
          <option value="editable">Editable</option>
          <option value="readonly">Read Only</option>
        </select>
        <span>
          <label>Time Scale: </label>
          <select
            className="p-1 border rounded"
            id="timeScale"
            value={timeScale}
            onChange={(e) => setTimeScale(e.target.value)}
          >
            <option value="minutes-5">5 Minutes</option>
            <option value="minutes-10">10 Minutes</option>
            <option value="minutes-15">15 Minutes</option>
            <option value="minutes-30">30 Minutes</option>{" "}
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="month">1 Month</option>
          </select>
        </span>
      </div>
      <div ref={ganttContainer} className="h-[1000px] w-[100%]" />
    </div>
  );
};

export default GanttChart;
