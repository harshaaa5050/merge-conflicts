-- Seed doctors data
INSERT INTO public.doctors (name, specialty, location, phone, email, bio, rating) VALUES
('Dr. Priya Sharma', 'Obstetrician & Gynecologist', 'Mumbai, Maharashtra', '+91 98765 43210', 'priya.sharma@example.com', 'Specializing in high-risk pregnancies and prenatal care with 15 years of experience.', 4.8),
('Dr. Anjali Desai', 'Reproductive Psychiatrist', 'Bangalore, Karnataka', '+91 98765 43211', 'anjali.desai@example.com', 'Expert in perinatal mental health, postpartum depression, and anxiety disorders.', 4.9),
('Dr. Meera Patel', 'Fertility Specialist', 'Delhi, NCR', '+91 98765 43212', 'meera.patel@example.com', 'Helping families through fertility challenges with compassionate care.', 4.7),
('Dr. Kavitha Nair', 'Menopause Specialist', 'Chennai, Tamil Nadu', '+91 98765 43213', 'kavitha.nair@example.com', 'Dedicated to helping women navigate menopause with holistic approaches.', 4.6),
('Dr. Sunita Reddy', 'Maternal-Fetal Medicine', 'Hyderabad, Telangana', '+91 98765 43214', 'sunita.reddy@example.com', 'Specialized in complicated pregnancies and fetal health monitoring.', 4.8),
('Dr. Ritu Gupta', 'Grief Counselor', 'Pune, Maharashtra', '+91 98765 43215', 'ritu.gupta@example.com', 'Supporting women through pregnancy loss and miscarriage with empathy.', 4.9)
ON CONFLICT DO NOTHING;
