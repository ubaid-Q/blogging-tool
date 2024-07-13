# Blogging Tool

## Overview

A deployable blogging tool for managing articles with distinct author and reader pages.

## Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)
- SQLite

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:ubaid-Q/blogging-tool.git
   cd blogging-tool
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the SQLite database:

   ```bash
   npm run build-db
   ```

## Running the Application

```bash
npm run build-db
```

### Usage

- Author Home Page: -- Manage drafts, published articles, settings.
- Reader Home Page: -- Browse and read articles.
- Settings Page: -- Change blog title and author name.
- Edit Article Page: -- Write, edit, and publish articles.
- Reader Article Page: -- Read and interact with articles.

### Database Schema
 Defined in db_schema.sql with tables for authors, articles, comments, settings.

### Security
- Passwords hashed using bcrypt.
- Session management with express-session.

### Extension
- Password Access: Secure author pages with password authentication.

### Diagrams and Screencast
- Architecture and database diagrams: Replace <diagram_urls>.
- Screencast: Link to video demonstration (max 2.5 mins).

### Author
Jaydev