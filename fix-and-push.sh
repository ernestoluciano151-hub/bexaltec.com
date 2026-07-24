#!/bin/bash
# Removes stale git locks and pushes all changes to GitHub
cd "$(dirname "$0")"

echo "🔧 Removing stale git lock files..."
rm -f .git/index.lock .git/HEAD.lock .git/COMMIT_EDITMSG.lock 2>/dev/null

echo "📦 Staging all changes..."
git add -A

echo "📝 Committing..."
git commit -m "feat: connect all pages to real DB — JWT fix, shared components, full CRUD

- Fix P0: middleware.ts now cryptographically verifies JWT (jose jwtVerify)
  Role decoded from verified payload, not unsigned bx_role cookie

- Shared UI components (src/components/ui/shared.tsx):
  StatusBadge, PriorityBadge, StatCard, Skeleton, CardSkeleton,
  EmptyState, Modal, useToast, ConfirmDialog, FormField, PageHeader, SearchBar

- New query files: invoices, workOrders, parts, equipment, contracts, users

- Server Actions (src/lib/actions/):
  tickets.ts — createTicket, addTicketMessage, updateTicketStatus, assignTicket
  repairs.ts — createRepair, updateRepairStatus
  profile.ts — updateProfile, changePassword, adminUpdateUser
  admin.ts   — createCompany, updateCompany, createWorkOrder, createInvoice,
               updateInvoiceStatus, sendNotification, markNotificationRead

- Dashboard portal — all pages connected to real DB:
  home (getClientDashboard), tickets (search/filter/message thread),
  repair-status (7-stage timeline), billing (tabs + totals),
  notifications (mark-read), equipment, contracts, profile (edit + change password)

- Admin CRM — all pages via API routes (no server queries in client code):
  KPI dashboard, clients, companies, tickets, laboratory, work-orders,
  financial, inventory/parts, equipment, SLA/contracts, reports, technicians

- API routes: GET /api/admin/* and /api/client/* with session auth guards

- Removed ALL mock-data imports from dashboard and admin pages"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will deploy automatically."
