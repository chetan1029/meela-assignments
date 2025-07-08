-- Create a form questionnaire table
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    step INTEGER NOT NULL,
    question TEXT NOT NULL,
    description TEXT,
    multiple BOOLEAN NOT NULL DEFAULT false,
    optional BOOLEAN NOT NULL DEFAULT false,
    min_selection INTEGER,
    max_selection INTEGER
);

CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Seed initial questions and options
INSERT INTO questions (id, step, question, description, multiple, optional, min_selection, max_selection) VALUES
  (1, 1, 'What do you need help with?', 'Choose 1-5 areas.', true, false, 1, 5),
  (2, 2, 'How old are you?', '', false, false, NULL, NULL),
  (3, 3, 'What gender do you identify as?', '', false, false, NULL, NULL),
  (4, 4, 'Do you want your therapist to have knowledge in any of these areas?', '', true, true, 0, NULL);

INSERT INTO options (question_id, text) VALUES
  (1, 'Lost spark'),
  (1, 'Previous relationships'),
  (1, 'ADHD/ADD'),
  (1, 'Addiction (experienced yourself)'),
  (1, 'Adoption'),
  (1, 'Anger management'),
  (1, 'Anxiety'),
  (1, 'Autism'),
  (1, 'Bipolar disorder'),
  (1, 'Borderline personality disorder'),
  (1, 'Childhood trauma'),
  (1, 'Depression'),
  (1, 'Eating disorders'),
  (1, 'Family issues'),
  (1, 'Grief and loss'),
  (1, 'LGBTQ+ issues'),
  (1, 'Obsessive-compulsive disorder (OCD)'),
  (1, 'Panic attacks'),
  (1, 'Personality disorders'),
  (1, 'Post-traumatic stress disorder (PTSD)'),
  (1, 'Relationship issues'),
  (1, 'Self-esteem issues'),
  (2, 'Under 18'),
  (2, '18-25'),
  (2, '26-35'),
  (2, '36-45'),
  (2, '46-55'),
  (2, '56-65'),
  (2, 'Over 65'),
  (3, 'Woman'),
  (3, 'Man'),
  (3, 'Non-binary'),
  (4, 'LGBTQ+'),
  (4, 'Minority stress'),
  (4, 'Neurodivergent'),
  (4, 'Polyamorous relationships'),
  (4, 'Race-based Traumatic Stress (RBTS)'),
  (4, 'Transgender knowledge');

