# Composio LinkedIn MCP — Setup Guide

## Overview

8th MCP integration for the ONLYMORE Command Center. Uses [Composio](https://composio.dev) to publish on 4 LinkedIn pages directly from Claude Code, with automatic OAuth token management.

## Prerequisites

- Claude Code CLI installed
- Composio account (free tier works)
- LinkedIn account with admin access to the 4 pages

## Quick Setup

### 1. Create Composio Account

Go to [app.composio.dev/signup](https://app.composio.dev/signup) and sign in with `onlymore2024@gmail.com`.

### 2. Connect LinkedIn

Go to [app.composio.dev/apps/linkedin](https://app.composio.dev/apps/linkedin), click **Connect**, and authorize access. Composio handles OAuth automatically — no manual Bearer Token needed.

### 3. Get Credentials

- **API Key**: [app.composio.dev/settings/api-keys](https://app.composio.dev/settings/api-keys)
- **MCP URL**: [app.composio.dev/mcp](https://app.composio.dev/mcp) → select LinkedIn toolkit → copy URL

### 4. Run Setup Script

```bash
export COMPOSIO_API_KEY="your-key"
export COMPOSIO_MCP_URL="your-mcp-url"
bash scripts/setup-composio-linkedin.sh
```

### 5. Manual Alternative

```bash
claude mcp add --transport http linkedin-composio \
  "YOUR_MCP_URL" \
  --headers "X-API-Key:YOUR_API_KEY"
```

Then restart Claude Code and verify with `/mcp`.

## LinkedIn Pages

| Page | Entity | Use Case |
|------|--------|----------|
| ONLYMORE group | Holding | Vision, strategy, investor comms |
| colhybri | COLHYBRI | Local solidarity commerce |
| Pillar Pay | ONLYMORE FINANCE | Fintech, BNPL |
| DOJUKU SHINGI | DOJUKU | Martial arts, gaming |

## Available Actions

Once connected, Claude Code can:

- **Publish posts** on any of the 4 pages
- **Retrieve post stats** (impressions, engagement)
- **List managed pages**
- **Delete posts**
- **Get Person URN** automatically

## Agent Assignment

This MCP is primarily used by **HERALD** (Communication agent) for LinkedIn content publishing, but **ALPHA** (Strategy) may use it for positioning posts.

## Advantages over Manual Bearer Token

| Feature | Manual Token | Composio MCP |
|---------|-------------|--------------|
| OAuth refresh | Manual every 60 days | Automatic |
| Person URN | Manual lookup | Auto-detected |
| Multi-page | Complex setup | Native |
| Integration | REST API calls | MCP tooling |

## Troubleshooting

- **MCP not showing**: Restart Claude Code after setup
- **Auth error**: Re-authorize LinkedIn in Composio dashboard
- **Page not found**: Ensure LinkedIn account has admin access to all 4 pages
