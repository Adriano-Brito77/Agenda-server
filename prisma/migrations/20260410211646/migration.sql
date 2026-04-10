/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `stock_balance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stock_balance_product_id_key" ON "stock_balance"("product_id");
