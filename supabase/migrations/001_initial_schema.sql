CREATE TABLE session_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id    UUID NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  questions     JSONB NOT NULL DEFAULT '[]',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_templates_creator_id ON session_templates (creator_id);

CREATE TABLE candidate_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     UUID NOT NULL REFERENCES session_templates(id) ON DELETE CASCADE,
  share_token     UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  candidate_name  TEXT,
  candidate_email TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_progress', 'completed', 'evaluated', 'expired')),
  transcript      JSONB NOT NULL DEFAULT '[]',
  evaluation      JSONB,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_candidate_sessions_template_id ON candidate_sessions (template_id);
CREATE INDEX idx_candidate_sessions_share_token ON candidate_sessions (share_token);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER session_templates_updated_at
  BEFORE UPDATE ON session_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER candidate_sessions_updated_at
  BEFORE UPDATE ON candidate_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION append_transcript_entry(
  session_id UUID,
  entry JSONB
)
RETURNS VOID AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE candidate_sessions
  SET transcript = transcript || jsonb_build_array(entry)
  WHERE id = session_id;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  IF rows_updated = 0 THEN
    RAISE EXCEPTION 'session not found: %', session_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;