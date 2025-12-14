import { MigrationInterface, QueryRunner } from "typeorm";

export class ShippingU1765708857583 implements MigrationInterface {
    name = 'ShippingU1765708857583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingAddressId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingAddressAddressId" uuid`);
        await queryRunner.query(`ALTER TABLE "shipping_address" ADD "isBillingAddress" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "shipping_address" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b00245905a128a98c85b203acd3" FOREIGN KEY ("shippingAddressAddressId") REFERENCES "shipping_address"("addressId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b00245905a128a98c85b203acd3"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "shipping_address" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "shipping_address" DROP COLUMN "isBillingAddress"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingAddressAddressId"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingAddressId"`);
    }

}
