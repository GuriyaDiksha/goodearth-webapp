# API Endpoints and Response Structure

## API Endpoints

### [GET] /myapi/products/:id
Response: [Product](#Product)

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

### ProductImage *extends* **ProductSliderImage**

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

### ChildProductAttributes *extends* PartialChildProductAttributes
```
{
  	discountedPriceRecords: PriceRecord,
	id: number,
	isBridalProduct: boolean
}
```

### PartialProductItem
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

### Product *extends* PartialProductItem (#product)
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