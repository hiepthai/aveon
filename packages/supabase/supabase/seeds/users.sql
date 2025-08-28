DO $$
DECLARE
user_id_1 uuid;
    user_id_2 uuid;
BEGIN
    user_id_1 := public.create_user('thaichanhiep@gmail.com', 'Abc@123', 'hiepthai', TRUE);
    user_id_2 := public.create_user('trantrangct@gmail.com', 'Abc@123', 'zen', TRUE);

insert into public.user_roles (user_id, role)
values
    (user_id_1, 'admin');
insert into public.user_roles (user_id, role)
values
    (user_id_2, 'admin');
END $$;