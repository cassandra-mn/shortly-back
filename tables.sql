CREATE TABLE users (
    "id" serial PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "password" text NOT NULL,
    "createdAt" date DEFAULT NOW()
);

CREATE TABLE urls (
    "id" serial PRIMARY KEY,
    "url" text NOT NULL,
    "shortUrl" text NOT NULL,
    "visitCount" integer DEFAULT 0,
    "userId" integer REFERENCES users("id"),
    "createdAt" date DEFAULT NOW()
);

CREATE TABLE sessions (
    "id" serial PRIMARY KEY,
    "token" text NOT NULL, 
    "userId" integer REFERENCES users("id")
);