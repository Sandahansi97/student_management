-- Step 3: sample data for testing.
INSERT INTO student (student_name, home_town, is_active) VALUES
 ('Nimal Perera',   'Colombo', TRUE),
 ('Kamala Silva',   'Kandy',   TRUE),
 ('Sunil Fernando', 'Galle',   FALSE);

INSERT INTO marks (student_id, maths_score, english_score, science_score) VALUES
 (1, 85.50, 78.00, 90.25),
 (2, 92.00, 88.50, 95.00);
