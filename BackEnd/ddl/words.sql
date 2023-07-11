drop table if exists words;

CREATE TABLE IF NOT EXISTS words (
  id UUID PRIMARY KEY,
  wordTypeId UUID REFERENCES wordTypes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

