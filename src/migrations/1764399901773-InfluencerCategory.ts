import { MigrationInterface, QueryRunner } from "typeorm";

export class InfluencerCategory1764399901773 implements MigrationInterface {
    name = 'InfluencerCategory1764399901773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_86d47f6130c1a8c4bb796d220b2"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_98d26773cd7bef0ec9db06fff2e"`);
        await queryRunner.query(`CREATE TABLE "influencer_category" ("categoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "categoryName" character varying(255) NOT NULL, CONSTRAINT "PK_29af31a081d5b164f39cd4643fd" PRIMARY KEY ("categoryId"))`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "shopShopId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "influencerInfluencerProfileId"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_51a281693ebef6fa8729de39381" FOREIGN KEY ("shopId") REFERENCES "shops"("shopId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_81521a19ff601d9f4d03c8ad2e7" FOREIGN KEY ("influencerId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_81521a19ff601d9f4d03c8ad2e7"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_51a281693ebef6fa8729de39381"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "influencerInfluencerProfileId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD "shopShopId" uuid`);
        await queryRunner.query(`DROP TABLE "influencer_category"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_98d26773cd7bef0ec9db06fff2e" FOREIGN KEY ("influencerInfluencerProfileId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_86d47f6130c1a8c4bb796d220b2" FOREIGN KEY ("shopShopId") REFERENCES "shops"("shopId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
