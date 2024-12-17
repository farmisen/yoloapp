echo "=========== Setting up db"
/app/node_modules/.bin/prisma db push

echo "=========== Seeding the db"
/app/node_modules/.bin/tsx prisma/seed.ts

echo "=========== Starting the server"
node server.js
