import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateShop1765729639130 implements MigrationInterface {
    name = 'UpdateShop1765729639130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfDeliverables"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfRevisions"`);
        await queryRunner.query(`ALTER TABLE "shops" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "shops" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "shops" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "duration" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfDeliverables" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfRevisions" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfRevisions"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfDeliverables"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfRevisions" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfDeliverables" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "duration" integer NOT NULL DEFAULT '1'`);
    }

}
