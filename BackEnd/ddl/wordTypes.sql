drop table if exists wordTypes;

create table wordTypes(
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);