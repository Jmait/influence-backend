import { MigrationInterface, QueryRunner } from "typeorm";

export class Cas1769960783841 implements MigrationInterface {
    name = 'Cas1769960783841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3bc5898563648a97829b4637d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_920822df89de614a7d3c239b25"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "participant1Id"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "participant1Id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_faf08edf3ad07ff4a95e62b996"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "participant2Id"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "participant2Id" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_920822df89de614a7d3c239b25" ON "conversations" ("participant1Id") `);
        await queryRunner.query(`CREATE INDEX "IDX_faf08edf3ad07ff4a95e62b996" ON "conversations" ("participant2Id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c3bc5898563648a97829b4637d" ON "conversations" ("participant1Id", "participant2Id") `);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_920822df89de614a7d3c239b259" FOREIGN KEY ("participant1Id") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_faf08edf3ad07ff4a95e62b9969" FOREIGN KEY ("participant2Id") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_faf08edf3ad07ff4a95e62b9969"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_920822df89de614a7d3c239b259"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3bc5898563648a97829b4637d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_faf08edf3ad07ff4a95e62b996"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_920822df89de614a7d3c239b25"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "participant2Id"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "participant2Id" character varying(255) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_faf08edf3ad07ff4a95e62b996" ON "conversations" ("participant2Id") `);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "participant1Id"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "participant1Id" character varying(255) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_920822df89de614a7d3c239b25" ON "conversations" ("participant1Id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c3bc5898563648a97829b4637d" ON "conversations" ("participant1Id", "participant2Id") `);
        await queryRunner.query(`ALTER TABLE "influencer_profiles" ALTER COLUMN "socialMedia" SET DEFAULT '{"tiktok": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "instagram": {"handle": "", "followers": 0}}'`);
    }

}
