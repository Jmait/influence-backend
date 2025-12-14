import { MigrationInterface, QueryRunner } from "typeorm";

export class Customer1765451456306 implements MigrationInterface {
    name = 'Customer1765451456306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_0d6a9c16d0c9bacffc0a784a186"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_b4c7d225ecd216d52587d298dcd" PRIMARY KEY ("customerId", "id")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "influencerId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_b4c7d225ecd216d52587d298dcd"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "customerId" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "customerId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_133ec679a801fab5e070f73d3ea"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_b4c7d225ecd216d52587d298dcd" PRIMARY KEY ("customerId", "id")`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "influencerId"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_b4c7d225ecd216d52587d298dcd"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_0d6a9c16d0c9bacffc0a784a186" PRIMARY KEY ("customerId")`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "userId" character varying NOT NULL`);
    }

}
