import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceCategory1764407964514 implements MigrationInterface {
    name = 'ServiceCategory1764407964514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "channel"`);
        await queryRunner.query(`ALTER TABLE "influencer_service_categories" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "serviceCategoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "influencerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_sub_category" ADD CONSTRAINT "FK_b21ae1c66e478e1a7da0a1de49f" FOREIGN KEY ("categoryId") REFERENCES "influencer_category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ADD CONSTRAINT "FK_6409a81c77c0bfd8da5c922e334" FOREIGN KEY ("categoryId") REFERENCES "influencer_category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP CONSTRAINT "FK_6409a81c77c0bfd8da5c922e334"`);
        await queryRunner.query(`ALTER TABLE "influencer_sub_category" DROP CONSTRAINT "FK_b21ae1c66e478e1a7da0a1de49f"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "influencerId"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "serviceCategoryId"`);
        await queryRunner.query(`ALTER TABLE "influencer_service_categories" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "channel" character varying NOT NULL`);
    }

}
