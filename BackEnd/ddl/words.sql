
-- Table for words
CREATE TABLE words (
  id UUID PRIMARY KEY,
  wordTypeId UUID,
  word VARCHAR(255),
  definition TEXT
  FOREIGN KEY (wordTypeId) REFERENCES wordTypes(id)
);

-- Table for sentences
CREATE TABLE sentences (
  id UUID PRIMARY KEY,
  content VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
