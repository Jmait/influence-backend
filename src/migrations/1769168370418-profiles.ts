import { MigrationInterface, QueryRunner } from "typeorm";

export class Profiles1769168370418 implements MigrationInterface {
    name = 'Profiles1769168370418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ADD "profileImages" text array`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" text`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP COLUMN "profileImages"`);
    }

}
