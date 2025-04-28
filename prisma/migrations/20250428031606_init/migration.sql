/*
  Warnings:

  - You are about to alter the column `order_date` on the `preorder` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_preorder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_date" DATETIME NOT NULL,
    "order_by" TEXT NOT NULL,
    "selected_package" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL
);
INSERT INTO "new_preorder" ("id", "order_by", "order_date", "qty", "selected_package", "status") SELECT "id", "order_by", "order_date", "qty", "selected_package", "status" FROM "preorder";
DROP TABLE "preorder";
ALTER TABLE "new_preorder" RENAME TO "preorder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
