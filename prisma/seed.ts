import {
  shiftStatusSchema,
  weekDaySchema,
} from '@/common/validations/shift/shift.dto';
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers(): Promise<void> {

  console.log('Cleaning data')
    await prisma.history.deleteMany();
    await prisma.shift.deleteMany();    
    await prisma.user.deleteMany();

  console.log('Seeding users...');

  // TODO: Optimize with promise.all
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: await hash(`password${i}`, 1),
        name: `User ${i}`,
        role: i % 2 === 0 ? Role.TRABALHADOR : Role.ADMINISTRADOR,
      },
    });
  }

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await hash('admin123', 1),
      name: 'Admin',
      role: Role.ADMINISTRADOR,
      isBanned: false,
      isEmailVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: await hash('user123', 1),
      name: 'User',
      role: Role.TRABALHADOR,
      isBanned: false,
      isEmailVerified: true,
    },
  });

  console.log('Users seeded successfully.');
}

async function seedShifts(): Promise<void> {


  console.log('Seeding shifts...');

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: 'user@example.com',
    },
  });

  for (let i = 0; i < 10; i++) {
    await prisma.shift.create({
      data: {
        userId: user.id,
        weekDay: Object.values(weekDaySchema.enum)[i % 7],
        startAt: (8 + i) * 60,
        endAt: (8 + i + 1) * 60 + 30,
        status: Object.values(shiftStatusSchema.enum)[i % 3],
      },
    });
  }

  console.log('Shifts seeded successfully.');
}

async function seedHistorys(): Promise<void> {

  console.log('Seeding history...');

 
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: 'user@example.com',
    },
  });

  for (let i = 0; i < 15; i++) {
    const date = new Date();
    await prisma.history.create({
      data: {
        userId: user.id,
        weekDay: Object.values(weekDaySchema.enum)[i % 7],
        startAt: (8 + i) * 60,
        endAt: (8 + i) * 60,
        isPresent: true,
        relatedDate: date,
      },
    });
  }

  console.log('History seeded successfully.');
}

async function main(): Promise<void> {
  await seedUsers();
  await seedShifts();
  await seedHistorys();

}

console.log('Seeding database...');

main()
  .then(() => {
    console.log('Database seeded successfully.');
  })
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
