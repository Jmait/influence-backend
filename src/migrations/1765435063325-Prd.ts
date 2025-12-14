import { MigrationInterface, QueryRunner } from "typeorm";

export class Prd1765435063325 implements MigrationInterface {
    name = 'Prd1765435063325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_7fdb8279503d87a8b6a1880e3d4"`);
        await queryRunner.query(`CREATE TABLE "product_variants" ("variantId" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "variantName" character varying NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', "price" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_90b67f84bca93c86bf08a1332b9" PRIMARY KEY ("variantId"))`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "orderOrderId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sku" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "deliveryFee" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "productTerms" text`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "quantity" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "productTerms"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deliveryFee"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sku"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "orderOrderId" uuid`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_7fdb8279503d87a8b6a1880e3d4" FOREIGN KEY ("orderOrderId") REFERENCES "orders"("orderId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
