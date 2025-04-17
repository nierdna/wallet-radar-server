import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWalletRadarTables1698765678901
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng wallet_subscriptions
    await queryRunner.query(`
      CREATE TABLE "wallet_subscriptions" (
        "id" SERIAL PRIMARY KEY,
        "wallet_address" VARCHAR NOT NULL,
        "token_address" VARCHAR,
        "blockchain_network" VARCHAR NOT NULL,
        "last_processed_block" INTEGER NOT NULL DEFAULT 0,
        "user_id" INTEGER,
        "webhook_url" VARCHAR,
        "email" VARCHAR,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Tạo bảng transaction_records
    await queryRunner.query(`
      CREATE TABLE "transaction_records" (
        "id" SERIAL PRIMARY KEY,
        "wallet_subscription_id" INTEGER NOT NULL,
        "tx_hash" VARCHAR NOT NULL UNIQUE,
        "block_number" INTEGER NOT NULL,
        "from_address" VARCHAR NOT NULL,
        "to_address" VARCHAR NOT NULL,
        "token_address" VARCHAR NOT NULL,
        "amount" VARCHAR NOT NULL,
        "timestamp" TIMESTAMP NOT NULL,
        "notified" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY ("wallet_subscription_id") REFERENCES "wallet_subscriptions" ("id") ON DELETE CASCADE
      );
    `);

    // Tạo index để tăng tốc tìm kiếm
    await queryRunner.query(`
      CREATE INDEX "idx_wallet_subscriptions_wallet_address" ON "wallet_subscriptions" ("wallet_address");
      CREATE INDEX "idx_wallet_subscriptions_token_address" ON "wallet_subscriptions" ("token_address");
      CREATE INDEX "idx_wallet_subscriptions_blockchain_network" ON "wallet_subscriptions" ("blockchain_network");
      CREATE INDEX "idx_wallet_subscriptions_active" ON "wallet_subscriptions" ("active");
      
      CREATE INDEX "idx_transaction_records_wallet_subscription_id" ON "transaction_records" ("wallet_subscription_id");
      CREATE INDEX "idx_transaction_records_tx_hash" ON "transaction_records" ("tx_hash");
      CREATE INDEX "idx_transaction_records_block_number" ON "transaction_records" ("block_number");
      CREATE INDEX "idx_transaction_records_timestamp" ON "transaction_records" ("timestamp");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_transaction_records_timestamp";
      DROP INDEX IF EXISTS "idx_transaction_records_block_number";
      DROP INDEX IF EXISTS "idx_transaction_records_tx_hash";
      DROP INDEX IF EXISTS "idx_transaction_records_wallet_subscription_id";
      
      DROP INDEX IF EXISTS "idx_wallet_subscriptions_active";
      DROP INDEX IF EXISTS "idx_wallet_subscriptions_blockchain_network";
      DROP INDEX IF EXISTS "idx_wallet_subscriptions_token_address";
      DROP INDEX IF EXISTS "idx_wallet_subscriptions_wallet_address";
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "transaction_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "wallet_subscriptions"`);
  }
}
