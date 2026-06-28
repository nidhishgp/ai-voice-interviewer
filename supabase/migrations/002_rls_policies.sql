ALTER TABLE session_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creators can read own templates"
ON session_templates
FOR SELECT
USING (auth.uid() = creator_id);

CREATE POLICY "creators can insert own templates"
ON session_templates
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "creators can update own templates"
ON session_templates
FOR UPDATE
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "creators can delete own templates"
ON session_templates
FOR DELETE
USING (auth.uid() = creator_id);

CREATE POLICY "creators can read own candidate sessions"
ON candidate_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM session_templates
    WHERE session_templates.id = candidate_sessions.template_id
    AND session_templates.creator_id = auth.uid()
  )
);

CREATE POLICY "creators can delete own candidate sessions"
ON candidate_sessions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM session_templates
    WHERE session_templates.id = candidate_sessions.template_id
    AND session_templates.creator_id = auth.uid()
  )
);