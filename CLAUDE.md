# ONLYMORE COMMAND CENTER — Claude Code Constitution

## Identity

- **Organization**: ONLYMORE Group (FLOW2203)
- **Founder**: Florent Gibert
- **Voice**: Always "nous", never "je"
- **Orchestration**: skills-cli (primary skill for all `onlymore <cmd>` routing)

## Git Config (Mandatory)

```
git config user.email "onlymore2024@gmail.com"
git config user.name "Florent Gibert"
```

## MCP Servers (8)

| # | MCP | URL |
|---|-----|-----|
| 1 | Supabase | mcp.supabase.com/mcp |
| 2 | Vercel | mcp.vercel.com |
| 3 | Notion | mcp.notion.com/mcp |
| 4 | n8n | onlymore.app.n8n.cloud/mcp-server/http |
| 5 | Gmail | gmail.mcp.claude.com/mcp |
| 6 | Google Calendar | gcal.mcp.claude.com/mcp |
| 7 | Canva | mcp.canva.com/mcp |
| 8 | Netlify | netlify-mcp.netlify.app/mcp |

## Project References

### Supabase
| Project | ID |
|---------|----|
| COLHYBRI | `isuzbpzwxcagtnbosgjl` |
| DOJUKU SHINGI | `cbmasgbbhmunzjoqbpcs` |
| Org | `urtlbxfbyuhvsdeseuam` |
| FORBIDDEN | `ydzuywqzzbpwytwwfmeq` — NEVER USE |

### Vercel
| Project | ID |
|---------|----|
| COLHYBRI | `prj_Len92CpsvpcnAHK2iIy7ODeT6ObG` |
| DOJUKU | `prj_ibJpfHkZdAXdHkBvDA4SOUeRWcBJ` |
| Games | `prj_USeRDBo8OXsOqlyZ4GVCt8ioKejK` |
| Vision | `prj_7yIiCGVa2tFW4AyLZ04LyMTiQVZs` |

### Notion
| Database | ID |
|----------|----|
| Command Center | `31b98dfff6a681298dcbe37403faca80` |
| TODO | `fd098f9f-202e-41db-9cdb-042c40cff516` |
| Prompt Library | `0e626e83-9f9b-43b5-8243-b1e72a85d563` |
| LinkedIn Calendar | `042ec1b1-22db-45b4-b727-0bc5f630aad0` |

## Agent Dispatch

| Agent | Role | Skills |
|-------|------|--------|
| ALPHA | Design & Branding | onlymore-designer, ai-visual-studio, brand-strategy |
| FORGE | Code & Deploy | colhybri-deploy, supabase-colhybri, vercel-deploy |
| VAULT | Finance | onlymore-investor, onlymore-finance-lombard |
| SHIELD | Security | colhybri-security |
| HERALD | Communication | onlymore-linkedin, vision-narrative |
| NEXUS | Integration | n8n-workflow-builder, skills-cli |
| SENTINEL | Monitoring | dream, agent-os |
| TITAN | Strategy | promptor-20, us-positioning |

## Anti-Loop Rules

1. MAX 3 retries per MCP call
2. 30s timeout per MCP call
3. Never call a MCP from a MCP
4. Never re-execute a failed command with same params
5. Lock deploys: one at a time per project
6. Circuit breaker: 3 failures in 5min = MCP marked DOWN
