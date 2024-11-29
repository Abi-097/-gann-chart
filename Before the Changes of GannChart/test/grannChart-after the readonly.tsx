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
        {
          name: "start_date",
          label: "Start Date & Time",
          align: "center",
          width: 250,

          template: (task: Task) => formatCustomDate(task.start_date),
        },
        {
          name: "duration",
          label: "Duration",
          align: "center",
          width: 150,
          // template: (task: Task) => `${task.duration} min`,
          template: (task: Task) => {
            const days = Math.floor(task.duration / 1440);
            const hours = Math.floor((task.duration % 1440) / 60);
            const minutes = task.duration % 60;

            // Build human-readable format
            const parts = [];
            if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
            if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
            if (minutes > 0)
              parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

            return parts.join(", ");
          },
        },
        {
          name: "end_date",
          label: "End Date & Time",
          align: "center",
          width: 250,
          // template: (task: Task) => {
          //   const format = gantt.date.date_to_str("%Y-%m-%d %H:%i");
          //   const end_date = gantt.calculateEndDate(
          //     task.start_date,
          //     task.duration,
          //     gantt.config.work_time
          //   );
          //   return format(end_date);
          // },
          template: (task: Task) => {
            const endDate = gantt.calculateEndDate(
              task.start_date,
              task.duration,
              gantt.config.work_time
            );
            return formatCustomDate(endDate);
          },
        },
        // { name: "add", label: "", width: 44 },
        {
          name: "avatar",
          label: "User",
          align: "center",
          width: 100,
          template: (task: Task) =>
            `<div class="gantt-avatar flex items-center justify-center" data-id="${task.id}">
              <img src="https://github.com/shadcn.png" alt="@shadcn" class="avatar-image rounded-full w-7 h-7 mt-1" />
               
            </div>`,
        },
      ];

      gantt.templates.task_class = (start: Date, end: Date, task: Task) => {
        return `gantt-color-${task.id}`;
      };

      gantt.init(ganttContainer.current);
      gantt.parse({
        data: [
          {
            id: 1,
            text: "Work Space",
            start_date: "2023-11-26 09:00",
            duration: 5 * 1420, // 5 days
            progress: 0.4,
          },
          {
            id: 2,
            text: "Folder",
            start_date: "2023-11-27 10:00",
            duration: 3 * 1440, // 3 days
            progress: 0.6,
            parent: 1, // Belongs to Work Space
          },
          {
            id: 3,
            text: "Job Package",
            start_date: "2023-11-28 11:00",
            duration: 2 * 1440, // 2 days
            progress: 0.7,
            parent: 2, // Belongs to Folder
          },
          {
            id: 4,
            text: "Job",
            start_date: "2023-11-29 08:00",
            duration: 1 * 1440, // 1 day
            progress: 0.5,
            parent: 3, // Belongs to Job Package
          },
          {
            id: 5,
            text: "Workflow",
            start_date: "2023-11-29 12:00",
            duration: 720, // 12 hours
            progress: 0.8,
            parent: 4, // Belongs to Job
          },
          {
            id: 6,
            text: "Nodes",
            start_date: "2023-11-29 14:00",
            duration: 180, // 3 hours
            progress: 0.9,
            parent: 5, // Belongs to Workflow
          },
        ],
      });
      // // Inject React components after Gantt initialization
      // const injectAvatars = () => {
      //   const avatars = document.querySelectorAll(".gantt-avatar");
      //   avatars.forEach((avatar) => {
      //     const id = avatar.getAttribute("data-id");
      //     if (id && !avatar.hasChildNodes()) {
      //       const container = document.createElement("div");
      //       avatar.appendChild(container);

      //       const root = createRoot(container); // Create a root
      //       root.render(
      //         <Avatar className="h-12 w-12 rounded-full overflow-hidden">
      //           <AvatarFallback className="h-full w-full rounded-full text-sm flex items-center justify-center">
      //             CN
      //           </AvatarFallback>
      //         </Avatar>
      //       );
      //     }
      //   });
      // };

      // injectAvatars();
      // gantt.attachEvent("onAfterTaskUpdate", injectAvatars);
      // gantt.attachEvent("onParse", injectAvatars);
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
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search Task Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
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
