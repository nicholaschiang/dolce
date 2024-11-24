import {
	pgTable,
	varchar,
	timestamp,
	text,
	integer,
	uniqueIndex,
	foreignKey,
	serial,
	boolean,
	index,
	numeric,
	pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const level = pgEnum('Level', ['BESPOKE', 'COUTURE', 'HANDMADE', 'RTW']);
export const location = pgEnum('Location', [
	'NEW_YORK',
	'LONDON',
	'MILAN',
	'PARIS',
	'TOKYO',
	'BERLIN',
	'FLORENCE',
	'LOS_ANGELES',
	'MADRID',
	'COPENHAGEN',
	'SHANGHAI',
	'AUSTRALIA',
	'STOCKHOLM',
	'MEXICO',
	'MEXICO_CITY',
	'KIEV',
	'TBILISI',
	'SEOUL',
	'RUSSIA',
	'UKRAINE',
	'SAO_PAOLO',
	'BRIDAL'
]);
export const market = pgEnum('Market', ['PRIMARY', 'SECONDARY']);
export const seasonName = pgEnum('SeasonName', ['RESORT', 'SPRING', 'PRE_FALL', 'FALL']);
export const sex = pgEnum('Sex', ['MAN', 'WOMAN', 'UNISEX']);
export const sustainability = pgEnum('Sustainability', [
	'RECYCLED',
	'ORGANIC',
	'RESPONSIBLE_DOWN',
	'RESPONSIBLE_FORESTRY',
	'RESPONSIBLE_WOOL',
	'RESPONSIBLE_CASHMERE'
]);
export const tier = pgEnum('Tier', [
	'BESPOKE',
	'SUPERPREMIUM',
	'PREMIUM_CORE',
	'ACCESSIBLE_CORE',
	'AFFORDABLE_LUXURY',
	'DIFFUSION',
	'HIGH_STREET',
	'MID_STREET',
	'VALUE_MARKET'
]);

export const prismaMigrations = pgTable('_prisma_migrations', {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
	migrationName: varchar('migration_name', { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp('rolled_back_at', { withTimezone: true, mode: 'string' }),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer('applied_steps_count').default(0).notNull()
});

export const password = pgTable(
	'Password',
	{
		hash: text().notNull(),
		userId: integer().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			userIdKey: uniqueIndex('Password_userId_key').using(
				'btree',
				table.userId.asc().nullsLast().op('int4_ops')
			),
			passwordUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'Password_userId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const user = pgTable(
	'User',
	{
		email: text(),
		name: text().notNull(),
		username: text(),
		id: serial().primaryKey().notNull(),
		countryId: integer(),
		avatar: text(),
		url: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		description: text(),
		curator: boolean().default(false).notNull()
	},
	(table) => {
		return {
			avatarKey: uniqueIndex('User_avatar_key').using(
				'btree',
				table.avatar.asc().nullsLast().op('text_ops')
			),
			emailKey: uniqueIndex('User_email_key').using(
				'btree',
				table.email.asc().nullsLast().op('text_ops')
			),
			nameKey: uniqueIndex('User_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			urlKey: uniqueIndex('User_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			usernameKey: uniqueIndex('User_username_key').using(
				'btree',
				table.username.asc().nullsLast().op('text_ops')
			),
			userCountryIdFkey: foreignKey({
				columns: [table.countryId],
				foreignColumns: [country.id],
				name: 'User_countryId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const brandToProduct = pgTable(
	'_BrandToProduct',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_BrandToProduct_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			brandToProductAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [brand.id],
				name: '_BrandToProduct_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			brandToProductBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [product.id],
				name: '_BrandToProduct_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const brandToRetailer = pgTable(
	'_BrandToRetailer',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_BrandToRetailer_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			brandToRetailerAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [brand.id],
				name: '_BrandToRetailer_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			brandToRetailerBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [retailer.id],
				name: '_BrandToRetailer_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const countryToRetailer = pgTable(
	'_CountryToRetailer',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_CountryToRetailer_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			countryToRetailerAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [country.id],
				name: '_CountryToRetailer_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			countryToRetailerBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [retailer.id],
				name: '_CountryToRetailer_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const sizeEquivalents = pgTable(
	'_SizeEquivalents',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_SizeEquivalents_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			sizeEquivalentsAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [size.id],
				name: '_SizeEquivalents_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			sizeEquivalentsBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [size.id],
				name: '_SizeEquivalents_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const company = pgTable(
	'Company',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		description: text(),
		countryId: integer().notNull(),
		avatar: text(),
		url: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			avatarKey: uniqueIndex('Company_avatar_key').using(
				'btree',
				table.avatar.asc().nullsLast().op('text_ops')
			),
			nameKey: uniqueIndex('Company_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			urlKey: uniqueIndex('Company_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			companyCountryIdFkey: foreignKey({
				columns: [table.countryId],
				foreignColumns: [country.id],
				name: 'Company_countryId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const brand = pgTable(
	'Brand',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		description: text(),
		companyId: integer(),
		countryId: integer(),
		tier: tier(),
		avatar: text(),
		url: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		slug: text().notNull()
	},
	(table) => {
		return {
			avatarKey: uniqueIndex('Brand_avatar_key').using(
				'btree',
				table.avatar.asc().nullsLast().op('text_ops')
			),
			nameKey: uniqueIndex('Brand_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			slugKey: uniqueIndex('Brand_slug_key').using(
				'btree',
				table.slug.asc().nullsLast().op('text_ops')
			),
			urlKey: uniqueIndex('Brand_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			brandCompanyIdFkey: foreignKey({
				columns: [table.companyId],
				foreignColumns: [company.id],
				name: 'Brand_companyId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			brandCountryIdFkey: foreignKey({
				columns: [table.countryId],
				foreignColumns: [country.id],
				name: 'Brand_countryId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const country = pgTable(
	'Country',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('Country_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			)
		};
	}
);

export const season = pgTable(
	'Season',
	{
		id: serial().primaryKey().notNull(),
		year: integer().notNull(),
		name: seasonName().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			nameYearKey: uniqueIndex('Season_name_year_key').using(
				'btree',
				table.name.asc().nullsLast().op('int4_ops'),
				table.year.asc().nullsLast().op('int4_ops')
			)
		};
	}
);

export const show = pgTable(
	'Show',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		date: timestamp({ precision: 3, mode: 'string' }),
		videoId: integer(),
		url: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('Show_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			urlKey: uniqueIndex('Show_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			videoIdKey: uniqueIndex('Show_videoId_key').using(
				'btree',
				table.videoId.asc().nullsLast().op('int4_ops')
			),
			showVideoIdFkey: foreignKey({
				columns: [table.videoId],
				foreignColumns: [video.id],
				name: 'Show_videoId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const product = pgTable(
	'Product',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		designedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
		releasedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
		level: level().notNull(),
		msrp: numeric({ precision: 65, scale: 30 }),
		description: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		slug: text().notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('Product_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			slugKey: uniqueIndex('Product_slug_key').using(
				'btree',
				table.slug.asc().nullsLast().op('text_ops')
			)
		};
	}
);

export const collection = pgTable(
	'Collection',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		styleId: integer(),
		seasonId: integer().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		articlesConsensus: text(),
		brandId: integer().notNull(),
		date: timestamp({ precision: 3, mode: 'string' }),
		description: text(),
		level: level().notNull(),
		location: location(),
		reviewsConsensus: text(),
		sex: sex().notNull(),
		url: text().notNull()
	},
	(table) => {
		return {
			brandIdSeasonIdSexLevelLocationKey: uniqueIndex(
				'Collection_brandId_seasonId_sex_level_location_key'
			).using(
				'btree',
				table.brandId.asc().nullsLast().op('enum_ops'),
				table.seasonId.asc().nullsLast().op('enum_ops'),
				table.sex.asc().nullsLast().op('int4_ops'),
				table.level.asc().nullsLast().op('enum_ops'),
				table.location.asc().nullsLast().op('enum_ops')
			),
			nameKey: uniqueIndex('Collection_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			urlKey: uniqueIndex('Collection_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			collectionStyleIdFkey: foreignKey({
				columns: [table.styleId],
				foreignColumns: [style.id],
				name: 'Collection_styleId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			collectionSeasonIdFkey: foreignKey({
				columns: [table.seasonId],
				foreignColumns: [season.id],
				name: 'Collection_seasonId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			collectionBrandIdFkey: foreignKey({
				columns: [table.brandId],
				foreignColumns: [brand.id],
				name: 'Collection_brandId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const price = pgTable(
	'Price',
	{
		id: serial().primaryKey().notNull(),
		value: numeric({ precision: 65, scale: 30 }).notNull(),
		market: market().notNull(),
		url: text().notNull(),
		retailerId: integer(),
		brandId: integer(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		available: boolean().default(true).notNull(),
		variantId: integer().notNull()
	},
	(table) => {
		return {
			variantIdValueUrlKey: uniqueIndex('Price_variantId_value_url_key').using(
				'btree',
				table.variantId.asc().nullsLast().op('int4_ops'),
				table.value.asc().nullsLast().op('int4_ops'),
				table.url.asc().nullsLast().op('int4_ops')
			),
			priceRetailerIdFkey: foreignKey({
				columns: [table.retailerId],
				foreignColumns: [retailer.id],
				name: 'Price_retailerId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			priceBrandIdFkey: foreignKey({
				columns: [table.brandId],
				foreignColumns: [brand.id],
				name: 'Price_brandId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			priceVariantIdFkey: foreignKey({
				columns: [table.variantId],
				foreignColumns: [variant.id],
				name: 'Price_variantId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const retailer = pgTable(
	'Retailer',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		description: text(),
		companyId: integer(),
		avatar: text(),
		url: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			avatarKey: uniqueIndex('Retailer_avatar_key').using(
				'btree',
				table.avatar.asc().nullsLast().op('text_ops')
			),
			nameKey: uniqueIndex('Retailer_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			urlKey: uniqueIndex('Retailer_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			retailerCompanyIdFkey: foreignKey({
				columns: [table.companyId],
				foreignColumns: [company.id],
				name: 'Retailer_companyId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const productToStyle = pgTable(
	'_ProductToStyle',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ProductToStyle_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			productToStyleAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [product.id],
				name: '_ProductToStyle_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			productToStyleBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [style.id],
				name: '_ProductToStyle_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const collectionToProduct = pgTable(
	'_CollectionToProduct',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_CollectionToProduct_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			collectionToProductAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [collection.id],
				name: '_CollectionToProduct_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			collectionToProductBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [product.id],
				name: '_CollectionToProduct_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const image = pgTable(
	'Image',
	{
		id: serial().primaryKey().notNull(),
		url: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		lookId: integer(),
		height: integer(),
		position: integer(),
		width: integer(),
		postId: integer()
	},
	(table) => {
		return {
			urlKey: uniqueIndex('Image_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			imageLookIdFkey: foreignKey({
				columns: [table.lookId],
				foreignColumns: [look.id],
				name: 'Image_lookId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			imagePostIdFkey: foreignKey({
				columns: [table.postId],
				foreignColumns: [post.id],
				name: 'Image_postId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('set null')
		};
	}
);

export const video = pgTable(
	'Video',
	{
		id: serial().primaryKey().notNull(),
		url: text().notNull(),
		mimeType: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		postId: integer()
	},
	(table) => {
		return {
			urlKey: uniqueIndex('Video_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			videoPostIdFkey: foreignKey({
				columns: [table.postId],
				foreignColumns: [post.id],
				name: 'Video_postId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('set null')
		};
	}
);

export const color = pgTable(
	'Color',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('Color_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			)
		};
	}
);

export const style = pgTable(
	'Style',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		parentId: integer(),
		styleGroupId: integer(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('Style_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			styleStyleGroupIdFkey: foreignKey({
				columns: [table.styleGroupId],
				foreignColumns: [styleGroup.id],
				name: 'Style_styleGroupId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			styleParentIdFkey: foreignKey({
				columns: [table.parentId],
				foreignColumns: [table.id],
				name: 'Style_parentId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('set null')
		};
	}
);

export const colorToVariant = pgTable(
	'_ColorToVariant',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ColorToVariant_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			colorToVariantAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [color.id],
				name: '_ColorToVariant_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			colorToVariantBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [variant.id],
				name: '_ColorToVariant_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const variant = pgTable(
	'Variant',
	{
		id: serial().primaryKey().notNull(),
		productId: integer().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		sizeId: integer().notNull(),
		sku: text().notNull()
	},
	(table) => {
		return {
			skuKey: uniqueIndex('Variant_sku_key').using(
				'btree',
				table.sku.asc().nullsLast().op('text_ops')
			),
			variantProductIdFkey: foreignKey({
				columns: [table.productId],
				foreignColumns: [product.id],
				name: 'Variant_productId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			variantSizeIdFkey: foreignKey({
				columns: [table.sizeId],
				foreignColumns: [size.id],
				name: 'Variant_sizeId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const materialToVariant = pgTable(
	'_MaterialToVariant',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_MaterialToVariant_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			materialToVariantAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [material.id],
				name: '_MaterialToVariant_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			materialToVariantBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [variant.id],
				name: '_MaterialToVariant_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const material = pgTable(
	'Material',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		description: text(),
		sustainability: sustainability(),
		parentId: integer(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('Material_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			),
			materialParentIdFkey: foreignKey({
				columns: [table.parentId],
				foreignColumns: [table.id],
				name: 'Material_parentId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('set null')
		};
	}
);

export const styleGroup = pgTable(
	'StyleGroup',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('StyleGroup_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			)
		};
	}
);

export const productToUser = pgTable(
	'_ProductToUser',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ProductToUser_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			productToUserAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [product.id],
				name: '_ProductToUser_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			productToUserBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [user.id],
				name: '_ProductToUser_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const collectionToUser = pgTable(
	'_CollectionToUser',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_CollectionToUser_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			collectionToUserAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [collection.id],
				name: '_CollectionToUser_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			collectionToUserBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [user.id],
				name: '_CollectionToUser_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const lookToProduct = pgTable(
	'_LookToProduct',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_LookToProduct_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			lookToProductAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [look.id],
				name: '_LookToProduct_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			lookToProductBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [product.id],
				name: '_LookToProduct_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const link = pgTable(
	'Link',
	{
		id: serial().primaryKey().notNull(),
		url: text().notNull(),
		collectionId: integer(),
		brandId: integer(),
		retailerId: integer(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			brandIdRetailerIdKey: uniqueIndex('Link_brandId_retailerId_key').using(
				'btree',
				table.brandId.asc().nullsLast().op('int4_ops'),
				table.retailerId.asc().nullsLast().op('int4_ops')
			),
			collectionIdBrandIdKey: uniqueIndex('Link_collectionId_brandId_key').using(
				'btree',
				table.collectionId.asc().nullsLast().op('int4_ops'),
				table.brandId.asc().nullsLast().op('int4_ops')
			),
			collectionIdRetailerIdKey: uniqueIndex('Link_collectionId_retailerId_key').using(
				'btree',
				table.collectionId.asc().nullsLast().op('int4_ops'),
				table.retailerId.asc().nullsLast().op('int4_ops')
			),
			urlKey: uniqueIndex('Link_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			linkCollectionIdFkey: foreignKey({
				columns: [table.collectionId],
				foreignColumns: [collection.id],
				name: 'Link_collectionId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			linkBrandIdFkey: foreignKey({
				columns: [table.brandId],
				foreignColumns: [brand.id],
				name: 'Link_brandId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			linkRetailerIdFkey: foreignKey({
				columns: [table.retailerId],
				foreignColumns: [retailer.id],
				name: 'Link_retailerId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const publication = pgTable(
	'Publication',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		avatar: text(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull()
	},
	(table) => {
		return {
			avatarKey: uniqueIndex('Publication_avatar_key').using(
				'btree',
				table.avatar.asc().nullsLast().op('text_ops')
			),
			nameKey: uniqueIndex('Publication_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			)
		};
	}
);

export const look = pgTable(
	'Look',
	{
		id: serial().primaryKey().notNull(),
		number: integer().notNull(),
		modelId: integer(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		authorId: integer(),
		collectionId: integer()
	},
	(table) => {
		return {
			authorIdNumberKey: uniqueIndex('Look_authorId_number_key').using(
				'btree',
				table.authorId.asc().nullsLast().op('int4_ops'),
				table.number.asc().nullsLast().op('int4_ops')
			),
			collectionIdNumberKey: uniqueIndex('Look_collectionId_number_key').using(
				'btree',
				table.collectionId.asc().nullsLast().op('int4_ops'),
				table.number.asc().nullsLast().op('int4_ops')
			),
			lookModelIdFkey: foreignKey({
				columns: [table.modelId],
				foreignColumns: [user.id],
				name: 'Look_modelId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			lookAuthorIdFkey: foreignKey({
				columns: [table.authorId],
				foreignColumns: [user.id],
				name: 'Look_authorId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			lookCollectionIdFkey: foreignKey({
				columns: [table.collectionId],
				foreignColumns: [collection.id],
				name: 'Look_collectionId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const review = pgTable(
	'Review',
	{
		id: serial().primaryKey().notNull(),
		content: text().notNull(),
		authorId: integer().notNull(),
		score: numeric({ precision: 65, scale: 30 }).notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		collectionId: integer().notNull()
	},
	(table) => {
		return {
			authorIdCollectionIdKey: uniqueIndex('Review_authorId_collectionId_key').using(
				'btree',
				table.authorId.asc().nullsLast().op('int4_ops'),
				table.collectionId.asc().nullsLast().op('int4_ops')
			),
			reviewAuthorIdFkey: foreignKey({
				columns: [table.authorId],
				foreignColumns: [user.id],
				name: 'Review_authorId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			reviewCollectionIdFkey: foreignKey({
				columns: [table.collectionId],
				foreignColumns: [collection.id],
				name: 'Review_collectionId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const board = pgTable(
	'Board',
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		name: text().notNull(),
		description: text(),
		authorId: integer().notNull()
	},
	(table) => {
		return {
			nameAuthorIdKey: uniqueIndex('Board_name_authorId_key').using(
				'btree',
				table.name.asc().nullsLast().op('int4_ops'),
				table.authorId.asc().nullsLast().op('text_ops')
			),
			setNameAuthorIdKey: uniqueIndex('Set_name_authorId_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops'),
				table.authorId.asc().nullsLast().op('text_ops')
			),
			boardAuthorIdFkey: foreignKey({
				columns: [table.authorId],
				foreignColumns: [user.id],
				name: 'Board_authorId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const article = pgTable(
	'Article',
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		writtenAt: timestamp({ precision: 3, mode: 'string' }),
		url: text().notNull(),
		title: text().notNull(),
		subtitle: text(),
		summary: text(),
		content: text().notNull(),
		score: numeric({ precision: 65, scale: 30 }),
		authorId: integer(),
		userId: integer(),
		publicationId: integer().notNull(),
		collectionId: integer()
	},
	(table) => {
		return {
			authorIdCollectionIdKey: uniqueIndex('Article_authorId_collectionId_key').using(
				'btree',
				table.authorId.asc().nullsLast().op('int4_ops'),
				table.collectionId.asc().nullsLast().op('int4_ops')
			),
			publicationIdTitleKey: uniqueIndex('Article_publicationId_title_key').using(
				'btree',
				table.publicationId.asc().nullsLast().op('text_ops'),
				table.title.asc().nullsLast().op('int4_ops')
			),
			urlKey: uniqueIndex('Article_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			articleAuthorIdFkey: foreignKey({
				columns: [table.authorId],
				foreignColumns: [user.id],
				name: 'Article_authorId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			articleUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'Article_userId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			articlePublicationIdFkey: foreignKey({
				columns: [table.publicationId],
				foreignColumns: [publication.id],
				name: 'Article_publicationId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			articleCollectionIdFkey: foreignKey({
				columns: [table.collectionId],
				foreignColumns: [collection.id],
				name: 'Article_collectionId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const size = pgTable(
	'Size',
	{
		id: serial().primaryKey().notNull(),
		name: text().notNull(),
		chest: numeric({ precision: 65, scale: 30 }),
		shoulder: numeric({ precision: 65, scale: 30 }),
		waist: numeric({ precision: 65, scale: 30 }),
		sleeve: numeric({ precision: 65, scale: 30 }),
		brandId: integer(),
		countryId: integer(),
		sex: sex().notNull(),
		styleId: integer().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		slug: text().notNull()
	},
	(table) => {
		return {
			nameSexStyleIdBrandIdCountryIdKey: uniqueIndex(
				'Size_name_sex_styleId_brandId_countryId_key'
			).using(
				'btree',
				table.name.asc().nullsLast().op('int4_ops'),
				table.sex.asc().nullsLast().op('enum_ops'),
				table.styleId.asc().nullsLast().op('text_ops'),
				table.brandId.asc().nullsLast().op('text_ops'),
				table.countryId.asc().nullsLast().op('text_ops')
			),
			slugKey: uniqueIndex('Size_slug_key').using(
				'btree',
				table.slug.asc().nullsLast().op('text_ops')
			),
			sizeBrandIdFkey: foreignKey({
				columns: [table.brandId],
				foreignColumns: [brand.id],
				name: 'Size_brandId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			sizeCountryIdFkey: foreignKey({
				columns: [table.countryId],
				foreignColumns: [country.id],
				name: 'Size_countryId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			sizeStyleIdFkey: foreignKey({
				columns: [table.styleId],
				foreignColumns: [style.id],
				name: 'Size_styleId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const variantToVideo = pgTable(
	'_VariantToVideo',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_VariantToVideo_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			variantToVideoAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [variant.id],
				name: '_VariantToVideo_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			variantToVideoBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [video.id],
				name: '_VariantToVideo_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const boardToLook = pgTable(
	'_BoardToLook',
	{
		b: integer('B').notNull(),
		a: integer('A').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_BoardToLook_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			boardToLookAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [board.id],
				name: '_BoardToLook_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			boardToLookBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [look.id],
				name: '_BoardToLook_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const imageToVariant = pgTable(
	'_ImageToVariant',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ImageToVariant_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			imageToVariantAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [image.id],
				name: '_ImageToVariant_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			imageToVariantBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [variant.id],
				name: '_ImageToVariant_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const tag = pgTable(
	'Tag',
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		name: text().notNull()
	},
	(table) => {
		return {
			nameKey: uniqueIndex('Tag_name_key').using(
				'btree',
				table.name.asc().nullsLast().op('text_ops')
			)
		};
	}
);

export const tagToVariant = pgTable(
	'_TagToVariant',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_TagToVariant_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			tagToVariantAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [tag.id],
				name: '_TagToVariant_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			tagToVariantBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [variant.id],
				name: '_TagToVariant_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const boardToVariant = pgTable(
	'_BoardToVariant',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_BoardToVariant_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			setToVariantAbUnique: uniqueIndex('_SetToVariant_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			setToVariantBIdx: index('_SetToVariant_B_index').using(
				'btree',
				table.b.asc().nullsLast().op('int4_ops')
			),
			boardToVariantAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [board.id],
				name: '_BoardToVariant_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			boardToVariantBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [variant.id],
				name: '_BoardToVariant_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const post = pgTable(
	'Post',
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		url: text().notNull(),
		description: text(),
		authorId: integer().notNull()
	},
	(table) => {
		return {
			urlKey: uniqueIndex('Post_url_key').using(
				'btree',
				table.url.asc().nullsLast().op('text_ops')
			),
			postAuthorIdFkey: foreignKey({
				columns: [table.authorId],
				foreignColumns: [user.id],
				name: 'Post_authorId_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const colorToItem = pgTable(
	'_ColorToItem',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ColorToItem_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			colorToItemAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [color.id],
				name: '_ColorToItem_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			colorToItemBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [item.id],
				name: '_ColorToItem_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const item = pgTable('Item', {
	id: serial().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const itemToStyle = pgTable(
	'_ItemToStyle',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ItemToStyle_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			itemToStyleAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [item.id],
				name: '_ItemToStyle_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			itemToStyleBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [style.id],
				name: '_ItemToStyle_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const itemToProduct = pgTable(
	'_ItemToProduct',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ItemToProduct_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			itemToProductAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [item.id],
				name: '_ItemToProduct_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			itemToProductBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [product.id],
				name: '_ItemToProduct_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const itemToPost = pgTable(
	'_ItemToPost',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_ItemToPost_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			itemToPostAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [item.id],
				name: '_ItemToPost_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			itemToPostBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [post.id],
				name: '_ItemToPost_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const lookToPost = pgTable(
	'_LookToPost',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_LookToPost_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			lookToPostAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [look.id],
				name: '_LookToPost_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			lookToPostBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [post.id],
				name: '_LookToPost_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const postToProduct = pgTable(
	'_PostToProduct',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_PostToProduct_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			postToProductAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [post.id],
				name: '_PostToProduct_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			postToProductBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [product.id],
				name: '_PostToProduct_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const postToVariant = pgTable(
	'_PostToVariant',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_PostToVariant_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			postToVariantAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [post.id],
				name: '_PostToVariant_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			postToVariantBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [variant.id],
				name: '_PostToVariant_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);

export const collectionToShow = pgTable(
	'_CollectionToShow',
	{
		a: integer('A').notNull(),
		b: integer('B').notNull()
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_CollectionToShow_AB_unique').using(
				'btree',
				table.a.asc().nullsLast().op('int4_ops'),
				table.b.asc().nullsLast().op('int4_ops')
			),
			bIdx: index().using('btree', table.b.asc().nullsLast().op('int4_ops')),
			collectionToShowAFkey: foreignKey({
				columns: [table.a],
				foreignColumns: [collection.id],
				name: '_CollectionToShow_A_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			collectionToShowBFkey: foreignKey({
				columns: [table.b],
				foreignColumns: [show.id],
				name: '_CollectionToShow_B_fkey'
			})
				.onUpdate('cascade')
				.onDelete('cascade')
		};
	}
);
