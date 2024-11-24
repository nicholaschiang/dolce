import { relations } from 'drizzle-orm/relations';
import {
	user,
	password,
	country,
	brand,
	brandToProduct,
	product,
	brandToRetailer,
	retailer,
	countryToRetailer,
	size,
	sizeEquivalents,
	company,
	video,
	show,
	style,
	collection,
	season,
	price,
	variant,
	productToStyle,
	collectionToProduct,
	look,
	image,
	post,
	styleGroup,
	color,
	colorToVariant,
	material,
	materialToVariant,
	productToUser,
	collectionToUser,
	lookToProduct,
	link,
	review,
	board,
	article,
	publication,
	variantToVideo,
	boardToLook,
	imageToVariant,
	tag,
	tagToVariant,
	boardToVariant,
	colorToItem,
	item,
	itemToStyle,
	itemToProduct,
	itemToPost,
	lookToPost,
	postToProduct,
	postToVariant,
	collectionToShow
} from './tables';

export const passwordRelations = relations(password, ({ one }) => ({
	user: one(user, {
		fields: [password.userId],
		references: [user.id]
	})
}));

export const userRelations = relations(user, ({ one, many }) => ({
	passwords: many(password),
	country: one(country, {
		fields: [user.countryId],
		references: [country.id]
	}),
	productToUsers: many(productToUser),
	collectionToUsers: many(collectionToUser),
	looks_modelId: many(look, {
		relationName: 'look_modelId_user_id'
	}),
	looks_authorId: many(look, {
		relationName: 'look_authorId_user_id'
	}),
	reviews: many(review),
	boards: many(board),
	articles_authorId: many(article, {
		relationName: 'article_authorId_user_id'
	}),
	articles_userId: many(article, {
		relationName: 'article_userId_user_id'
	}),
	posts: many(post)
}));

export const countryRelations = relations(country, ({ many }) => ({
	users: many(user),
	countryToRetailers: many(countryToRetailer),
	companies: many(company),
	brands: many(brand),
	sizes: many(size)
}));

export const brandToProductRelations = relations(brandToProduct, ({ one }) => ({
	brand: one(brand, {
		fields: [brandToProduct.a],
		references: [brand.id]
	}),
	product: one(product, {
		fields: [brandToProduct.b],
		references: [product.id]
	})
}));

export const brandRelations = relations(brand, ({ one, many }) => ({
	brandToProducts: many(brandToProduct),
	brandToRetailers: many(brandToRetailer),
	company: one(company, {
		fields: [brand.companyId],
		references: [company.id]
	}),
	country: one(country, {
		fields: [brand.countryId],
		references: [country.id]
	}),
	collections: many(collection),
	prices: many(price),
	links: many(link),
	sizes: many(size)
}));

export const productRelations = relations(product, ({ many }) => ({
	brandToProducts: many(brandToProduct),
	productToStyles: many(productToStyle),
	collectionToProducts: many(collectionToProduct),
	variants: many(variant),
	productToUsers: many(productToUser),
	lookToProducts: many(lookToProduct),
	itemToProducts: many(itemToProduct),
	postToProducts: many(postToProduct)
}));

export const brandToRetailerRelations = relations(brandToRetailer, ({ one }) => ({
	brand: one(brand, {
		fields: [brandToRetailer.a],
		references: [brand.id]
	}),
	retailer: one(retailer, {
		fields: [brandToRetailer.b],
		references: [retailer.id]
	})
}));

export const retailerRelations = relations(retailer, ({ one, many }) => ({
	brandToRetailers: many(brandToRetailer),
	countryToRetailers: many(countryToRetailer),
	prices: many(price),
	company: one(company, {
		fields: [retailer.companyId],
		references: [company.id]
	}),
	links: many(link)
}));

export const countryToRetailerRelations = relations(countryToRetailer, ({ one }) => ({
	country: one(country, {
		fields: [countryToRetailer.a],
		references: [country.id]
	}),
	retailer: one(retailer, {
		fields: [countryToRetailer.b],
		references: [retailer.id]
	})
}));

