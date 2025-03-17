-- DropForeignKey
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_user_id_fkey";

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
