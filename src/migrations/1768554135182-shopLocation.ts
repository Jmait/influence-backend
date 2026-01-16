import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShopLocation1768554135182 implements MigrationInterface {
  name = 'ShopLocation1768554135182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "location"`);
    await queryRunner.query(
      `ALTER TABLE "shops" ADD "locationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shops" ADD "locationLat" numeric(10,7) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shops" ADD "locationLng" numeric(10,7) NOT NULL`,
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
    await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "locationLng"`);
    await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "locationLat"`);
    await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "locationName"`);
    await queryRunner.query(
      `ALTER TABLE "shops" ADD "location" character varying`,
    );
  }
}
