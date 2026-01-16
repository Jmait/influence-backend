import { MigrationInterface, QueryRunner } from 'typeorm';

export class Customer1768331359909 implements MigrationInterface {
  name = 'Customer1768331359909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "influencerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "influencerId" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "influencerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "influencerId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "deletedAt"`);
  }
}