export const sizeEquivalentsRelations = relations(sizeEquivalents, ({ one }) => ({
	size_a: one(size, {
		fields: [sizeEquivalents.a],
		references: [size.id],
		relationName: 'sizeEquivalents_a_size_id'
	}),
	size_b: one(size, {
		fields: [sizeEquivalents.b],
		references: [size.id],
		relationName: 'sizeEquivalents_b_size_id'
	})
}));

export const sizeRelations = relations(size, ({ one, many }) => ({
	sizeEquivalents_a: many(sizeEquivalents, {
		relationName: 'sizeEquivalents_a_size_id'
	}),
	sizeEquivalents_b: many(sizeEquivalents, {
		relationName: 'sizeEquivalents_b_size_id'
	}),
	variants: many(variant),
	brand: one(brand, {
		fields: [size.brandId],
		references: [brand.id]
	}),
	country: one(country, {
		fields: [size.countryId],
		references: [country.id]
	}),
	style: one(style, {
		fields: [size.styleId],
		references: [style.id]
	})
}));

export const companyRelations = relations(company, ({ one, many }) => ({
	country: one(country, {
		fields: [company.countryId],
		references: [country.id]
	}),
	brands: many(brand),
	retailers: many(retailer)
}));

export const showRelations = relations(show, ({ one, many }) => ({
	video: one(video, {
		fields: [show.videoId],
		references: [video.id]
	}),
	collectionToShows: many(collectionToShow)
}));

export const videoRelations = relations(video, ({ one, many }) => ({
	shows: many(show),
	post: one(post, {
		fields: [video.postId],
		references: [post.id]
	}),
	variantToVideos: many(variantToVideo)
}));

export const collectionRelations = relations(collection, ({ one, many }) => ({
	style: one(style, {
		fields: [collection.styleId],
		references: [style.id]
	}),
	season: one(season, {
		fields: [collection.seasonId],
		references: [season.id]
	}),
	brand: one(brand, {
		fields: [collection.brandId],
		references: [brand.id]
	}),
	collectionToProducts: many(collectionToProduct),
	collectionToUsers: many(collectionToUser),
	links: many(link),
	looks: many(look),
	reviews: many(review),
	articles: many(article),
	collectionToShows: many(collectionToShow)
}));

export const styleRelations = relations(style, ({ one, many }) => ({
	collections: many(collection),
	productToStyles: many(productToStyle),
	styleGroup: one(styleGroup, {
		fields: [style.styleGroupId],
		references: [styleGroup.id]
	}),
	style: one(style, {
		fields: [style.parentId],
		references: [style.id],
		relationName: 'style_parentId_style_id'
	}),
	styles: many(style, {
		relationName: 'style_parentId_style_id'
	}),
	sizes: many(size),
	itemToStyles: many(itemToStyle)
}));

export const seasonRelations = relations(season, ({ many }) => ({
	collections: many(collection)
}));

export const priceRelations = relations(price, ({ one }) => ({
	retailer: one(retailer, {
		fields: [price.retailerId],
		references: [retailer.id]
	}),
	brand: one(brand, {
		fields: [price.brandId],
		references: [brand.id]
	}),
	variant: one(variant, {
		fields: [price.variantId],
		references: [variant.id]
	})
}));

export const variantRelations = relations(variant, ({ one, many }) => ({
	prices: many(price),
	colorToVariants: many(colorToVariant),
	product: one(product, {
		fields: [variant.productId],
		references: [product.id]
	}),
	size: one(size, {
		fields: [variant.sizeId],
		references: [size.id]
	}),
	materialToVariants: many(materialToVariant),
	variantToVideos: many(variantToVideo),
	imageToVariants: many(imageToVariant),
	tagToVariants: many(tagToVariant),
	boardToVariants: many(boardToVariant),
	postToVariants: many(postToVariant)
}));

export const productToStyleRelations = relations(productToStyle, ({ one }) => ({
	product: one(product, {
		fields: [productToStyle.a],
		references: [product.id]
	}),
	style: one(style, {
		fields: [productToStyle.b],
		references: [style.id]
	})
}));

export const collectionToProductRelations = relations(collectionToProduct, ({ one }) => ({
	collection: one(collection, {
		fields: [collectionToProduct.a],
		references: [collection.id]
	}),
	product: one(product, {
		fields: [collectionToProduct.b],
		references: [product.id]
	})
}));

