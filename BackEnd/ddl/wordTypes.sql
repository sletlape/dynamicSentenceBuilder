drop table if exists wordTypes;

CREATE TABLE wordTypes (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);