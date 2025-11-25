import { MigrationInterface, QueryRunner } from "typeorm";

export class ShopsMigrations1763806040629 implements MigrationInterface {
    name = 'ShopsMigrations1763806040629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "shops" ADD "rating" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "shops" ADD "influencerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD "rating" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "shopId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "influencerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "shopShopId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD "influencerInfluencerProfileId" uuid`);
        await queryRunner.query(`ALTER TABLE "shops" ALTER COLUMN "logo" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "shops" ADD CONSTRAINT "FK_e8a4f3bbcaabf6a41cb79bc8b6a" FOREIGN KEY ("influencerId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_86d47f6130c1a8c4bb796d220b2" FOREIGN KEY ("shopShopId") REFERENCES "shops"("shopId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_98d26773cd7bef0ec9db06fff2e" FOREIGN KEY ("influencerInfluencerProfileId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_98d26773cd7bef0ec9db06fff2e"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_86d47f6130c1a8c4bb796d220b2"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP CONSTRAINT "FK_e8a4f3bbcaabf6a41cb79bc8b6a"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "shops" ALTER COLUMN "logo" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "influencerInfluencerProfileId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "shopShopId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "influencerId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "shopId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "influencerId"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "shops" ADD "userId" character varying NOT NULL`);
    }

}
