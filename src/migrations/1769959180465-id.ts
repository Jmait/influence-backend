import { MigrationInterface, QueryRunner } from "typeorm";

export class Id1769959180465 implements MigrationInterface {
    name = 'Id1769959180465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "uploaded_files" DROP CONSTRAINT "PK_8b951cc1834cfef01eda81ccf0c"`);
        await queryRunner.query(`ALTER TABLE "uploaded_files" DROP COLUMN "fileId"`);
        await queryRunner.query(`ALTER TABLE "uploaded_files" ADD "fileId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "uploaded_files" ADD CONSTRAINT "PK_8b951cc1834cfef01eda81ccf0c" PRIMARY KEY ("fileId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_files" DROP CONSTRAINT "PK_8b951cc1834cfef01eda81ccf0c"`);
        await queryRunner.query(`ALTER TABLE "uploaded_files" DROP COLUMN "fileId"`);
        await queryRunner.query(`ALTER TABLE "uploaded_files" ADD "fileId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploaded_files" ADD CONSTRAINT "PK_8b951cc1834cfef01eda81ccf0c" PRIMARY KEY ("fileId")`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
    }

}
