-- Wave 0 / Task 2: Database foundation init
create extension if not exists "uuid-ossp";

create schema if not exists app_public;
create schema if not exists app_private;

comment on schema app_public is 'Application public schema with tenant-scoped tables';
comment on schema app_private is 'Application private schema for privileged metadata';
