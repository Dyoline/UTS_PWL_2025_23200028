/*
  Warnings:

  - You are about to drop the column `is_paid` on the `preorder` table. All the data in the column will be lost.
  - Added the required column `status` to the `preorder` table without a default value. This is not possible if the table is not empty.

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
INSERT INTO "new_preorder" ("id", "order_by", "order_date", "qty", "selected_package") SELECT "id", "order_by", "order_date", "qty", "selected_package" FROM "preorder";
DROP TABLE "preorder";
ALTER TABLE "new_preorder" RENAME TO "preorder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