export const imageRelations = relations(image, ({ one, many }) => ({
	look: one(look, {
		fields: [image.lookId],
		references: [look.id]
	}),
	post: one(post, {
		fields: [image.postId],
		references: [post.id]
	}),
	imageToVariants: many(imageToVariant)
}));

export const lookRelations = relations(look, ({ one, many }) => ({
	images: many(image),
	lookToProducts: many(lookToProduct),
	user_modelId: one(user, {
		fields: [look.modelId],
		references: [user.id],
		relationName: 'look_modelId_user_id'
	}),
	user_authorId: one(user, {
		fields: [look.authorId],
		references: [user.id],
		relationName: 'look_authorId_user_id'
	}),
	collection: one(collection, {
		fields: [look.collectionId],
		references: [collection.id]
	}),
	boardToLooks: many(boardToLook),
	lookToPosts: many(lookToPost)
}));

export const postRelations = relations(post, ({ one, many }) => ({
	images: many(image),
	videos: many(video),
	user: one(user, {
		fields: [post.authorId],
		references: [user.id]
	}),
	itemToPosts: many(itemToPost),
	lookToPosts: many(lookToPost),
	postToProducts: many(postToProduct),
	postToVariants: many(postToVariant)
}));

export const styleGroupRelations = relations(styleGroup, ({ many }) => ({
	styles: many(style)
}));

export const colorToVariantRelations = relations(colorToVariant, ({ one }) => ({
	color: one(color, {
		fields: [colorToVariant.a],
		references: [color.id]
	}),
	variant: one(variant, {
		fields: [colorToVariant.b],
		references: [variant.id]
	})
}));

export const colorRelations = relations(color, ({ many }) => ({
	colorToVariants: many(colorToVariant),
	colorToItems: many(colorToItem)
}));

export const materialToVariantRelations = relations(materialToVariant, ({ one }) => ({
	material: one(material, {
		fields: [materialToVariant.a],
		references: [material.id]
	}),
	variant: one(variant, {
		fields: [materialToVariant.b],
		references: [variant.id]
	})
}));

export const materialRelations = relations(material, ({ one, many }) => ({
	materialToVariants: many(materialToVariant),
	material: one(material, {
		fields: [material.parentId],
		references: [material.id],
		relationName: 'material_parentId_material_id'
	}),
	materials: many(material, {
		relationName: 'material_parentId_material_id'
	})
}));

export const productToUserRelations = relations(productToUser, ({ one }) => ({
	product: one(product, {
		fields: [productToUser.a],
		references: [product.id]
	}),
	user: one(user, {
		fields: [productToUser.b],
		references: [user.id]
	})
}));

export const collectionToUserRelations = relations(collectionToUser, ({ one }) => ({
	collection: one(collection, {
		fields: [collectionToUser.a],
		references: [collection.id]
	}),
	user: one(user, {
		fields: [collectionToUser.b],
		references: [user.id]
	})
}));

export const lookToProductRelations = relations(lookToProduct, ({ one }) => ({
	look: one(look, {
		fields: [lookToProduct.a],
		references: [look.id]
	}),
	product: one(product, {
		fields: [lookToProduct.b],
		references: [product.id]
	})
}));

export const linkRelations = relations(link, ({ one }) => ({
	collection: one(collection, {
		fields: [link.collectionId],
		references: [collection.id]
	}),
	brand: one(brand, {
		fields: [link.brandId],
		references: [brand.id]
	}),
	retailer: one(retailer, {
		fields: [link.retailerId],
		references: [retailer.id]
	})
}));

export const reviewRelations = relations(review, ({ one }) => ({
	user: one(user, {
		fields: [review.authorId],
		references: [user.id]
	}),
	collection: one(collection, {
		fields: [review.collectionId],
		references: [collection.id]
	})
}));

export const boardRelations = relations(board, ({ one, many }) => ({
	user: one(user, {
		fields: [board.authorId],
		references: [user.id]
	}),
	boardToLooks: many(boardToLook),
	boardToVariants: many(boardToVariant)
}));

