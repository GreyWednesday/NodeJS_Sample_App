CREATE TABLE cabs
(
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    address_id integer NOT NULL,
    created_at timestamp
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT cabs_address_id FOREIGN KEY
    (address_id) REFERENCES addresses
    (id)
);

