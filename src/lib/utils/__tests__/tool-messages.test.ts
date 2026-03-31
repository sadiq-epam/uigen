import { describe, it, expect } from "vitest";
import {
  getToolMessage,
  getFileName,
  type ToolInvocation,
} from "../tool-messages";

describe("getFileName", () => {
  it("extracts filename from Unix path", () => {
    expect(getFileName("/components/Card.jsx")).toBe("Card.jsx");
  });

  it("extracts filename from Windows path", () => {
    expect(getFileName("C:\\components\\Card.jsx")).toBe("Card.jsx");
  });

  it("extracts filename from nested path", () => {
    expect(getFileName("/src/components/ui/Button.tsx")).toBe("Button.tsx");
  });

  it("handles root level file", () => {
    expect(getFileName("/App.jsx")).toBe("App.jsx");
  });

  it("handles path without leading slash", () => {
    expect(getFileName("components/Card.jsx")).toBe("Card.jsx");
  });

  it("returns 'file' for undefined path", () => {
    expect(getFileName(undefined)).toBe("file");
  });

  it("returns 'file' for empty string", () => {
    expect(getFileName("")).toBe("file");
  });

  it("handles path ending with slash", () => {
    expect(getFileName("/components/")).toBe("file");
  });
});

describe("getToolMessage", () => {
  describe("str_replace_editor tool", () => {
    it("returns 'Creating Card.jsx' for create command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "create", path: "/Card.jsx" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Creating Card.jsx");
    });

    it("returns 'Editing App.jsx' for str_replace command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/App.jsx" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Editing App.jsx");
    });

    it("returns 'Inserting into index.js' for insert command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/index.js" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Inserting into index.js");
    });

    it("returns 'Viewing README.md' for view command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "view", path: "/README.md" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Viewing README.md");
    });

    it("returns 'Undoing edit in utils.ts' for undo_edit command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "undo_edit", path: "/lib/utils.ts" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Undoing edit in utils.ts");
    });

    it("handles missing path", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "create" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Creating file");
    });

    it("handles unknown command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "unknown", path: "/test.js" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Editing test.js");
    });

    it("handles missing args", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        args: undefined,
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Editing file");
    });
  });

  describe("file_manager tool", () => {
    it("returns 'Renaming old.js to new.js' for rename command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        args: {
          command: "rename",
          path: "/old.js",
          new_path: "/new.js",
        },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Renaming old.js to new.js");
    });

    it("returns 'Deleting temp.txt' for delete command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        args: { command: "delete", path: "/temp.txt" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Deleting temp.txt");
    });

    it("handles unknown file_manager command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        args: { command: "unknown" },
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Managing files");
    });

    it("handles missing args", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        args: undefined,
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("Managing files");
    });
  });

  describe("unknown tool", () => {
    it("returns tool name for unknown tool", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "unknown_tool",
        args: {},
        state: "result",
      };
      expect(getToolMessage(toolInvocation)).toBe("unknown_tool");
    });
  });
});
