import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductsCa1765731229943 implements MigrationInterface {
    name = 'AddProductsCa1765731229943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfDeliverables"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfRevisions"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "duration" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfDeliverables" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfRevisions" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "influencer_category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfRevisions"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfDeliverables"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfRevisions" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfDeliverables" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "duration" integer NOT NULL DEFAULT '1'`);
    }

}
