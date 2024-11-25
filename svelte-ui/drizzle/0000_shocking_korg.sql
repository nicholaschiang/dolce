-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."Level" AS ENUM('BESPOKE', 'COUTURE', 'HANDMADE', 'RTW');--> statement-breakpoint
CREATE TYPE "public"."Location" AS ENUM('NEW_YORK', 'LONDON', 'MILAN', 'PARIS', 'TOKYO', 'BERLIN', 'FLORENCE', 'LOS_ANGELES', 'MADRID', 'COPENHAGEN', 'SHANGHAI', 'AUSTRALIA', 'STOCKHOLM', 'MEXICO', 'MEXICO_CITY', 'KIEV', 'TBILISI', 'SEOUL', 'RUSSIA', 'UKRAINE', 'SAO_PAOLO', 'BRIDAL');--> statement-breakpoint
CREATE TYPE "public"."Market" AS ENUM('PRIMARY', 'SECONDARY');--> statement-breakpoint
CREATE TYPE "public"."SeasonName" AS ENUM('RESORT', 'SPRING', 'PRE_FALL', 'FALL');--> statement-breakpoint
CREATE TYPE "public"."Sex" AS ENUM('MAN', 'WOMAN', 'UNISEX');--> statement-breakpoint
CREATE TYPE "public"."Sustainability" AS ENUM('RECYCLED', 'ORGANIC', 'RESPONSIBLE_DOWN', 'RESPONSIBLE_FORESTRY', 'RESPONSIBLE_WOOL', 'RESPONSIBLE_CASHMERE');--> statement-breakpoint
CREATE TYPE "public"."Tier" AS ENUM('BESPOKE', 'SUPERPREMIUM', 'PREMIUM_CORE', 'ACCESSIBLE_CORE', 'AFFORDABLE_LUXURY', 'DIFFUSION', 'HIGH_STREET', 'MID_STREET', 'VALUE_MARKET');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Password" (
	"hash" text NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"email" text,
	"name" text NOT NULL,
	"username" text,
	"id" serial PRIMARY KEY NOT NULL,
	"countryId" integer,
	"avatar" text,
	"url" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"description" text,
	"curator" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BrandToProduct" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BrandToRetailer" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_CountryToRetailer" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_SizeEquivalents" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Company" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"countryId" integer NOT NULL,
	"avatar" text,
	"url" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Brand" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"companyId" integer,
	"countryId" integer,
	"tier" "Tier",
	"avatar" text,
	"url" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Country" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Season" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"name" "SeasonName" NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Show" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date" timestamp(3),
	"videoId" integer,
	"url" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designedAt" timestamp(3) NOT NULL,
	"releasedAt" timestamp(3) NOT NULL,
	"level" "Level" NOT NULL,
	"msrp" numeric(65, 30),
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Collection" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"styleId" integer,
	"seasonId" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"articlesConsensus" text,
	"brandId" integer NOT NULL,
	"date" timestamp(3),
	"description" text,
	"level" "Level" NOT NULL,
	"location" "Location",
	"reviewsConsensus" text,
	"sex" "Sex" NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Price" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" numeric(65, 30) NOT NULL,
	"market" "Market" NOT NULL,
	"url" text NOT NULL,
	"retailerId" integer,
	"brandId" integer,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"variantId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Retailer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"companyId" integer,
	"avatar" text,
	"url" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ProductToStyle" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_CollectionToProduct" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Image" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lookId" integer,
	"height" integer,
	"position" integer,
	"width" integer,
	"postId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Video" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"mimeType" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"postId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Color" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Style" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parentId" integer,
	"styleGroupId" integer,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ColorToVariant" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Variant" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"sizeId" integer NOT NULL,
	"sku" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_MaterialToVariant" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Material" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sustainability" "Sustainability",
	"parentId" integer,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StyleGroup" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ProductToUser" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_CollectionToUser" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_LookToProduct" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Link" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"collectionId" integer,
	"brandId" integer,
	"retailerId" integer,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Publication" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatar" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Look" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"modelId" integer,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"authorId" integer,
	"collectionId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Review" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"authorId" integer NOT NULL,
	"score" numeric(65, 30) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"collectionId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Board" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"authorId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Article" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"writtenAt" timestamp(3),
	"url" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"summary" text,
	"content" text NOT NULL,
	"score" numeric(65, 30),
	"authorId" integer,
	"userId" integer,
	"publicationId" integer NOT NULL,
	"collectionId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Size" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"chest" numeric(65, 30),
	"shoulder" numeric(65, 30),
	"waist" numeric(65, 30),
	"sleeve" numeric(65, 30),
	"brandId" integer,
	"countryId" integer,
	"sex" "Sex" NOT NULL,
	"styleId" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_VariantToVideo" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BoardToLook" (
	"B" integer NOT NULL,
	"A" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ImageToVariant" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_TagToVariant" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BoardToVariant" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"authorId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ColorToItem" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Item" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ItemToStyle" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ItemToProduct" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_ItemToPost" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_LookToPost" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_PostToProduct" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_PostToVariant" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_CollectionToShow" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BrandToProduct" ADD CONSTRAINT "_BrandToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BrandToProduct" ADD CONSTRAINT "_BrandToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BrandToRetailer" ADD CONSTRAINT "_BrandToRetailer_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BrandToRetailer" ADD CONSTRAINT "_BrandToRetailer_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Retailer"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CountryToRetailer" ADD CONSTRAINT "_CountryToRetailer_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Country"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CountryToRetailer" ADD CONSTRAINT "_CountryToRetailer_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Retailer"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_SizeEquivalents" ADD CONSTRAINT "_SizeEquivalents_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Size"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_SizeEquivalents" ADD CONSTRAINT "_SizeEquivalents_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Size"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Company" ADD CONSTRAINT "Company_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Brand" ADD CONSTRAINT "Brand_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Brand" ADD CONSTRAINT "Brand_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Show" ADD CONSTRAINT "Show_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Collection" ADD CONSTRAINT "Collection_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Collection" ADD CONSTRAINT "Collection_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Collection" ADD CONSTRAINT "Collection_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Price" ADD CONSTRAINT "Price_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "public"."Retailer"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Price" ADD CONSTRAINT "Price_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Price" ADD CONSTRAINT "Price_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Retailer" ADD CONSTRAINT "Retailer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ProductToStyle" ADD CONSTRAINT "_ProductToStyle_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ProductToStyle" ADD CONSTRAINT "_ProductToStyle_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Style"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CollectionToProduct" ADD CONSTRAINT "_CollectionToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Collection"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CollectionToProduct" ADD CONSTRAINT "_CollectionToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Image" ADD CONSTRAINT "Image_lookId_fkey" FOREIGN KEY ("lookId") REFERENCES "public"."Look"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Video" ADD CONSTRAINT "Video_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Style" ADD CONSTRAINT "Style_styleGroupId_fkey" FOREIGN KEY ("styleGroupId") REFERENCES "public"."StyleGroup"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Style" ADD CONSTRAINT "Style_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Style"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ColorToVariant" ADD CONSTRAINT "_ColorToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Color"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ColorToVariant" ADD CONSTRAINT "_ColorToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Variant" ADD CONSTRAINT "Variant_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."Size"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_MaterialToVariant" ADD CONSTRAINT "_MaterialToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Material"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_MaterialToVariant" ADD CONSTRAINT "_MaterialToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Material" ADD CONSTRAINT "Material_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Material"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ProductToUser" ADD CONSTRAINT "_ProductToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ProductToUser" ADD CONSTRAINT "_ProductToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CollectionToUser" ADD CONSTRAINT "_CollectionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Collection"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CollectionToUser" ADD CONSTRAINT "_CollectionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_LookToProduct" ADD CONSTRAINT "_LookToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Look"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_LookToProduct" ADD CONSTRAINT "_LookToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Link" ADD CONSTRAINT "Link_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Link" ADD CONSTRAINT "Link_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Link" ADD CONSTRAINT "Link_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "public"."Retailer"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Look" ADD CONSTRAINT "Look_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Look" ADD CONSTRAINT "Look_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Look" ADD CONSTRAINT "Look_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Review" ADD CONSTRAINT "Review_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Board" ADD CONSTRAINT "Board_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "public"."Publication"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Size" ADD CONSTRAINT "Size_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Size" ADD CONSTRAINT "Size_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Size" ADD CONSTRAINT "Size_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_VariantToVideo" ADD CONSTRAINT "_VariantToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_VariantToVideo" ADD CONSTRAINT "_VariantToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Video"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BoardToLook" ADD CONSTRAINT "_BoardToLook_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Board"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BoardToLook" ADD CONSTRAINT "_BoardToLook_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Look"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ImageToVariant" ADD CONSTRAINT "_ImageToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Image"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ImageToVariant" ADD CONSTRAINT "_ImageToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_TagToVariant" ADD CONSTRAINT "_TagToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_TagToVariant" ADD CONSTRAINT "_TagToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BoardToVariant" ADD CONSTRAINT "_BoardToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Board"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BoardToVariant" ADD CONSTRAINT "_BoardToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ColorToItem" ADD CONSTRAINT "_ColorToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Color"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ColorToItem" ADD CONSTRAINT "_ColorToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Item"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ItemToStyle" ADD CONSTRAINT "_ItemToStyle_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Item"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ItemToStyle" ADD CONSTRAINT "_ItemToStyle_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Style"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ItemToProduct" ADD CONSTRAINT "_ItemToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Item"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ItemToProduct" ADD CONSTRAINT "_ItemToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ItemToPost" ADD CONSTRAINT "_ItemToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Item"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ItemToPost" ADD CONSTRAINT "_ItemToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_LookToPost" ADD CONSTRAINT "_LookToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Look"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_LookToPost" ADD CONSTRAINT "_LookToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_PostToProduct" ADD CONSTRAINT "_PostToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_PostToProduct" ADD CONSTRAINT "_PostToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_PostToVariant" ADD CONSTRAINT "_PostToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_PostToVariant" ADD CONSTRAINT "_PostToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Variant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CollectionToShow" ADD CONSTRAINT "_CollectionToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Collection"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CollectionToShow" ADD CONSTRAINT "_CollectionToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Show"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Password_userId_key" ON "Password" USING btree ("userId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_avatar_key" ON "User" USING btree ("avatar" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_name_key" ON "User" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_url_key" ON "User" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User" USING btree ("username" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_BrandToProduct_AB_unique" ON "_BrandToProduct" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_BrandToProduct_B_index" ON "_BrandToProduct" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_BrandToRetailer_AB_unique" ON "_BrandToRetailer" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_BrandToRetailer_B_index" ON "_BrandToRetailer" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_CountryToRetailer_AB_unique" ON "_CountryToRetailer" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_CountryToRetailer_B_index" ON "_CountryToRetailer" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_SizeEquivalents_AB_unique" ON "_SizeEquivalents" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_SizeEquivalents_B_index" ON "_SizeEquivalents" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_avatar_key" ON "Company" USING btree ("avatar" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_name_key" ON "Company" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_url_key" ON "Company" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_avatar_key" ON "Brand" USING btree ("avatar" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_name_key" ON "Brand" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_slug_key" ON "Brand" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_url_key" ON "Brand" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Country_name_key" ON "Country" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Season_name_year_key" ON "Season" USING btree ("name" int4_ops,"year" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Show_name_key" ON "Show" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Show_url_key" ON "Show" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Show_videoId_key" ON "Show" USING btree ("videoId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Product_name_key" ON "Product" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Collection_brandId_seasonId_sex_level_location_key" ON "Collection" USING btree ("brandId" enum_ops,"seasonId" enum_ops,"sex" int4_ops,"level" enum_ops,"location" enum_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Collection_name_key" ON "Collection" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Collection_url_key" ON "Collection" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Price_variantId_value_url_key" ON "Price" USING btree ("variantId" int4_ops,"value" int4_ops,"url" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Retailer_avatar_key" ON "Retailer" USING btree ("avatar" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Retailer_name_key" ON "Retailer" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Retailer_url_key" ON "Retailer" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ProductToStyle_AB_unique" ON "_ProductToStyle" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ProductToStyle_B_index" ON "_ProductToStyle" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_CollectionToProduct_AB_unique" ON "_CollectionToProduct" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_CollectionToProduct_B_index" ON "_CollectionToProduct" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Image_url_key" ON "Image" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Video_url_key" ON "Video" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Color_name_key" ON "Color" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Style_name_key" ON "Style" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ColorToVariant_AB_unique" ON "_ColorToVariant" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ColorToVariant_B_index" ON "_ColorToVariant" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Variant_sku_key" ON "Variant" USING btree ("sku" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_MaterialToVariant_AB_unique" ON "_MaterialToVariant" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_MaterialToVariant_B_index" ON "_MaterialToVariant" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Material_name_key" ON "Material" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "StyleGroup_name_key" ON "StyleGroup" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ProductToUser_AB_unique" ON "_ProductToUser" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ProductToUser_B_index" ON "_ProductToUser" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_CollectionToUser_AB_unique" ON "_CollectionToUser" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_CollectionToUser_B_index" ON "_CollectionToUser" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_LookToProduct_AB_unique" ON "_LookToProduct" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_LookToProduct_B_index" ON "_LookToProduct" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Link_brandId_retailerId_key" ON "Link" USING btree ("brandId" int4_ops,"retailerId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Link_collectionId_brandId_key" ON "Link" USING btree ("collectionId" int4_ops,"brandId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Link_collectionId_retailerId_key" ON "Link" USING btree ("collectionId" int4_ops,"retailerId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Link_url_key" ON "Link" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Publication_avatar_key" ON "Publication" USING btree ("avatar" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Publication_name_key" ON "Publication" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Look_authorId_number_key" ON "Look" USING btree ("authorId" int4_ops,"number" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Look_collectionId_number_key" ON "Look" USING btree ("collectionId" int4_ops,"number" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Review_authorId_collectionId_key" ON "Review" USING btree ("authorId" int4_ops,"collectionId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Board_name_authorId_key" ON "Board" USING btree ("name" int4_ops,"authorId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Set_name_authorId_key" ON "Board" USING btree ("name" text_ops,"authorId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Article_authorId_collectionId_key" ON "Article" USING btree ("authorId" int4_ops,"collectionId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Article_publicationId_title_key" ON "Article" USING btree ("publicationId" text_ops,"title" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Article_url_key" ON "Article" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Size_name_sex_styleId_brandId_countryId_key" ON "Size" USING btree ("name" int4_ops,"sex" enum_ops,"styleId" text_ops,"brandId" text_ops,"countryId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Size_slug_key" ON "Size" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_VariantToVideo_AB_unique" ON "_VariantToVideo" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_VariantToVideo_B_index" ON "_VariantToVideo" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_BoardToLook_AB_unique" ON "_BoardToLook" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_BoardToLook_B_index" ON "_BoardToLook" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ImageToVariant_AB_unique" ON "_ImageToVariant" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ImageToVariant_B_index" ON "_ImageToVariant" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_TagToVariant_AB_unique" ON "_TagToVariant" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_TagToVariant_B_index" ON "_TagToVariant" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_BoardToVariant_AB_unique" ON "_BoardToVariant" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_BoardToVariant_B_index" ON "_BoardToVariant" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_SetToVariant_AB_unique" ON "_BoardToVariant" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_SetToVariant_B_index" ON "_BoardToVariant" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Post_url_key" ON "Post" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ColorToItem_AB_unique" ON "_ColorToItem" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ColorToItem_B_index" ON "_ColorToItem" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ItemToStyle_AB_unique" ON "_ItemToStyle" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ItemToStyle_B_index" ON "_ItemToStyle" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ItemToProduct_AB_unique" ON "_ItemToProduct" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ItemToProduct_B_index" ON "_ItemToProduct" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_ItemToPost_AB_unique" ON "_ItemToPost" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_ItemToPost_B_index" ON "_ItemToPost" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_LookToPost_AB_unique" ON "_LookToPost" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_LookToPost_B_index" ON "_LookToPost" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_PostToProduct_AB_unique" ON "_PostToProduct" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_PostToProduct_B_index" ON "_PostToProduct" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_PostToVariant_AB_unique" ON "_PostToVariant" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_PostToVariant_B_index" ON "_PostToVariant" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_CollectionToShow_AB_unique" ON "_CollectionToShow" USING btree ("A" int4_ops,"B" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_CollectionToShow_B_index" ON "_CollectionToShow" USING btree ("B" int4_ops);
*/