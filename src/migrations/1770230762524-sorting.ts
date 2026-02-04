import { MigrationInterface, QueryRunner } from "typeorm";

export class Sorting1770230762524 implements MigrationInterface {
    name = 'Sorting1770230762524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shops" ADD "suspendedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ADD "blockedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "cancelledAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "returnedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "returnedAt"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cancelledAt"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP COLUMN "blockedAt"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "suspendedAt"`);
    }

}
