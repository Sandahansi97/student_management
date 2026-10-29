-- Step 2: create tables. Run while connected to student_management.

CREATE TABLE IF NOT EXISTS student (
    student_id   SERIAL PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL CHECK (length(trim(student_name)) > 0),
    home_town    VARCHAR(100) NOT NULL CHECK (length(trim(home_town)) > 0),
    created_on   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE
);

-- One marks record per student: student_id is both the primary key and a foreign key.
-- ON DELETE CASCADE: deleting a student also removes their marks.
CREATE TABLE IF NOT EXISTS marks (
    student_id    INTEGER PRIMARY KEY REFERENCES student (student_id) ON DELETE CASCADE,
    maths_score   NUMERIC(5,2) NOT NULL CHECK (maths_score   BETWEEN 0 AND 100),
    english_score NUMERIC(5,2) NOT NULL CHECK (english_score BETWEEN 0 AND 100),
    science_score NUMERIC(5,2) NOT NULL CHECK (science_score BETWEEN 0 AND 100)
);
