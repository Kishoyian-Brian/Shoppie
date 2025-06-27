/*
  Warnings:

  - Added the required column `price` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
