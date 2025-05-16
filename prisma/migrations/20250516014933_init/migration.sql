/*
  Warnings:

  - The primary key for the `paket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `paket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_paket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL
);
INSERT INTO "new_paket" ("deskripsi", "kode", "nama") SELECT "deskripsi", "kode", "nama" FROM "paket";
DROP TABLE "paket";
ALTER TABLE "new_paket" RENAME TO "paket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
