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
	collection: string,
	collectionUrl: string,
	sliderImages: ProductSliderImage[],
	childAttributes?: ChildProductAttributes[],
	sizeChartHTML: string
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

### 3. [GET] /myapi/footer-list/

**Response:** 
List:[link](#markdown-header-list)
```
footerList:[{
   name: string,
   value: List
}]
```