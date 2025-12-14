import { MigrationInterface, QueryRunner } from "typeorm";

export class InitiaM1765737140994 implements MigrationInterface {
    name = 'InitiaM1765737140994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallets" ("walletId" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" numeric NOT NULL DEFAULT '0', "influencerId" uuid NOT NULL, CONSTRAINT "PK_8e246dfcb84930971b5300d8cad" PRIMARY KEY ("walletId"))`);
        await queryRunner.query(`CREATE TABLE "shops" ("shopId" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" numeric NOT NULL DEFAULT '0', "name" character varying NOT NULL, "location" character varying, "influencerId" uuid NOT NULL, "deletedAt" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "logo" character varying, "categoryId" character varying, "coverImage" character varying, CONSTRAINT "PK_9f4bc3ba7b97bcb7ddf16fe9b41" PRIMARY KEY ("shopId"))`);
        await queryRunner.query(`CREATE TABLE "product_variants" ("variantId" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "variantName" character varying NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', "price" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_90b67f84bca93c86bf08a1332b9" PRIMARY KEY ("variantId"))`);
        await queryRunner.query(`CREATE TABLE "influencer_sub_category" ("subCategoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "subCategoryName" character varying(255) NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_af9c300ae1182402b45adb52ad5" PRIMARY KEY ("subCategoryId"))`);
        await queryRunner.query(`CREATE TABLE "influencer_category" ("categoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "categoryName" character varying(255) NOT NULL, CONSTRAINT "PK_29af31a081d5b164f39cd4643fd" PRIMARY KEY ("categoryId"))`);
        await queryRunner.query(`CREATE TABLE "products" ("productId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "image" character varying, "sku" character varying, "price" numeric NOT NULL, "rating" numeric NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "shopId" uuid NOT NULL, "categoryId" uuid, "quantity" numeric NOT NULL DEFAULT '0', "deliveryFee" numeric NOT NULL DEFAULT '0', "productTerms" text, "influencerId" uuid NOT NULL, "deletedAt" TIMESTAMP, "description" character varying, CONSTRAINT "PK_7b3b507508cd0f86a5b2e923459" PRIMARY KEY ("productId"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("reviewId" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "rating" integer NOT NULL DEFAULT '0', "userId" uuid NOT NULL, "influencerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fded04e5e4fb901d8566443e6f1" PRIMARY KEY ("reviewId"))`);
        await queryRunner.query(`CREATE TABLE "influencer_profiles" ("influencerProfileId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "username" text NOT NULL, "categoryId" uuid NOT NULL, "subCategoryId" uuid NOT NULL, "bio" text, "location" text, "verified" boolean NOT NULL DEFAULT false, "socialMedia" jsonb DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}', "totalFollowers" integer NOT NULL DEFAULT '0', "averageEngagement" numeric(5,2) NOT NULL DEFAULT '0', "collaborationCount" integer NOT NULL DEFAULT '0', "rating" numeric(3,2) NOT NULL DEFAULT '0', "ratingCount" integer NOT NULL DEFAULT '0', "coverImage" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b03b66c17d5d984a142bfc24bd5" UNIQUE ("userId"), CONSTRAINT "UQ_d0a4db1c825a3a809654e115e51" UNIQUE ("username"), CONSTRAINT "REL_b03b66c17d5d984a142bfc24bd" UNIQUE ("userId"), CONSTRAINT "PK_d64d41c506dd7834d7768d471ab" PRIMARY KEY ("influencerProfileId"))`);
        await queryRunner.query(`CREATE INDEX "idx_influencer_profiles_username" ON "influencer_profiles" ("username") `);
        await queryRunner.query(`CREATE INDEX "idx_influencer_profiles_verified" ON "influencer_profiles" ("verified") `);
        await queryRunner.query(`CREATE INDEX "idx_influencer_profiles_total_followers" ON "influencer_profiles" ("totalFollowers") `);
        await queryRunner.query(`CREATE TYPE "public"."order_items_type_enum" AS ENUM('PRODUCT', 'CAMPAIGN')`);
        await queryRunner.query(`CREATE TABLE "order_items" ("orderItemId" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" uuid NOT NULL, "productId" uuid NOT NULL, "name" character varying, "type" "public"."order_items_type_enum", "price" numeric NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', CONSTRAINT "PK_4e1bb5fea3ad96dcc899be6cc7d" PRIMARY KEY ("orderItemId"))`);
        await queryRunner.query(`CREATE TABLE "shipping_address" ("addressId" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "customerId" character varying NOT NULL, "city" character varying, "postalCode" character varying NOT NULL, "lastName" character varying NOT NULL, "addressLine1" character varying NOT NULL, "isBillingAddress" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "additionalAddress" character varying, CONSTRAINT "PK_454fd71d8fe294df764328b391c" PRIMARY KEY ("addressId"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("orderId" uuid NOT NULL DEFAULT uuid_generate_v4(), "reference" character varying, "userId" uuid NOT NULL, "influencerId" uuid NOT NULL, "paymentStatus" character varying NOT NULL DEFAULT 'PENDING', "status" character varying NOT NULL DEFAULT 'PENDING', "deliveredAt" TIMESTAMP, "totalPrice" numeric NOT NULL, "shippingAddressId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "shippingAddressAddressId" uuid, CONSTRAINT "PK_41ba27842ac1a2c24817ca59eaa" PRIMARY KEY ("orderId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "type" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "product_reviews" ("reviewId" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "rating" integer NOT NULL DEFAULT '0', "userId" uuid NOT NULL, "productId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b63c24c493a2207e6e0a8afa3e0" PRIMARY KEY ("reviewId"))`);
        await queryRunner.query(`CREATE TABLE "influencer_services" ("serviceId" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceCategoryId" uuid NOT NULL, "influencerId" uuid NOT NULL, "title" character varying(255) NOT NULL, "price" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" text NOT NULL, CONSTRAINT "PK_0bc8c8f38665f6c15ccf66fada7" PRIMARY KEY ("serviceId"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "influencerId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "influencer_service_categories" ("serviceCategoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "PK_b87e72fc7fb280551b99c9ba36a" PRIMARY KEY ("serviceCategoryId"))`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "duration" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfDeliverables" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "influencer_services" ADD "numberOfRevisions" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "shops" ADD CONSTRAINT "FK_e8a4f3bbcaabf6a41cb79bc8b6a" FOREIGN KEY ("influencerId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "influencer_sub_category" ADD CONSTRAINT "FK_b21ae1c66e478e1a7da0a1de49f" FOREIGN KEY ("categoryId") REFERENCES "influencer_category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_51a281693ebef6fa8729de39381" FOREIGN KEY ("shopId") REFERENCES "shops"("shopId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_81521a19ff601d9f4d03c8ad2e7" FOREIGN KEY ("influencerId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "influencer_category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_6dcfe10709418f862d234f42459" FOREIGN KEY ("influencerId") REFERENCES "influencer_profiles"("influencerProfileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ADD CONSTRAINT "FK_b03b66c17d5d984a142bfc24bd5" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ADD CONSTRAINT "FK_6409a81c77c0bfd8da5c922e334" FOREIGN KEY ("categoryId") REFERENCES "influencer_category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b00245905a128a98c85b203acd3" FOREIGN KEY ("shippingAddressAddressId") REFERENCES "shipping_address"("addressId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_reviews" ADD CONSTRAINT "FK_964f13abf796aca25d7e5849c64" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_reviews" DROP CONSTRAINT "FK_964f13abf796aca25d7e5849c64"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b00245905a128a98c85b203acd3"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP CONSTRAINT "FK_6409a81c77c0bfd8da5c922e334"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP CONSTRAINT "FK_b03b66c17d5d984a142bfc24bd5"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_6dcfe10709418f862d234f42459"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_81521a19ff601d9f4d03c8ad2e7"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_51a281693ebef6fa8729de39381"`);
        await queryRunner.query(`ALTER TABLE "influencer_sub_category" DROP CONSTRAINT "FK_b21ae1c66e478e1a7da0a1de49f"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`);
        await queryRunner.query(`ALTER TABLE "shops" DROP CONSTRAINT "FK_e8a4f3bbcaabf6a41cb79bc8b6a"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfRevisions"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "numberOfDeliverables"`);
        await queryRunner.query(`ALTER TABLE "influencer_services" DROP COLUMN "duration"`);
        await queryRunner.query(`DROP TABLE "influencer_service_categories"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "influencer_services"`);
        await queryRunner.query(`DROP TABLE "product_reviews"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "shipping_address"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TYPE "public"."order_items_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_influencer_profiles_total_followers"`);
        await queryRunner.query(`DROP INDEX "public"."idx_influencer_profiles_verified"`);
        await queryRunner.query(`DROP INDEX "public"."idx_influencer_profiles_username"`);
        await queryRunner.query(`DROP TABLE "influencer_profiles"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "influencer_category"`);
        await queryRunner.query(`DROP TABLE "influencer_sub_category"`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
        await queryRunner.query(`DROP TABLE "shops"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
    }

}
