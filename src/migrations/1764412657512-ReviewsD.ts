import { MigrationInterface, QueryRunner } from "typeorm";

export class ReviewsD1764412657512 implements MigrationInterface {
    name = 'ReviewsD1764412657512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_reviews" ("reviewId" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "rating" integer NOT NULL DEFAULT '0', "userId" uuid NOT NULL, "productId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b63c24c493a2207e6e0a8afa3e0" PRIMARY KEY ("reviewId"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "influencerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_6dcfe10709418f862d234f42459" FOREIGN KEY ("influencerId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_reviews" ADD CONSTRAINT "FK_964f13abf796aca25d7e5849c64" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_reviews" DROP CONSTRAINT "FK_964f13abf796aca25d7e5849c64"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_6dcfe10709418f862d234f42459"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "influencerId"`);
        await queryRunner.query(`DROP TABLE "product_reviews"`);
    }

}
