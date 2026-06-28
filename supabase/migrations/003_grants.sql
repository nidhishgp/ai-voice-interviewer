GRANT SELECT, INSERT, UPDATE, DELETE ON session_templates TO authenticated;
GRANT SELECT, DELETE ON candidate_sessions TO authenticated;

GRANT ALL ON session_templates TO service_role;
GRANT ALL ON candidate_sessions TO service_role;

GRANT EXECUTE ON FUNCTION append_transcript_entry(UUID, JSONB) TO service_role;