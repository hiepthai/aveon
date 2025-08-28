-- handle_new_user function

create
or replace function public.handle_new_user()
    returns trigger as $$
begin

insert into public.user_metadata (user_id, field_name, field_value)
values (new.id, 'email', new.email);

insert into public.user_metadata (user_id, field_name, field_value)
values (new.id, 'username', public.email_to_username(new.email));

return new;
end;
$$
language plpgsql security definer;

-- on_auth_user_created trigger

create trigger on_auth_user_created
    after insert
    on auth.users
    for each row execute procedure public.handle_new_user();