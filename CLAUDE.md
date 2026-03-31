# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI to generate React components in a virtual file system and renders them in real-time using an iframe-based preview system.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma (SQLite), Anthropic Claude AI, Vercel AI SDK

## Development Commands

```bash
# Initial setup (install deps + Prisma generate + migrations)
npm run setup

# Start development server with Turbopack
npm run dev

# Run all tests with Vitest
npm test

# Run linting
npm run lint

# Build for production
npm run build

# Reset database (destructive)
npm run db:reset
```

## Architecture

### Virtual File System

The core of UIGen is a virtual file system (`src/lib/file-system.ts`) that operates entirely in memory:

- **VirtualFileSystem class**: Map-based in-memory file storage with full CRUD operations
- **Serialization**: Files are serialized to/from JSON for database persistence
- **Path normalization**: All paths start with '/', no trailing slashes except root
- **Auto-parent creation**: Creating files automatically creates parent directories
- Files are NOT written to disk during generation - everything stays in memory until explicitly saved

The virtual FS is managed through React Context (`src/lib/contexts/file-system-context.tsx`) and synced with the chat API.

### AI Integration

**Chat API** (`src/app/api/chat/route.ts`):
- Uses Vercel AI SDK's `streamText` with Anthropic provider
- System prompt cached using `cacheControl: { type: "ephemeral" }`
- Provides two custom tools to the AI model:
  - `str_replace_editor`: File editing (view, create, str_replace, insert)
  - `file_manager`: File management (rename, delete)
- On completion, saves messages and file state to Prisma database for authenticated users
- Falls back to mock provider if no `ANTHROPIC_API_KEY` is set

**Generation Rules** (from `src/lib/prompts/generation.tsx`):
- Every project MUST have a root `/App.jsx` file as the entry point
- Use Tailwind CSS for styling, not inline styles
- No HTML files are created - App.jsx is the entry point
- All local imports use `@/` alias (e.g., `import Foo from '@/components/Foo'`)
- Operating on virtual FS root `/`, not a real filesystem

### Preview System

**PreviewFrame** (`src/components/preview/PreviewFrame.tsx`):
- Renders generated React components in a sandboxed iframe using `srcdoc`
- Uses Babel Standalone (`@babel/standalone`) to transform JSX on the fly
- Creates ES module import maps with blob URLs for in-memory modules
- Automatically detects entry points: `/App.jsx`, `/index.jsx`, or first `.jsx/.tsx` file
- Sandboxed with `allow-scripts allow-same-origin allow-forms`

**JSX Transformer** (`src/lib/transform/jsx-transformer.ts`):
- Transforms JSX/TSX files to ES modules using Babel
- Generates import maps for browser-native ES module loading
- Handles Tailwind CSS by injecting CDN script into preview HTML

### Database Schema

The database schema is defined in `prisma/schema.prisma`. Reference this file anytime you need to understand the structure of data stored in the database.

**Prisma models**:
- `User`: email/password authentication (bcrypt hashed)
- `Project`: Stores chat messages and file system state as JSON strings
  - `messages`: Serialized conversation history
  - `data`: Serialized virtual file system
  - `userId` is optional (supports anonymous projects)

### Testing

- **Framework**: Vitest with jsdom environment
- **Location**: Tests in `__tests__` directories co-located with source files
- **React Testing**: Uses `@testing-library/react` and `@testing-library/user-event`
- **Run single test**: `npm test -- <path-to-test-file>`
- **Watch mode**: `npm test -- --watch`

### Authentication

**Auth system** (`src/lib/auth.ts`):
- JWT-based sessions using `jose` library
- Signed cookies with 7-day expiration
- `getSession()`: Server-side session retrieval
- `setSession()`: Creates signed session cookie
- Anonymous users can generate components without signing in

### Important File Locations

- **API routes**: `src/app/api/chat/route.ts` (main chat endpoint)
- **Actions**: `src/actions/` (server actions for project CRUD)
- **Components**: `src/components/` organized by feature (auth, chat, editor, preview, ui)
- **Contexts**: `src/lib/contexts/` (FileSystemContext, ChatContext)
- **Tools**: `src/lib/tools/` (AI tool definitions for file operations)
- **Utilities**: `src/lib/` (file-system, prisma client, auth, etc.)

## Key Constraints

1. **No real filesystem writes**: All generated files exist only in VirtualFileSystem until explicitly exported
2. **App.jsx is required**: The preview system expects `/App.jsx` as the root component
3. **Import alias**: All local imports in generated code must use `@/` prefix
4. **No HTML files**: The generated app is pure React - no index.html needed
5. **Tailwind only**: Style with Tailwind utility classes, not inline styles or CSS files
6. **Node compatibility**: Uses `node-compat.cjs` to polyfill Node.js APIs for Next.js

## Code Style

- **Use comments sparingly**: Only comment complex code. Let the code be self-documenting where possible.
