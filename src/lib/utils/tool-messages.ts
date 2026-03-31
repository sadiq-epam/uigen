export interface ToolInvocation {
  toolName: string;
  args: any;
  state: "partial-call" | "call" | "result";
  result?: any;
}

export function getToolMessage(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;

  if (toolName === "str_replace_editor") {
    return getStrReplaceMessage(args);
  }

  if (toolName === "file_manager") {
    return getFileManagerMessage(args);
  }

  return toolName;
}

function getStrReplaceMessage(args: any): string {
  const { command, path } = args || {};
  const fileName = getFileName(path);

  switch (command) {
    case "create":
      return `Creating ${fileName}`;
    case "str_replace":
      return `Editing ${fileName}`;
    case "insert":
      return `Inserting into ${fileName}`;
    case "view":
      return `Viewing ${fileName}`;
    case "undo_edit":
      return `Undoing edit in ${fileName}`;
    default:
      return `Editing ${fileName}`;
  }
}

function getFileManagerMessage(args: any): string {
  const { command, path, new_path } = args || {};

  switch (command) {
    case "rename": {
      const oldName = getFileName(path);
      const newName = getFileName(new_path);
      return `Renaming ${oldName} to ${newName}`;
    }
    case "delete": {
      const fileName = getFileName(path);
      return `Deleting ${fileName}`;
    }
    default:
      return "Managing files";
  }
}

export function getFileName(path: string | undefined): string {
  if (!path) return "file";

  const parts = path.split(/[/\\]/);
  const fileName = parts[parts.length - 1];

  return fileName || "file";
}
