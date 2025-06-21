import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = ['admin', 'member'];

  for (const name of roles) {
    const existing = await prisma.role.findUnique({ where: { name } });
    if (!existing) {
      await prisma.role.create({
        data: {
          name,
        },
      });
      console.log(`Rol creado: ${name}`);
    } else {
      console.log(`Rol ya existe: ${name}`);
    }
  }
}

main()
  .then(() => {
    console.log('Seed finalizado.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Error en seed:', e);
    return prisma.$disconnect().then(() => process.exit(1));
  });
// This script seeds the database with default roles if they do not already exist.
// It checks for the existence of roles "ADMIN" and "MEMBER", creating them if they are not found.