# get_to_easy_Internship

## Get To Easy

**Get To Easy** is a front-end e-commerce storefront project inspired by online shopping in Bangladesh. It includes multiple HTML prototypes for a responsive homepage, product listings, and product galleries, along with their static assets.

> **Main project entry point:** The project runs from [`gettoeasy-assets/homepage.html`](gettoeasy-assets/homepage.html). Open this file with a local web server, such as VS Code Live Server, to start the main website.

> **Project status:** This is a front-end prototype/static website. It does not include a backend or API to manage products, carts, wishlists, checkout, accounts, or payments.

## Pages

| Page | Description |
| --- | --- |
| [`gettoeasy-assets/homepage.html`](gettoeasy-assets/homepage.html) | Main storefront homepage, with its CSS and homepage JavaScript |
| [`homepage2.html`](homepage2.html) | Alternative homepage layout with product sections |
| [`homepage4.html`](homepage4.html) | Another visual homepage prototype |
| [`product-gallery.html`](product-gallery.html) and [`product-gallery2.html`](product-gallery2.html) | Product gallery and product display prototypes |
| [`gettoeasy-product-homepage/shop.html`](gettoeasy-product-homepage/shop.html) | Shop and product listing page |
| [`gettoeasy-product-homepage/product-gallery.html`](gettoeasy-product-homepage/product-gallery.html) | Product gallery page for the shop prototype |

## Main Homepage

The main homepage is [`gettoeasy-assets/homepage.html`](gettoeasy-assets/homepage.html). It presents a Get To Easy online-storefront layout with:

- A header with the store logo, customer-care link and phone number, login/registration link, and product search field
- Shortcuts for compare, wishlist, and cart, plus navigation for Ramadan grocery packages, flash sales, brands, categories, and the blog
- Product-category browsing and promotional/product sections for visitors to explore
- Responsive styling for desktop and mobile screens

The page is a static HTML snapshot, not a complete live e-commerce application. Some links lead to local demo pages in this repository, while some category and promotion links and visual assets still point to the Get To Easy website. Account, cart, wishlist, and checkout actions are not connected to a project backend.

## Features

- E-commerce storefront and product-focused page layouts
- Product cards and category- or section-based displays
- Product gallery interface
- Responsive styling for different screen sizes
- JavaScript-powered carousel and gallery interactions on some pages
- Local product search across 55 catalog items, with product-image suggestions and a matching local product card when an item is selected
- Category browsing, flash-sale filtering, and browser-stored cart, wishlist, and compare lists
- Local demo pages for customer care and account forms
- Separate page prototypes and their required local assets

> Designs and interactions may vary between pages. Visible cart, wishlist, search, or checkout interfaces should not be considered functional backend-powered features.
> Cart, wishlist, and compare data are stored in the current browser. Login, registration, support requests, newsletter subscriptions, and checkout are demo-only and are not connected to a backend.
> The product catalog is a local static dataset in `javascript/gettoeasy-product-homepage/products.js`; its product images are stored locally in `gettoeasy-product-homepage/images/`.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Bootstrap 5 (loaded from a CDN on some pages)

No package manager or build step is required. However, some pages load stylesheets, fonts, icons, Bootstrap, and images from remote URLs or CDNs, so an internet connection may be needed to view them correctly.

## Getting Started

### Using VS Code Live Server

1. Open the repository in VS Code.
2. Right-click [`gettoeasy-assets/homepage.html`](gettoeasy-assets/homepage.html).
3. Select **Open with Live Server**.
4. To view other prototypes, open `homepage2.html`, `homepage4.html`, `product-gallery.html`, `product-gallery2.html`, or an HTML file in `gettoeasy-product-homepage` with Live Server.

You can also open an HTML file directly in a browser. Using a local web server is recommended for reliably testing relative asset paths and JavaScript.

## Project structure

```text
.
├── README.md
├── homepage2.html
├── homepage4.html
├── product-gallery.html
├── product-gallery2.html
├── gettoeasy-assets/
│   ├── homepage.html
│   ├── css/
│   └── download-manifest.csv
├── gettoeasy-product-homepage/
│   ├── account.html
│   ├── blog.html
│   ├── help.html
│   ├── shop.html
│   ├── product-gallery.html
│   └── images/
└── javascript/
    ├── homepage2.js
    ├── homepage4.js
    ├── product-gallery.js
    ├── product-gallery2.js
    ├── gettoeasy-assets/
    │   ├── homepage.js
    │   └── storefront.js
    └── gettoeasy-product-homepage/
        ├── products.js
        └── shop.js
```

## Contributing

For bug reports, UI improvements, or new prototypes, open a GitHub issue or submit a pull request. Before submitting changes, make sure the relevant HTML asset paths and JavaScript references are correct.
