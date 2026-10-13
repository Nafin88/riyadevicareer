#!/usr/bin/env bash
cd "$(dirname "$0")"
(cd backend && npm install) && (cd frontend && npm install)
(cd backend && npm run dev) &
(cd frontend && npm run dev)
