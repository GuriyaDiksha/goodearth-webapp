## API Endpoints

### 1. [GET] /myapi/products/:id

**Parameters**

id: number

**Response:** Product ([link](#markdown-header-product-extends-partialproductitem))


### 2. [GET] /myapi/products/:id/more-from-collection

**Parameters**

id: number

**Response:** 

```
{
	count: number,
	prev: string,
	next: string,
	data: [{
		id: string,
		title: string,
		url: string,
		image: string,
		badgeImage: string,
		collection: string,
		collectionUrl: string,
		priceRecords: PriceRecord
	}]
}
```


--------
## Resources Objects

### PriceRecord
```
{
	"INR": number,
	"GBP": number,
	"USD": number
}
```

### Breadcrumb
```
{
	url: string,
	depth: number,
	name: string
}
```
### ProductSliderImage
```
{
  id: number,
  productImage: string,
  caption?: string,
  displayOrder: number,
  dateCreated: Date,
  social: boolean,
  product: number
}
```

### Children
```
{
  url: string;
  labelMobile: string;
  id: number;
  labelDesktop: string;
  name: string;
}
```
Children: [link](#markdown-header-children)

### MenuData
```
{
  name: string;
  url: string;
  id: number;
  labelDesktop: string;
  labelMobile: string;
  children: Children[];
}
```

### List
```
[{
    text: string,
    link: string
}]
```

### ProductImage *extends* [**ProductSliderImage**](#markdown-header-productsliderimage)

```
{
  badgeImage?: string,
  badgeImagePDP?: string
}
```

### ProductAttributes
```
{
	name: string,
	value: string
}
```


### PartialChildProductAttributes
```
{
	sku: string,
	priceRecords: PriceRecord,
	stock: number,
	size: string
}
```

### ChildProductAttributes *extends* [PartialChildProductAttributes](#markdown-header-partialchildproductattributes)

**Links to Resources:**

PriceRecord: [link](#markdown-header-pricerecord)


```
{
  	discountedPriceRecords: PriceRecord,
	id: number,
	isBridalProduct: boolean
}
```

### DesignJournalTag
```
{
	designJournal: boolean;
  	folderCode: string;
}

```

### PLPProductItem

**Links to Resources:**

PriceRecord: [link](#markdown-header-pricerecord)

PartialChildProductAttributes: [link](#markdown-header-partialchildproductattributes)

```
{
	url: string,
	id: number,
	title: string,
	collections: string[],
	plpImages?: string[],
	priceRecords: PriceRecord,
	discountedPriceRecords: PriceRecord,
	discount: boolean,
	categories: string[],
	isNew?: boolean,
	salesBadgeImage?: string,
	markAs?: string[],
	childAttributes?: PartialChildProductAttributes[]
}
```

### PartialProductItem

**Links to Resources:**

PriceRecord: [link](#markdown-header-pricerecord)

ProductImage: [link](#markdown-header-productimage-extends-productsliderimage)

PartialChildProductAttributes: [link](#markdown-header-partialchildproductattributes)

```
{
	url: string,
	id: number,
	title: string,
	images: ProductImage[],
	collections: string[],
	plpImages?: string[],
	priceRecords: PriceRecord,
	discountedPriceRecords: PriceRecord,
	discount: boolean,
	categories: string[],
	isNew?: boolean,
	salesBadgeImage?: string,
	markAs?: string[],
	childAttributes?: PartialChildProductAttributes[]
}
```

### Product *extends* [PartialProductItem](#markdown-header-partialproductitem)

**Links to Resources:**

Breadcrumb: [link](#markdown-header-breadcrumb)

ProductSliderImage: [link](#markdown-header-productsliderimage)

ChildProductAttributes: [link](#markdown-header-childproductattributes-extends-partialchildproductattributes)

DesignJournalTag: [link](#markdown-header-designjournaltag)

```
{
	breadcrumbs: Breadcrumb[],
	details: string,
	compAndCare: string,
	shipping: string,
	sizeFit?: string,
	dateCreated: Date,
	dateUpdated: Date,
	recommendedProducts: PartialProductItem[],
	productClass: string,
	structure: string,
	parent?: string,
	collection: string,
	collectionUrl: string,
	sliderImages: ProductSliderImage[],
	childAttributes?: ChildProductAttributes[],
	sizeChartHTML: string,
	loyalityDisabled?: boolean,
	designJournalTagging?: DesignJournalTag[],
	fillerMessage?: string
}
```

---

BASKET RESOURCES START

---

### StockRecord

```
{
	partnerSKU: string,
	productId: number,
	numInStock: number,
	numAllocated: number,
	partner: number
}
```

### BasketProduct *extends* [PartialProductItem](#markdown-header-partialproductitem)

**Links to Resources:**

ProductAttributes: [link](#markdown-header-productattributes)

StockRecord: [link](#markdown-header-stockrecord)

```
{
	stockRecords: StockRecord[],
	inWishlist: boolean,
	structure: string,
	collection: string,
	parent: number,
	attributes: ProductAttributes[]
}
```

### BasketLineItem

**Links to Resources:**

BasketProduct ([link](#markdown-header-basketproduct-extends-partialproductitem))

```
{
	id: number,
	bridalProfile: boolen,
	giftCardImage: string,
	quantity: number,
	product: BasketProduct[]
}
```


### CartResponse

**Links to Resources:**

BasketLineItem: [link](#markdown-header-basketlineitem)

```
{
	shippable: boolean,
	currency: string,
	subtotalExclusive: number,
	totalExclusive: number,
	totalTax: number,
	totalWithoutGCItems: number,
	voucherDiscounts:[],
	offerDiscounts: []
	lineItems: BasketLineItem[],
	bridal: boolean,
	loyalityUpdated: boolean,
	isTaxKnown: boolean
}
```

---

BASKET RESOURCES END

---


### WishlistProductItem *extends* [PartialProductItem](#markdown-header-partialproductitem)

**Links to Resources:**

Breadcrumb: [link](#markdown-header-breadcrumb)

ProductSliderImage: [link](#markdown-header-productsliderimage)

ChildProductAttributes: [link](#markdown-header-childproductattributes-extends-partialchildproductattributes)

DesignJournalTag: [link](#markdown-header-designjournaltag)

```
{
	collection: string,
	collectionUrl: string,
	childAttributes?: ChildProductAttributes[]
}
```


### WidgetImage

```
{
	image: string,
	imageType: number,
	bannerType: number,
	title: string,
	subtitle: string,
	description: string,
	url: string,
	ctaImage: string,
	ctaText: string,
	ctaUrl: string,
	videoUrl: string,
	urlDisplayName: string,
	order: number
}
```

### 3. [GET] /myapi/top-menu-data-ver-1/

**Response:** 
MenuData: [link](#markdown-header-menudata)
```
{
  id: number,
  name: string,
  url: string,
  labelDesktop?: string,
  labelMobile?: string,
  catLandingUrl: string,
  leftMenu?: MenuData[],
  rightMenu?: MenuData[][],
  categoryLogoImage?: string | null,
  image?: string,
  categoryImageUrl: string,
}
```

### 4. [GET] /myapi/footer-list/

**Response:** 
List:[link](#markdown-header-list)
```
footerList:[{
   name: string,
   value: List
}]
```
### 5. [Post] /myapi/meta-list

**Parameters**
```
{
	page: string,
	pathName?:string,
	productId?:number
}
```
**Response:**
```
{
	keywords:string[],
	description:string,
	title:string,
	ogTitle:string,
	ogUrl:string,
	ogImage:string,
	ogDescription:string,
	ogSiteName:string,
	isChat:boolean,
	templateType?:string,
	productClass?:string

}
```


### 6. [GET] /myapi/search

Same Api for search and PLP

**Query Parameters**

Same as current parameters, based on filters or source

**Links to Resources:**

Breadcrumb: [link](#markdown-header-breadcrumb)

PLPProductItem: [link](#markdown-header-plpproductitem)

**Response:** 

```
{
	count: number,
	previous: string,
	next: string,
	results: {
		banner: string,
		bannerMobile: string,
		facets: "Same as current production structure",
		breadcrumb: Breadcrumb[],
		data: PLPProductItem[]
	}
}
```


### 7. [GET] /myapi/multi-image-page-widget/search_featured

**Links to Resources:**

WidgetImage: [link](#markdown-header-widgetimage)

**Response**

```
{
	name: string,
	description: string,
	widgetImages: WidgetImage[],
	backgroundImage: string,
	enabled: boolean,
	id: number
}
```


## Category Landing Page

### 8. [GET] /myapi/newarrivals/:id/

**Parameters**

id: number

**Response**

```
{
	count: number,
	next: string,
	previous: string,
	results: [
		{
			id: number,
			url: string,
			image: string,
			title: string,
			collection: string,
			badgeImage: string,
			categories: string[],
			sku: string,
			gaVariant: string
		}
	]
}
```

### 9. [GET] /myapi/latest-bought-products/:id/

**Parameters**

id: number

**Response**

```
{
	data: [
		{
			id: number,
			url: string,
			image: string,
			title: string,
			collection: string,
			badgeImage: string,
			categories: string[],
			sku: string,
			gaVariant: string,
			discount: boolean,
			country: string
		}
	]
}
```

### 10. [GET] /myapi/multi-image-page-widget/:id/

Generic API for getting widget Data.

**Parameters**

id: string

**Links to Resources:**

PartialProductItem: [link](#markdown-header-partialproductitem)

**Response**

```
{
	name: string,
	description: string,
	widgetImages: WidgetImage[],
	backgroundImage: string,
	enabled: boolean,
	products: PartialProductItem[],
	id: number
}
```


## Collection pages

### 11. [GET] /myapi/level-2-cat-coll-mapping/:id/

**Parameters**

id: number

**Response**

```
{
	description: string,
	level2Categories: [
		{
			id: number,
			name: string,
			url: string
		}
	]
}
```

### 12. [GET] /myapi/allcollection/:id/

**Parameters**

id: number

**Response**

```
{
	count: number,
	results: [
		{
			id: number,
			name: string,
			displayImage: string,
			subHeader: string,
			shortDescription: string,
			longDescription: string,
			category: [
				{
					id: number,
					name: string
				}
			],
			sliderImages: string[],
			header: string,
			url: string
		}
	]
}
```

### 13. [GET] /myapi/collectionspecific/:id/

**Parameters**

id: number

**Links to Resources:**

Breadcrumb: [link](#markdown-header-breadcrumb)

PriceRecord: [link](#markdown-header-pricerecord)

ChildProductAttributes: [link](#markdown-header-childproductattributes-extends-partialchildproductattributes)

**Response**

```
{
	count: number,
	next: string,
	breadcrumbs: Breadcrumb[],
	shortDescription: string,
	longDescription: string,
	results: [
		{
			id: number,
			url: string,
			collectionName: string,
			plpImages: string[],
			title: string,
			priceRecords: PriceRecord,
			includedCategory: [
				{
					id: number,
					name: string,
					fullName: string
				}
			],
			discountedPriceRecords: PriceRecord,
			badgeImage: string,
			discount: boolean,
			sku: string,
			color: string,
			categories: string[],
			inStock: boolean,
			childAttributes?: ChildProductAttributes[],

		}
	]
}
```

### 14. [POST] myapi/newsletterSignup/

**Parameters**

email: string

**Response**

```
{
	status: boolean, 
	message: string
}
```

### 15. [GET] /myapi/wishlist/

API for getting Wishlist with only product IDs

**Parameters**

sortBy: string (Existing production values)

**Response**

```
{
	data: [
		{
			id: number,
			quantity: number,
			dnd_sequence: number,
			size: number,
			sequence: number,
			productId: number
		}
	]
}
```

### 16. [GET] /myapi/wishlist-products/

API for getting list of products added to Wishlist

**Links to Resources:**

WishlistProductItem ([link](#markdown-header-wishlistproductitem-extends-partialproductitem))


**Response**

```
{
	data: WishlistProductItem[]
}
```

### 17. [POST] /myapi/wishlist/update

API for updating wishlist product

**Parameters**
```
{
	id: string,
	size:string,
	quantity?:number
}
```


**Response**

```
{
	success: boolean
}
```

### 18. [POST] /myapi/wishlist/sequencing

API for re-ordering wishlist

**Parameters**
```
{
	sequencing: [
		[wishlistId, sequence number]
	]
}
```


**Response**

```
{
	success: boolean
}
```

### 19. [DELETE] /myapi/wishlist/:productId

API for removing product from wishlist

**Parameters**
productId: number

**Response**

```
{
	success: boolean
}
```

### 20. [POST] /myapi/wishlist/:productId

API for adding product to wishlist

**Parameters**
productId: number

**Response**

```
{
	success: boolean
}
```

---

BASKET APIs START

---

### 21. [GET] /myapi/basket/details

API for getting cart details


**Response:** CartResponse ([link](#markdown-header-cartresponse))


### 22. [POST] /myapi/basket/add-product

API for adding product to cart

**Parameters**
```
{
	productId: number,
	quantity: number
}
```

**Response:** CartResponse ([link](#markdown-header-cartresponse))


### 23. [POST] /myapi/wishlist/move-to-wishlist

API for adding moving product to wishlist

**Parameters**
```
{
	basketLineId: number,
	size: string
}
```

**Links to Resources:**

CartResponse ([link](#markdown-header-cartresponse))


**Response**

```
{
	success: boolean,
	basket: CartResponse
}
```

### 24. [POST] /myapi/basket/remove-basket-line

API for adding removing product from cart

**Parameters**
```
{
	basketLineId: number,
}
```

**Links to Resources:**

CartResponse ([link](#markdown-header-cartresponse))


**Response**

```
{
	success: boolean,
	basket: CartResponse,
	shippable: boolean
}
```

### 25. [GET] /myapi/basket/get-shipping-charge

API for getting shipping charges


**Response**
```
{
	success: boolean,
	charge: number,
	message: string
}
```