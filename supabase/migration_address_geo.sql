-- Vastraa Paithani — add geolocation to addresses. Additive only, safe to re-run.
alter table addresses add column if not exists latitude double precision;
alter table addresses add column if not exists longitude double precision;
