-- create_user function
create or replace function public.create_user(
    new_email text,
    new_password text,
    new_username text,
    is_super_admin boolean default false
) returns uuid
    security definer
    set search_path = auth
as
$$
declare
    user_id uuid;
begin
    user_id := extensions.uuid_generate_v4();

    insert into auth.users (id,
                            instance_id,
                            role,
                            aud,
                            email,
                            raw_app_meta_data,
                            raw_user_meta_data,
                            is_super_admin,
                            encrypted_password,
                            created_at,
                            updated_at,
                            last_sign_in_at,
                            email_confirmed_at,
                            confirmation_sent_at,
                            confirmation_token,
                            recovery_token,
                            email_change_token_new,
                            email_change)
    values (user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            new_email,
            '{
              "provider": "email",
              "providers": [
                "email"
              ]
            }',
            json_build_object('username', new_username),
            is_super_admin,
            extensions.crypt(new_password, extensions.gen_salt('bf')),
            now(),
            now(),
            now(),
            now(),
            now(),
            '',
            '',
            '',
            '');
    insert into auth.identities (id,
                                 provider_id,
                                 provider,
                                 user_id,
                                 identity_data,
                                 last_sign_in_at,
                                 created_at,
                                 updated_at)
    values ((select id from auth.users where email = new_email),
            (select id from auth.users where email = new_email),
            'email',
            (select id from auth.users where email = new_email),
            json_build_object('sub', (select id from auth.users where email = new_email)),
            now(),
            now(),
            now());

    return user_id;
end ;
$$ language plpgsql;

-- update_updated_at_column function

create or replace function public.update_updated_at_column()
    returns trigger as
$$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- email_to_username function

create or replace function public.email_to_username(email text)
    returns text as
$$
declare
    username    text;
    domain      text;
    domain_hash text;
begin
    if email is null or email not like '%@%.%' then
        return null;
    end if;

    domain := split_part(email, '@', 2);
    domain_hash := substr(md5(domain), 1, 6);

    username := split_part(email, '@', 1);
    username := regexp_replace(username, '[^a-za-z0-9_]', '', 'g');
    username := lower(username);

    if length(username) > 30 then
        username := substr(username, 1, 23) || '-' || domain_hash;
    else
        username := username || '-' || domain_hash;
    end if;

    return username;
end;
$$ language plpgsql;
