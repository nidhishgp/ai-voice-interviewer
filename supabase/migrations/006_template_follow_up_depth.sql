ALTER TABLE session_templates
  ADD COLUMN follow_up_depth TEXT NOT NULL DEFAULT 'light'
    CHECK (follow_up_depth IN ('none', 'light', 'deep'));