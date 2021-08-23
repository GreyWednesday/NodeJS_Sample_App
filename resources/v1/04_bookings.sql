CREATE TABLE bookings
(
    id serial NOT NULL PRIMARY KEY,
    user_id integer NOT NULL,
    created_at timestamp
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    cab_id integer NOT NULL,
    status text NOT NULL,
    CONSTRAINT bookings_user_id FOREIGN KEY
    (user_id) REFERENCES users
    (id),
    CONSTRAINT bookings_cabs FOREIGN KEY
    (cab_id) REFERENCES cabs
    (id)
);

