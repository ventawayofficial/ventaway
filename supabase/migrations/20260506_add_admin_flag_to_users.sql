alter table public.users
add column if not exists is_admin boolean not null default false;

create index if not exists idx_users_is_admin
on public.users using btree (is_admin);

comment on column public.users.is_admin is
'Marks application users who are allowed to access the Ventaway admin dashboard.';
