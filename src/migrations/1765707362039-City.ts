import { MigrationInterface, QueryRunner } from "typeorm";

export class City1765707362039 implements MigrationInterface {
    name = 'City1765707362039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_address" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "shipping_address" DROP CONSTRAINT "PK_454fd71d8fe294df764328b391c"`);
        await queryRunner.query(`ALTER TABLE "shipping_address" DROP COLUMN "addressId"`);
        await queryRunner.query(`ALTER TABLE "shipping_address" ADD "addressId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "shipping_address" ADD CONSTRAINT "PK_454fd71d8fe294df764328b391c" PRIMARY KEY ("addressId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_address" DROP CONSTRAINT "PK_454fd71d8fe294df764328b391c"`);
        await queryRunner.query(`ALTER TABLE "shipping_address" DROP COLUMN "addressId"`);
        await queryRunner.query(`ALTER TABLE "shipping_address" ADD "addressId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipping_address" ADD CONSTRAINT "PK_454fd71d8fe294df764328b391c" PRIMARY KEY ("addressId")`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "shipping_address" DROP COLUMN "city"`);
    }

}
