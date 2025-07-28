# ClickUp Integration for Flows

A comprehensive ClickUp integration that brings the full power of ClickUp's project management capabilities to your Flows workflows. Manage tasks, projects, teams, and more with easy-to-use blocks.

## Features

### Task Management

- Create, update, and delete tasks with rich configuration options
- Advanced task features: priorities, due dates, time tracking, custom fields
- Subtask support with parent-child relationships
- Task filtering with powerful search and sort capabilities

### Project Organization

- Spaces: Top-level organizational units for your teams
- Folders: Group related lists and maintain project structure
- Lists: Task containers with customizable workflows
- Views: Custom perspectives on your data with filtering and grouping

### Team Collaboration

- User management: Invite, edit, and manage team members
- Guest access: Controlled access for external collaborators
- Comments: Rich threaded discussions on tasks and projects
- @mentions and notifications to keep everyone in the loop

### Time & Goal Tracking

- Time entries: Track work with start/stop timers and manual entries
- Goals & Key Results: OKR support for strategic planning
- Progress tracking with visual indicators and reporting

### Advanced Features

- Custom fields: Extend tasks with your own data structures
- Tags: Flexible labeling and categorization system
- Templates: Accelerate project setup with reusable structures
- Webhooks: Real-time event processing and automation

### Real-time Synchronization

- Live updates through ClickUp webhooks
- Event subscriptions for tasks, lists, spaces, goals, and more
- Automatic sync keeps your Flows workflows current

## Quick Start

### 1. Create ClickUp OAuth App

1. Go to [ClickUp App Settings](https://app.clickup.com/settings/apps)
2. Click "Create an App"
3. Fill in your app details:
   - App Name: Your Flows ClickUp Integration
   - Description: Integration for Flows workflows
   - Redirect URL: `[YOUR_APP_URL]/auth/callback`

### 2. Configure the Integration

1. Install this ClickUp app in your Flows workspace
2. Enter your Client ID and Client Secret from step 1
3. Click Sync to initialize the connection

### 3. Authorize Access

1. Click the authorization link that appears
2. Grant permissions to your ClickUp workspace
3. You'll be redirected back - the app status should show Ready

### 4. Start Building

Drag ClickUp blocks into your flows and start automating your project management!

## Available Blocks

### Task Management (5 blocks)

- Create Task: Create new tasks with full configuration
- Update Task: Modify existing tasks and their properties
- Get Task: Retrieve detailed task information
- List Tasks: Search and filter tasks with advanced queries
- Delete Task: Remove tasks from your workspace

### Project Structure (15 blocks)

- Spaces: Create, update, delete, list, and get space details
- Folders: Full CRUD operations for project folders
- Lists: Manage task lists with custom configurations
- Views: Create custom views with filtering and grouping
- Templates: Use templates to accelerate project setup

### Team Management (10 blocks)

- User Operations: Get, edit, invite, and remove users
- Guest Management: Add and manage external collaborators
- Workspace Info: Get authorized user and workspace details
- Member Lists: Get task and list members

### Communication (6 blocks)

- Comments: Create, update, delete, and list comments
- Threaded Replies: Support for comment conversations
- Rich Text: Full formatting support in comments

### Time & Goals (11 blocks)

- Time Tracking: Create, update, delete time entries
- Timer Controls: Start and stop active timers
- Goals: Create and manage strategic objectives
- Key Results: Track progress on goal outcomes

### Advanced Features (15+ blocks)

- Custom Fields: Get and set custom field values
- Tags: Create, update, delete, and manage tags
- Checklists: Task checklists with item management
- Webhooks: Manage real-time event subscriptions
- Event Subscriptions: Listen for ClickUp events in your flows

## Technical Details

### Architecture

- TypeScript-first with full type safety
- Auto-generated schemas from ClickUp's OpenAPI specification
- Intelligent type handling - simple types for basic fields, complex schemas for advanced features
- Comprehensive error handling with user-friendly messages

### Security

- OAuth 2.0 authentication flow
- Webhook signature verification for secure event processing
- Sensitive data protection with encrypted storage
- Scoped permissions following principle of least privilege

### Performance

- Efficient API usage with smart request batching
- Real-time updates through webhook subscriptions
- Optimized schemas reduce payload sizes
- Caching strategies for improved response times

## Contributing

### Development Setup

```bash
# Install dependencies
npm install

# Generate schemas from OpenAPI spec
npm run generate-schema

# Validate generated schemas
npm run validate-schema

# Type check everything
npx tsc --noEmit
```

### Schema Generation

The app uses an intelligent schema generation system:

```bash
# Regenerate all input/output schemas
npm run generate-schema
```

This automatically:

- Extracts schemas from ClickUp's OpenAPI specification
- Converts to TypeScript-compatible formats
- Adds meaningful descriptions for all fields
- Filters out team_id for security
- Organizes fields (required first, then optional)
- Uses simple types where possible, complex types when needed

### File Structure

```text
clickup/
├── actions/           # All ClickUp action blocks
│   ├── tasks/         # Task management blocks
│   ├── lists/         # List management blocks
│   ├── spaces/        # Space management blocks
│   ├── teamManagement/ # User & team blocks
│   ├── timeTracking/   # Time tracking blocks
│   ├── goals/         # Goals & objectives blocks
│   └── ... (and more)
├── subscriptions/     # Webhook event handlers
├── utils/            # Shared utilities
├── scripts/          # Development tools
└── security.ts       # Webhook verification
```

## Documentation

### Core Concepts

- Workspaces: Top-level ClickUp organizations (teams)
- Hierarchical Structure: Space → Folder → List → Task
- Custom Fields: Extend any object with custom data
- Webhooks: Real-time event notifications

### Best Practices

- Use webhooks for real-time synchronization
- Leverage custom fields for workflow-specific data
- Use tags for flexible categorization
- Implement time tracking for accurate project insights
- Set up Goals and Key Results for strategic alignment

### Troubleshooting

- Authorization Issues: Ensure redirect URL matches exactly
- Webhook Problems: Check webhook secret configuration
- Permission Errors: Verify OAuth scopes include required permissions
- Rate Limits: ClickUp enforces API rate limits - implement backoff strategies

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
