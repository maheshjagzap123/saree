-- Vastraa Paithani — add optional profile fields for the account page. Additive, safe.
alter table profiles add column if not exists date_of_birth date;
alter table profiles add column if not exists newsletter_opt_in boolean not null default false;
