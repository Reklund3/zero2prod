-- Add migration script here
INSERT INTO users (user_id, username, password_hash)
VALUES (
        '6fcedb1e-1589-4fa7-b7e9-983fc79b4cf6',
        'admin',
        '$argon2id$v=19$m=15000,t=2,p=1$59d8FW/RAWjEp36nLAshzg$40mZqSkUfGGOXgYRhOM4fXvc9AxLp6SmWtKe4O/J/+M'
       )