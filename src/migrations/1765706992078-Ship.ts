import { MigrationInterface, QueryRunner } from "typeorm";

export class Ship1765706992078 implements MigrationInterface {
    name = 'Ship1765706992078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipping_address" ("addressId" SERIAL NOT NULL, "firstName" character varying NOT NULL, "customerId" character varying NOT NULL, "postalCode" character varying NOT NULL, "lastName" character varying NOT NULL, "addressLine1" character varying NOT NULL, "additionalAddress" character varying, CONSTRAINT "PK_454fd71d8fe294df764328b391c" PRIMARY KEY ("addressId"))`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`DROP TABLE "shipping_address"`);
    }

}
