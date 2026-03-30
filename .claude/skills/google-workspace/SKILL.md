---
name: google-workspace
description: >
  Google Workspace CLI (gws) integration for ONLYMORE Group. Drive, Gmail, Calendar,
  Sheets, Docs access via the official gws CLI (v0.22+). All commands use
  gws <service> <resource> <method> --params/--json pattern.
  Triggers: google, drive, gmail, calendar, sheets, docs, workspace, gws,
  google drive, google sheets, email, envoyer un email, chercher un fichier,
  créer un événement, lire un spreadsheet, créer un document, Google Workspace.
---

# Google Workspace CLI — ONLYMORE Integration

## Overview

The `gws` CLI connects to Google Workspace APIs via OAuth. It uses Google's
Discovery Service to dynamically build commands at runtime.

Account: onlymore2024@gmail.com

## Auth Setup (Manual, requires browser)

```bash
gws auth setup     # Configure Google Cloud Project credentials
gws auth login     # Opens browser for OAuth consent
gws auth status    # Verify auth state
```

## Command Pattern

```
gws <service> <resource> [sub-resource] <method> [flags]
```

Flags: `--params <JSON>` (URL params), `--json <JSON>` (request body),
`--format table|json|csv`, `--page-all` (auto-paginate)

## Quick Reference

### Drive

```bash
# List recent files
gws drive files list --params '{"pageSize": 10}' --format table

# Search by name
gws drive files list --params '{"q": "name contains '\''pitch deck'\''", "pageSize": 5}'

# Get file metadata
gws drive files get --params '{"fileId": "FILE_ID"}'

# Upload file
gws drive files create --params '{"uploadType": "multipart"}' \
  --json '{"name": "report.pdf"}' --upload ./report.pdf
```

### Gmail

```bash
# List recent messages
gws gmail users messages list --params '{"userId": "me", "maxResults": 10}'

# Read a message
gws gmail users messages get --params '{"userId": "me", "id": "MSG_ID", "format": "full"}'

# Send (via om wrapper — handles base64 encoding)
om google gmail send "investor@fund.com" "COLHYBRI Pre-Seed Update" "Body text here"
```

### Calendar

```bash
# Upcoming events
gws calendar events list --params '{"calendarId": "primary", "timeMin": "2026-03-30T00:00:00Z", "maxResults": 10, "singleEvents": true, "orderBy": "startTime"}'

# Create event (via om wrapper)
om google calendar create "RDV Occitanie Angels" "2026-04-15" "10:00"
```

### Sheets

```bash
# Get spreadsheet info
gws sheets spreadsheets get --params '{"spreadsheetId": "SHEET_ID"}'

# Read cell range
gws sheets spreadsheets values get --params '{"spreadsheetId": "SHEET_ID", "range": "Sheet1!A1:Z100"}' --format table

# Write values
gws sheets spreadsheets values update --params '{"spreadsheetId": "SHEET_ID", "range": "A1", "valueInputOption": "USER_ENTERED"}' \
  --json '{"values": [["Header1", "Header2"], ["val1", "val2"]]}'
```

### Docs

```bash
# Create document
gws docs documents create --json '{"title": "Memo Investisseur Q2 2026"}'

# Get document content
gws docs documents get --params '{"documentId": "DOC_ID"}'
```

## ONLYMORE Recipes

### Prepare investor meeting
```bash
om google drive search "pitch deck COLHYBRI"
om google calendar create "RDV Pierre Entremont" "2026-04-20" "14:00"
om google gmail send "investor@example.com" "Confirmation RDV" "Bonjour, ..."
```

### Cross-service: TODO + Calendar
```bash
om notion create-todo "Préparer pitch Occitanie Angels" "P0 Critique" "COLHYBRI"
om google calendar create "Pitch Occitanie Angels" "2026-04-15" "10:00"
```

### Financial model check
```bash
om google sheets read "SPREADSHEET_ID" "Model!A1:M50"
om stripe balance
```

## Available Services (full list)

drive, sheets, gmail, calendar, docs, slides, tasks, people, chat,
classroom, forms, keep, meet, admin-reports, events, script, workflow

## Environment Variables

| Variable | Usage |
|----------|-------|
| GOOGLE_WORKSPACE_CLI_TOKEN | Pre-obtained OAuth2 token (optional) |
| GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE | Path to OAuth credentials JSON |
| GOOGLE_WORKSPACE_CLI_CONFIG_DIR | Override config dir (default: ~/.config/gws) |
