-- Seed a creator user
INSERT INTO session_templates (id, creator_id, title, description, questions, is_active)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000000',
  'Senior Frontend Engineer Interview',
  'Standard frontend interview covering React, system design, and past experience.',
  '[
    {"id": 1, "text": "Walk me through a complex component you built recently.", "duration_seconds": 120},
    {"id": 2, "text": "How do you approach performance optimization in a React app?", "duration_seconds": 120},
    {"id": 3, "text": "Describe a time you disagreed with a technical decision. What did you do?", "duration_seconds": 90}
  ]'::jsonb,
  true
);

-- Seed a candidate session in pending state
INSERT INTO candidate_sessions (id, template_id, share_token, candidate_name, candidate_email, status)
VALUES (
  'b2c3d4e5-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'c3d4e5f6-0000-0000-0000-000000000003',
  'Alex Johnson',
  'alex.johnson@example.com',
  'pending'
);