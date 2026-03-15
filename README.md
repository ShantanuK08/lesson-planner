# lesson-planner
Collaborative lesson planner — React, Redux, Apollo Client, GraphQL, PostgreSQL


C:\Users\shant\lesson-planner>node --version    # should be v18 or above
v22.12.0

C:\Users\shant\lesson-planner>npm --version     # should be v9 or above
10.9.0

C:\Users\shant\lesson-planner>git --version     # any version is fine


npm create vite@latest client -- --template react

mkdir server
cd server
npm init -y



C:\Users\shant\lesson-planner>mkdir server

C:\Users\shant\lesson-planner>cd server

C:\Users\shant\lesson-planner>dir  
 Volume in drive C is Windows-SSD
 Volume Serial Number is 8802-6A62

 Directory of C:\Users\shant\lesson-planner       

15-03-2026  16:11    <DIR>          .
15-03-2026  16:06    <DIR>          ..
15-03-2026  16:05             2,291 .gitignore    
15-03-2026  16:09    <DIR>          client        
15-03-2026  16:11               889 README.md     
15-03-2026  16:11    <DIR>          server        
               2 File(s)          3,180 bytes     
               4 Dir(s)  150,690,840,576 bytes free


cd client
npm install
npm install @apollo/client graphql react-router-dom @reduxjs/toolkit react-redux



cd server
npm install apollo-server-express express graphql jsonwebtoken bcryptjs pg dotenv cors
npm install -D nodemon


C:\Users\shant\lesson-planner>cd server\src && dir

 Volume in drive C is Windows-SSD
 Volume Serial Number is 8802-6A62

 Directory of C:\Users\shant\lesson-planner\server\src

15-03-2026  16:24    <DIR>          .
15-03-2026  16:24    <DIR>          ..
15-03-2026  16:24    <DIR>          db
15-03-2026  16:24    <DIR>          graphql       
15-03-2026  16:24    <DIR>          middleware    
15-03-2026  16:24    <DIR>          services      
               0 File(s)              0 bytes     
               6 Dir(s)  150,546,653,184 bytes free




C:\Users\shant\lesson-planner>curl -X POST http://localhost:4000/graphql ^
More?   -H "Content-Type: application/json" ^
More?   -d "{\"query\":\"mutation { register(name: \\\"Shantanu\\\", email: \\\"shantanu@test.com\\\", password: \\\"test1234\\\", role: \\\"teacher\\\") { token user { id name email role } } }\"}"
{"data":{"register":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM2N2Y1N2NiLTg5YjctNDg3MS1hM2NmLTE2YTg1MzkzOGQ2NyIsImVtYWlsIjoic2hhbnRhbnVAdGVzdC5jb20iLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzU3NDYzNCwiZXhwIjoxNzc0MTc5NDM0fQ.5lpl0x9lsOeV0WnP_c2DBkAiHUHo_JmiSSujxWCOTLU","user":{"id":"c67f57cb-89b7-4871-a3cf-16a853938d67","name":"Shantanu","email":"shantanu@test.com","role":"teacher"}}}}   

C:\Users\shant\lesson-planner>

