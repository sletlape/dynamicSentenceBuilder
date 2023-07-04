drop table if exists wordType;

create table wordType(
    id character(36) primary key,
    name varchar(255) not null,
    description text
);
