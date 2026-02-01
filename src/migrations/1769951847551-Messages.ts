import { MigrationInterface, QueryRunner } from "typeorm";

export class Messages1769951847551 implements MigrationInterface {
    name = 'Messages1769951847551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."conversations_type_enum" AS ENUM('private', 'group')`);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "participant1Id" character varying(255) NOT NULL, "participant2Id" character varying(255) NOT NULL, "conversationHash" character varying(512) NOT NULL, "type" "public"."conversations_type_enum" NOT NULL DEFAULT 'private', "lastMessageContent" text, "lastMessageSenderId" character varying(255), "lastMessageAt" TIMESTAMP, "unreadCounts" jsonb NOT NULL DEFAULT '{}', "participantSettings" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_920822df89de614a7d3c239b25" ON "conversations" ("participant1Id") `);
        await queryRunner.query(`CREATE INDEX "IDX_faf08edf3ad07ff4a95e62b996" ON "conversations" ("participant2Id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_df54e584b944cac3ea01927cd3" ON "conversations" ("conversationHash") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c3bc5898563648a97829b4637d" ON "conversations" ("participant1Id", "participant2Id") `);
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum" AS ENUM('text', 'image', 'file', 'audio', 'video', 'system')`);
        await queryRunner.query(`CREATE TYPE "public"."messages_status_enum" AS ENUM('pending', 'sent', 'delivered', 'read', 'failed')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conversationId" uuid NOT NULL, "senderId" character varying(255) NOT NULL, "receiverId" character varying(255) NOT NULL, "attachments" jsonb, "content" text, "replyToMessageId" uuid, "type" "public"."messages_type_enum" NOT NULL DEFAULT 'text', "status" "public"."messages_status_enum" NOT NULL DEFAULT 'pending', "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deliveredAt" TIMESTAMP, "readAt" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e5663ce0c730b2de83445e2fd1" ON "messages" ("conversationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4e18c5bd9344f845152f61f5c5" ON "messages" ("replyToMessageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_befd307485dbf0559d17e4a4d2" ON "messages" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_dd5c3c9edebbccba85b3a6d62f" ON "messages" ("receiverId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_40dc3de52ed041e48cfb116f2a" ON "messages" ("senderId", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "uploaded_files" ("fileId" SERIAL NOT NULL, "url" text, "type" text, "size" integer, "status" character varying NOT NULL DEFAULT 'TEMP', "name" text, "thumbnail" text, CONSTRAINT "PK_8b951cc1834cfef01eda81ccf0c" PRIMARY KEY ("fileId"))`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`DROP TABLE "uploaded_files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40dc3de52ed041e48cfb116f2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dd5c3c9edebbccba85b3a6d62f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_befd307485dbf0559d17e4a4d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e18c5bd9344f845152f61f5c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5663ce0c730b2de83445e2fd1"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3bc5898563648a97829b4637d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df54e584b944cac3ea01927cd3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_faf08edf3ad07ff4a95e62b996"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_920822df89de614a7d3c239b25"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP TYPE "public"."conversations_type_enum"`);
    }

}
