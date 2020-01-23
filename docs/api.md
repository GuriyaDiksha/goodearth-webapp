## API Endpoints

### [GET] /myapi/products/:id

**Parameters**

id: number

**Response:** Product ([link](#markdown-header-product-extends-partialproductitem))

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

### ProductImage *extends* [**ProductSliderImage**](#markdown-header-productsliderimage)

```
{
  badgeImage?: string,
  badgeImagePDP?: string
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

### PartialProductItem

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
	partial: boolean,
	markAs?: string[],
	childAttributes?: PartialChildProductAttributes[]
}
```

### Product *extends* [PartialProductItem](#markdown-header-partialproductitem)

**Links to Resources:**

Breadcrumb: [link](#markdown-header-breadcrumb)

ProductSliderImage: [link](#markdown-header-productsliderimage)

ChildProductAttributes: [link](#markdown-header-childproductattributes-extends-partialchildproductattributes)
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
	collectionUrl: string,
	sliderimages: ProductSliderImage[],
	childAttributes?: ChildProductAttributes[]
}
```