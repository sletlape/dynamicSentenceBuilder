drop table if exists words;

CREATE TABLE words (
  id UUID PRIMARY KEY,
  wordTypeId UUID,
  word VARCHAR(255) NOT NULL UNIQUE,
  definition TEXT
  FOREIGN KEY (wordTypeId) REFERENCES wordTypes(id)
);

