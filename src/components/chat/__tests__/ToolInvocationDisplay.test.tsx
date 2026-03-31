import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

describe("ToolInvocationDisplay", () => {
  describe("str_replace_editor tool", () => {
    it("renders 'Creating Card.jsx' for create command", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "create", path: "/Card.jsx" },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Creating Card.jsx")).toBeDefined();
    });

    it("renders 'Editing App.jsx' for str_replace command", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "str_replace", path: "/App.jsx" },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Editing App.jsx")).toBeDefined();
    });

    it("renders 'Inserting into index.js' for insert command", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "insert", path: "/index.js" },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Inserting into index.js")).toBeDefined();
    });

    it("renders 'Viewing README.md' for view command", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "view", path: "/README.md" },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Viewing README.md")).toBeDefined();
    });
  });

  describe("file_manager tool", () => {
    it("renders 'Renaming old.js to new.js' for rename command", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "file_manager",
            args: {
              command: "rename",
              path: "/old.js",
              new_path: "/new.js",
            },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Renaming old.js to new.js")).toBeDefined();
    });

    it("renders 'Deleting temp.txt' for delete command", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "file_manager",
            args: { command: "delete", path: "/temp.txt" },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Deleting temp.txt")).toBeDefined();
    });
  });

  describe("state indicators", () => {
    it("shows green dot when state is result", () => {
      const { container } = render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "create", path: "/Card.jsx" },
            state: "result",
            result: {},
          }}
        />
      );
      const greenDot = container.querySelector(".bg-emerald-500");
      expect(greenDot).toBeDefined();
    });

    it("shows spinner when state is call", () => {
      const { container } = render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "create", path: "/Test.jsx" },
            state: "call",
          }}
        />
      );
      expect(screen.getByText("Creating Test.jsx")).toBeDefined();
      const svg = container.querySelector("svg.animate-spin");
      expect(svg).toBeDefined();
    });

    it("shows spinner when state is partial-call", () => {
      const { container } = render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "create", path: "/Button.jsx" },
            state: "partial-call",
          }}
        />
      );
      expect(screen.getByText("Creating Button.jsx")).toBeDefined();
      const svg = container.querySelector("svg.animate-spin");
      expect(svg).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("handles missing path gracefully", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "create" },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Creating file")).toBeDefined();
    });

    it("handles unknown tool name", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "unknown_tool",
            args: {},
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("unknown_tool")).toBeDefined();
    });

    it("extracts filename from nested path", () => {
      render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: {
              command: "create",
              path: "/src/components/ui/Button.tsx",
            },
            state: "result",
            result: {},
          }}
        />
      );
      expect(screen.getByText("Creating Button.tsx")).toBeDefined();
    });
  });

  describe("styling", () => {
    it("applies correct classes", () => {
      const { container } = render(
        <ToolInvocationDisplay
          toolInvocation={{
            toolName: "str_replace_editor",
            args: { command: "create", path: "/Style.jsx" },
            state: "result",
            result: {},
          }}
        />
      );
      const badge = container.firstChild as HTMLElement;
      const className = badge.className;
      expect(className).toContain("inline-flex");
      expect(className).toContain("items-center");
      expect(className).toContain("bg-neutral-50");
      expect(className).toContain("rounded-lg");
      expect(className).toContain("text-xs");
      expect(className).toContain("font-mono");
    });
  });
});
