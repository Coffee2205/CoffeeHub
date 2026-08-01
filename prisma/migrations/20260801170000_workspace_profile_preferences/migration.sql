ALTER TABLE public.profiles
  ADD COLUMN workspace_name varchar(120),
  ADD COLUMN timezone varchar(64) NOT NULL DEFAULT 'UTC',
  ADD CONSTRAINT profiles_workspace_name_valid CHECK (
    workspace_name IS NULL OR length(trim(workspace_name)) BETWEEN 1 AND 120
  ),
  ADD CONSTRAINT profiles_timezone_valid CHECK (
    length(trim(timezone)) BETWEEN 1 AND 64
  );

-- Existing owner/admin SELECT and UPDATE policies on public.profiles continue
-- to scope these private workspace preferences by auth.uid(). Anonymous users
-- can only select published rows, but public repositories never select either
-- workspace_name or timezone.

-- Rollback: drop profiles_workspace_name_valid and profiles_timezone_valid,
-- then drop workspace_name and timezone from public.profiles.
