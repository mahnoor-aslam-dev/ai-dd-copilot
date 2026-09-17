-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cases table (har due-diligence project ek "case" hai)
CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  doc_type VARCHAR(100),
  upload_status VARCHAR(50) DEFAULT 'uploaded',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Document chunks table (text ke tukde, embeddings baad mein add karengay)
CREATE TABLE document_chunks (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  page_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Risk flags table
CREATE TABLE risk_flags (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  flag_type VARCHAR(100),
  severity VARCHAR(50),
  description TEXT,
  source_chunk_id INTEGER REFERENCES document_chunks(id),
  created_at TIMESTAMP DEFAULT NOW()
);