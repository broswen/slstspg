CREATE TABLE public.dates
(
    dateType text NOT NULL,
    dateValue date NOT NULL,
    PRIMARY KEY (dateType)
);

ALTER TABLE public.dates
    OWNER to postgres;