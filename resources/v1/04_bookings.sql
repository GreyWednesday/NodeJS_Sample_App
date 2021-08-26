CREATE TABLE bookings
(
    id serial NOT NULL PRIMARY KEY,
    user_id integer NOT NULL,
    cab_id integer NOT NULL,
    starting_point integer NOT NULL,
    destination integer NOT NULL,
    status text NOT NULL,
    created_at timestamp
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT bookings_user_id FOREIGN KEY
    (user_id) REFERENCES users
    (id),
    CONSTRAINT bookings_cabs FOREIGN KEY
    (cab_id) REFERENCES cabs
    (id),
    CONSTRAINT bookings_starting_point FOREIGN KEY
    (starting_point) REFERENCES addresses
    (id),
    CONSTRAINT bookings_destination FOREIGN KEY
    (destination) REFERENCES addresses
    (id)
);

