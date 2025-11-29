import { MigrationInterface, QueryRunner } from "typeorm";

export class SubCategory1764400369151 implements MigrationInterface {
    name = 'SubCategory1764400369151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "influencer_sub_category" ("subCategoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "subCategoryName" character varying(255) NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_af9c300ae1182402b45adb52ad5" PRIMARY KEY ("subCategoryId"))`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`DROP TABLE "influencer_sub_category"`);
    }

}
