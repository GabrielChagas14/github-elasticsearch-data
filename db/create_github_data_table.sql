CREATE TABLE issue (
  issue_id TEXT PRIMARY KEY,          
  title TEXT NOT NULL,                 
  body TEXT,                 
  state TEXT NOT NULL,                 
  created_at TIMESTAMP NOT NULL,      
  closed_at TIMESTAMP,                 
  resolution_time_days INT,           
  priority TEXT,                     
  milestone TEXT,                      
  author TEXT,               
  assignee TEXT,                       
  related_topic TEXT
);

CREATE TABLE label (
  label_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,              
  color TEXT NOT NULL,                 
  description TEXT,                 
  is_default BOOLEAN NOT NULL,      
  url TEXT NOT NULL                 
);

CREATE TABLE comment (
    comment_id TEXT PRIMARY KEY,      
    issue_id TEXT NOT NULL,         
    author TEXT NOT NULL,             
    body TEXT NOT NULL,               
    created_at TIMESTAMP NOT NULL,   
    url TEXT NOT NULL,                
    FOREIGN KEY (issue_id) REFERENCES issue(issue_id) ON DELETE CASCADE 
);

CREATE TABLE issue_label (
  issue_id TEXT NOT NULL,
  label_id TEXT NOT NULL,
  PRIMARY KEY (issue_id, label_id),
  FOREIGN KEY (issue_id) REFERENCES issue(issue_id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES label(label_id) ON DELETE CASCADE
);

