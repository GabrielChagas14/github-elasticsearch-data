CREATE TABLE github_data (
  id SERIAL PRIMARY KEY,               
  issue_id INT NOT NULL,              
  title TEXT NOT NULL,                 
  state TEXT NOT NULL,                 
  created_at TIMESTAMP NOT NULL,      
  closed_at TIMESTAMP,                 
  resolution_time_days INT,           
  priority TEXT,                     
  milestone TEXT,                      
  author TEXT NOT NULL,               
  assignee TEXT,                       
  related_topic TEXT                  
);
