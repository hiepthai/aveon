CREATE TYPE public.flashcard_visibility AS ENUM ('private', 'shared', 'public', 'community');

CREATE TABLE public.flashcard_decks
(
    id           UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES auth.users (id) ON DELETE CASCADE,

    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    tags         TEXT[],                             -- Array of tags for better organization

    -- Content & source tracking
    content_hash VARCHAR(64),                        -- Hash of all cards content for change detection
    version      INTEGER                  DEFAULT 1,

    -- Deck statistics (global across all users)
    total_cards  INTEGER                  DEFAULT 0,
    total_users  INTEGER                  DEFAULT 1, -- How many users are using this deck

    -- Sharing & visibility
    visibility   flashcard_visibility     DEFAULT 'private',
    share_code   VARCHAR(20) UNIQUE,                 -- For easy sharing via code
    language     VARCHAR(10)              DEFAULT 'en',
    is_featured  BOOLEAN                  DEFAULT false,
    is_verified  BOOLEAN                  DEFAULT false,

    -- Metadata
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_flashcard_decks_created_by ON flashcard_decks (user_id);
CREATE INDEX idx_flashcard_decks_visibility ON flashcard_decks (visibility);
CREATE INDEX idx_flashcard_decks_share_code ON flashcard_decks (share_code) WHERE share_code IS NOT NULL;
CREATE INDEX idx_flashcard_decks_featured ON flashcard_decks (is_featured) WHERE is_featured = true;

CREATE TYPE flashcard_type AS ENUM ('basic', 'cloze', 'multiple_choice', 'code');
CREATE TYPE flashcard_status AS ENUM ('pending', 'approved', 'rejected', 'needs_review');
CREATE TYPE flashcard_content_type AS ENUM ('text', 'markdown', 'code', 'image');

CREATE TABLE flashcards
(
    id                 UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    deck_id            UUID REFERENCES flashcard_decks (id) ON DELETE CASCADE,

    -- Card content
    type               flashcard_type           DEFAULT 'basic',
    front_content      TEXT NOT NULL,
    back_content       TEXT NOT NULL,
    front_content_type flashcard_content_type   DEFAULT 'text',
    back_content_type  flashcard_content_type   DEFAULT 'text',

    status             flashcard_status         DEFAULT 'pending',
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_flashcards_deck ON flashcards (deck_id);
CREATE INDEX idx_flashcards_type ON flashcards (type);
CREATE INDEX idx_flashcards_status ON flashcards (status);