export const articleRelations = relations(article, ({ one }) => ({
	user_authorId: one(user, {
		fields: [article.authorId],
		references: [user.id],
		relationName: 'article_authorId_user_id'
	}),
	user_userId: one(user, {
		fields: [article.userId],
		references: [user.id],
		relationName: 'article_userId_user_id'
	}),
	publication: one(publication, {
		fields: [article.publicationId],
		references: [publication.id]
	}),
	collection: one(collection, {
		fields: [article.collectionId],
		references: [collection.id]
	})
}));

export const publicationRelations = relations(publication, ({ many }) => ({
	articles: many(article)
}));

export const variantToVideoRelations = relations(variantToVideo, ({ one }) => ({
	variant: one(variant, {
		fields: [variantToVideo.a],
		references: [variant.id]
	}),
	video: one(video, {
		fields: [variantToVideo.b],
		references: [video.id]
	})
}));

export const boardToLookRelations = relations(boardToLook, ({ one }) => ({
	board: one(board, {
		fields: [boardToLook.a],
		references: [board.id]
	}),
	look: one(look, {
		fields: [boardToLook.b],
		references: [look.id]
	})
}));

export const imageToVariantRelations = relations(imageToVariant, ({ one }) => ({
	image: one(image, {
		fields: [imageToVariant.a],
		references: [image.id]
	}),
	variant: one(variant, {
		fields: [imageToVariant.b],
		references: [variant.id]
	})
}));

export const tagToVariantRelations = relations(tagToVariant, ({ one }) => ({
	tag: one(tag, {
		fields: [tagToVariant.a],
		references: [tag.id]
	}),
	variant: one(variant, {
		fields: [tagToVariant.b],
		references: [variant.id]
	})
}));

export const tagRelations = relations(tag, ({ many }) => ({
	tagToVariants: many(tagToVariant)
}));

export const boardToVariantRelations = relations(boardToVariant, ({ one }) => ({
	board: one(board, {
		fields: [boardToVariant.a],
		references: [board.id]
	}),
	variant: one(variant, {
		fields: [boardToVariant.b],
		references: [variant.id]
	})
}));

export const colorToItemRelations = relations(colorToItem, ({ one }) => ({
	color: one(color, {
		fields: [colorToItem.a],
		references: [color.id]
	}),
	item: one(item, {
		fields: [colorToItem.b],
		references: [item.id]
	})
}));

export const itemRelations = relations(item, ({ many }) => ({
	colorToItems: many(colorToItem),
	itemToStyles: many(itemToStyle),
	itemToProducts: many(itemToProduct),
	itemToPosts: many(itemToPost)
}));

export const itemToStyleRelations = relations(itemToStyle, ({ one }) => ({
	item: one(item, {
		fields: [itemToStyle.a],
		references: [item.id]
	}),
	style: one(style, {
		fields: [itemToStyle.b],
		references: [style.id]
	})
}));

export const itemToProductRelations = relations(itemToProduct, ({ one }) => ({
	item: one(item, {
		fields: [itemToProduct.a],
		references: [item.id]
	}),
	product: one(product, {
		fields: [itemToProduct.b],
		references: [product.id]
	})
}));

export const itemToPostRelations = relations(itemToPost, ({ one }) => ({
	item: one(item, {
		fields: [itemToPost.a],
		references: [item.id]
	}),
	post: one(post, {
		fields: [itemToPost.b],
		references: [post.id]
	})
}));

export const lookToPostRelations = relations(lookToPost, ({ one }) => ({
	look: one(look, {
		fields: [lookToPost.a],
		references: [look.id]
	}),
	post: one(post, {
		fields: [lookToPost.b],
		references: [post.id]
	})
}));

export const postToProductRelations = relations(postToProduct, ({ one }) => ({
	post: one(post, {
		fields: [postToProduct.a],
		references: [post.id]
	}),
	product: one(product, {
		fields: [postToProduct.b],
		references: [product.id]
	})
}));

export const postToVariantRelations = relations(postToVariant, ({ one }) => ({
	post: one(post, {
		fields: [postToVariant.a],
		references: [post.id]
	}),
	variant: one(variant, {
		fields: [postToVariant.b],
		references: [variant.id]
	})
}));

export const collectionToShowRelations = relations(collectionToShow, ({ one }) => ({
	collection: one(collection, {
		fields: [collectionToShow.a],
		references: [collection.id]
	}),
	show: one(show, {
		fields: [collectionToShow.b],
		references: [show.id]
	})
}));
