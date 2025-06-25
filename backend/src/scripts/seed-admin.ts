import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();

  const email = 'admin@gmail.com';
  const name = 'Admin';
  const password = 'Adminpass123'; // Password to be hashed

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword, // Store hashed password
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
