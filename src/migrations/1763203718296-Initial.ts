import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1763203718296 implements MigrationInterface {
    name = 'Initial1763203718296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "influencer_profiles" ("influencerProfileId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "username" text NOT NULL, "categoryId" uuid NOT NULL, "subCategoryId" uuid NOT NULL, "bio" text, "location" text, "verified" boolean NOT NULL DEFAULT false, "socialMedia" jsonb DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}', "totalFollowers" integer NOT NULL DEFAULT '0', "averageEngagement" numeric(5,2) NOT NULL DEFAULT '0', "collaborationCount" integer NOT NULL DEFAULT '0', "rating" numeric(3,2) NOT NULL DEFAULT '0', "ratingCount" integer NOT NULL DEFAULT '0', "coverImage" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b03b66c17d5d984a142bfc24bd5" UNIQUE ("userId"), CONSTRAINT "UQ_d0a4db1c825a3a809654e115e51" UNIQUE ("username"), CONSTRAINT "REL_b03b66c17d5d984a142bfc24bd" UNIQUE ("userId"), CONSTRAINT "PK_d64d41c506dd7834d7768d471ab" PRIMARY KEY ("influencerProfileId"))`);
        await queryRunner.query(`CREATE INDEX "idx_influencer_profiles_username" ON "influencer_profiles" ("username") `);
        await queryRunner.query(`CREATE INDEX "idx_influencer_profiles_verified" ON "influencer_profiles" ("verified") `);
        await queryRunner.query(`CREATE INDEX "idx_influencer_profiles_total_followers" ON "influencer_profiles" ("totalFollowers") `);
        await queryRunner.query(`CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ADD CONSTRAINT "FK_b03b66c17d5d984a142bfc24bd5" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP CONSTRAINT "FK_b03b66c17d5d984a142bfc24bd5"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."idx_influencer_profiles_total_followers"`);
        await queryRunner.query(`DROP INDEX "public"."idx_influencer_profiles_verified"`);
        await queryRunner.query(`DROP INDEX "public"."idx_influencer_profiles_username"`);
        await queryRunner.query(`DROP TABLE "influencer_profiles"`);
    }

}
