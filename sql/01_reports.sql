CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_request TEXT,
  prompt TEXT,
  claim TEXT,
  evaluation TEXT,
  article TEXT,
  related_questions TEXT,
  category TEXT,
  privacy_setting TEXT CHECK (privacy_setting IN ('public', 'anyone_with_the_link', 'private')),
  done BOOLEAN DEFAULT false,
  metadata JSONB
);
