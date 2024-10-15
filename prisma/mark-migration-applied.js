import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function markMigrationAsApplied() {
  try {
    await prisma.$executeRaw`
      INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
      VALUES (
        '6f9140b4-5a1b-4b5e-8bcd-ce49e2b6d89c',
        '6a7a82e83c47a0a1d1a6a5f6a9b5c9d8e7f6g5h4i3j2k1l0m9n8o7p6q5r4s3t2u1v0',
        NOW(),
        '20240316124500_make_address_fields_nullable',
        '',
        NULL,
        NOW(),
        1
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Migration marked as applied successfully');
  } catch (error) {
    console.error('Error marking migration as applied:', error);
  } finally {
    await prisma.$disconnect();
  }
}

markMigrationAsApplied();
