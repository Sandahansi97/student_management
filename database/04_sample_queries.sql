-- Step 4: sample SELECT / UPDATE / DELETE queries.

-- SELECT
SELECT * FROM student;
SELECT * FROM student WHERE student_id = 1;
SELECT s.student_name, m.maths_score, m.english_score, m.science_score
FROM student s JOIN marks m ON m.student_id = s.student_id;
SELECT student_id, (maths_score + english_score + science_score) / 3 AS average FROM marks;

-- UPDATE
UPDATE student SET home_town = 'Jaffna' WHERE student_id = 1;
UPDATE marks SET maths_score = 95 WHERE student_id = 1;

-- DELETE (marks first is optional because of ON DELETE CASCADE)
DELETE FROM marks WHERE student_id = 2;
DELETE FROM student WHERE student_id = 3;
