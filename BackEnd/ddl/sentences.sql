drop table if exists sentences;

CREATE TABLE sentences (
  id UUID PRIMARY KEY,
  content VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
