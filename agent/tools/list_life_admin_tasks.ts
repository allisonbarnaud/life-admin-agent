import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * App-runtime tool (not sandbox). Demonstrates a typed Eve tool the model can call.
 * Replace the stub data with your real task store later.
 */
export default defineTool({
  description:
    "List demo life-admin tasks for a category (inbox, bills, errands, health). These are sample items, not the user's real data.",
  inputSchema: z.object({
    category: z
      .enum(["inbox", "bills", "errands", "health", "all"])
      .default("all")
      .describe("Which task bucket to list"),
  }),
  async execute({ category }) {
    const tasks = [
      { id: "t1", category: "bills", title: "Pay electricity", due: "Friday" },
      { id: "t2", category: "errands", title: "Pick up dry cleaning", due: "Today" },
      { id: "t3", category: "health", title: "Book dentist checkup", due: "This month" },
      { id: "t4", category: "inbox", title: "Reply to landlord email", due: "Tomorrow" },
    ];

    const filtered =
      category === "all"
        ? tasks
        : tasks.filter((task) => task.category === category);

    return {
      layer: "eve-tool",
      category,
      count: filtered.length,
      tasks: filtered,
    };
  },
});
