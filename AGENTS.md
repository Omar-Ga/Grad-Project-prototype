# Agent Rules

## Architecture
- Always choose modular architecture over monolithic architecture.
- Prefer splitting backend logic into focused modules such as routers, services, repositories, schemas, configuration, and database layers.
- Avoid placing multiple responsibilities in a single file.
- Keep entrypoint files thin and delegate domain logic to modules.
