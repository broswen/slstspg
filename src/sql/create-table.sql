CREATE TABLE public.dates
(
    dateType text NOT NULL,
    dateValue date NOT NULL,
    PRIMARY KEY (date_type)
);

ALTER TABLE public.dates
    OWNER to postgres;