import { MigrationInterface, QueryRunner } from "typeorm";

export class Products1769155853061 implements MigrationInterface {
    name = 'Products1769155853061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "image" TO "images"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" text array`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" character varying`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "images" TO "image"`);
    }

}
