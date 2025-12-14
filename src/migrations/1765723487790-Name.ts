import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1765723487790 implements MigrationInterface {
    name = 'Name1765723487790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "reference" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveredAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveredAt"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "reference"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "name"`);
    }

}
