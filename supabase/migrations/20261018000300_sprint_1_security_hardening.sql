-- Security hardening for a trigger that runs with database-owner privileges.
-- Existing migrations stay immutable; this is deliberately forward-only.
alter function public.handle_new_user() set search_path = public, pg_temp;
