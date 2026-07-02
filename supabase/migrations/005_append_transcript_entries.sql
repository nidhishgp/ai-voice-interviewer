CREATE OR REPLACE FUNCTION append_transcript_entries(
  session_id UUID,
  entries JSONB
)
RETURNS VOID AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE candidate_sessions
  SET transcript = transcript || entries
  WHERE id = session_id;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  IF rows_updated = 0 THEN
    RAISE EXCEPTION 'session not found: %', session_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;