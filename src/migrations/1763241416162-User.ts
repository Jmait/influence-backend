import { MigrationInterface, QueryRunner } from "typeorm";

export class User1763241416162 implements MigrationInterface {
    name = 'User1763241416162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shops" ("shopId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" character varying NOT NULL, "logo" character varying NOT NULL, "categoryId" character varying, "coverImage" character varying, CONSTRAINT "PK_9f4bc3ba7b97bcb7ddf16fe9b41" PRIMARY KEY ("shopId"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("reviewId" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "rating" integer NOT NULL DEFAULT '0', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fded04e5e4fb901d8566443e6f1" PRIMARY KEY ("reviewId"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("orderId" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" character varying NOT NULL, "userId" character varying NOT NULL, "quantity" integer NOT NULL, "totalPrice" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_41ba27842ac1a2c24817ca59eaa" PRIMARY KEY ("orderId"))`);
        await queryRunner.query(`CREATE TABLE "products" ("productId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric NOT NULL, "description" character varying, CONSTRAINT "PK_7b3b507508cd0f86a5b2e923459" PRIMARY KEY ("productId"))`);
        await queryRunner.query(`CREATE TABLE "influencer_service_categories" ("serviceCategoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_b87e72fc7fb280551b99c9ba36a" PRIMARY KEY ("serviceCategoryId"))`);
        await queryRunner.query(`CREATE TABLE "influencer_services" ("serviceId" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "channel" character varying NOT NULL, "price" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying NOT NULL, CONSTRAINT "PK_0bc8c8f38665f6c15ccf66fada7" PRIMARY KEY ("serviceId"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("customerId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_0d6a9c16d0c9bacffc0a784a186" PRIMARY KEY ("customerId"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "influencer_services"`);
        await queryRunner.query(`DROP TABLE "influencer_service_categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "shops"`);
    }

}
