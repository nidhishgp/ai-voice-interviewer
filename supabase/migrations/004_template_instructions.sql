ALTER TABLE session_templates
  ADD COLUMN candidate_instructions TEXT,
  ADD COLUMN system_prompt TEXT;