CREATE TABLE public.learning_domains
(
    id                UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name              VARCHAR(100) NOT NULL,
    description       TEXT,
    icon_url          TEXT,
    color_hex         VARCHAR(7),
    is_system_default BOOLEAN                  DEFAULT false,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_learning_paths
(
    id                       UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id                  UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    domain_id                UUID REFERENCES learning_domains (id),
    name                     VARCHAR(255) NOT NULL,
    description              TEXT,
    target_proficiency_level INTEGER                  DEFAULT 3 CHECK (target_proficiency_level BETWEEN 1 AND 5),
    estimated_duration_hours INTEGER,
    is_active                BOOLEAN                  DEFAULT true,
    completion_percentage    DECIMAL(5, 2)            DEFAULT 0,
    created_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
