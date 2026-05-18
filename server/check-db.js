const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_prisma_migrations'
      ) as exists
    `;
    console.log('Table exists:', result[0].exists);
    
    if (result[0].exists) {
      const migrations = await prisma.$queryRaw`
        SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at
      `;
      console.log('Migrations:', JSON.stringify(migrations, null, 2));
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
