var snp_theme_id = Shopify.theme.theme_store_id;
window.snpmitSelectors = {};

// Dawn
if (snp_theme_id == 887) {
  snpmitSelectors = {
    collectionGridItem: ".grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle: ".card__heading a.full-unstyled-link",
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl: ".card__heading a.full-unstyled-link",
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpSalePrice: ".price-item--sale",
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",
    cartItem: ".cart-item",
    cartTotal: ".totals__total-value",
    cartWidgetAppendTarget: ".totals",
    cartWidgetPlacement: "after",
    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: ".cart-notification__links",
    minCartWidgetPlacement: "after",
    cartDrawerItem: "#CartDrawer .cart-item",
    cartDrawerTotal: ".cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: ".cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Refresh
if (snp_theme_id == 1567) {
  snpmitSelectors = {
    collectionGridItem: "product-component",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".quick-add__submit[disabled]",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",
    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",
    cartDrawerItem: "#CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Sense
if (snp_theme_id == 1356) {
  snpmitSelectors = {
    collectionGridItem: "#product-grid .grid__item, .product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Trade
if (snp_theme_id == 2699) {
  snpmitSelectors = {
    collectionGridItem: "#product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".quick-add__submit[disabled]",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer-CartItems .cart-item",
    cartDrawerTotal:
      ".drawer__footer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget:
      ".drawer__footer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Craft
if (snp_theme_id == 1368) {
  snpmitSelectors = {
    collectionGridItem: "#product-grid .grid__item, .product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer-CartItems .cart-item",
    cartDrawerTotal:
      ".drawer__footer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget:
      ".drawer__footer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Spotlight
if (snp_theme_id == 1891) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}
// Studio
if (snp_theme_id == 1431) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Taste
if (snp_theme_id == 1434) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

//Origin
if (snp_theme_id == 1841) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

//Ride
if (snp_theme_id == 1500) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Colorblock
if (snp_theme_id == 1499) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Publisher
if (snp_theme_id == 1864) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Crave
if (snp_theme_id == 1363) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid .grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl:
      '.card__heading a.full-unstyled-link[href*="/products/"]',
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: "#main-cart-items .cart-item",
    cartTotal: "#main-cart-footer .totals__total-value",
    cartWidgetAppendTarget: "#main-cart-footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: "#cart-notification .cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer #CartDrawer-CartItems .cart-item",
    cartDrawerTotal: "#CartDrawer .cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: "#CartDrawer .cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

// Fabric
if (snp_theme_id == 3622) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__slide",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#cart-drawer .cart-items__table-row",
    cartDrawerTotal: "#cart-drawer .cart-totals__total-value",
    cartDrawerWidgetAppendTarget: "#cart-drawer .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Horizon
if (snp_theme_id === 2481) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#cart-drawer .cart-items__table-row",
    cartDrawerTotal: "#cart-drawer .cart-totals__total-value",
    cartDrawerWidgetAppendTarget: "#cart-drawer .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Savor
if (snp_theme_id === 3626) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price [ref='priceContainer']",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: ".cart-drawer__items .cart-items__table-row",
    cartDrawerTotal: ".cart-drawer__summary .cart-totals__total-value",
    cartDrawerWidgetAppendTarget:
      ".cart-drawer__summary .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Dwell
if (snp_theme_id === 3623) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price [ref='priceContainer']",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: ".cart-drawer__items .cart-items__table-row",
    cartDrawerTotal: ".cart-drawer__summary .cart-totals__total-value",
    cartDrawerWidgetAppendTarget:
      ".cart-drawer__summary .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Pitch
if (snp_theme_id === 3620) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price [ref='priceContainer']",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: ".cart-drawer__items .cart-items__table-row",
    cartDrawerTotal: ".cart-drawer__summary .cart-totals__total-value",
    cartDrawerWidgetAppendTarget:
      ".cart-drawer__summary .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Rise
if (snp_theme_id === 2738) {
  snpmitSelectors = {
    collectionGridItem: ".grid__item",
    collectionSalePrice:
      ".price__sale .price-item--sale.price-item--last, .price__regular .price-item--regular",
    collectionProductId: "product-component[view-event-payload]",
    collectionProductHandle: ".card__heading a.full-unstyled-link",
    collectionProductName: ".card__heading a.full-unstyled-link",
    collectionVariantId: "",
    collectionProductAvailable: ".price--sold-out",
    collectionProductUrl: ".card__heading a.full-unstyled-link",
    collectionWidgetAppendTarget: ".card-information .price--on-sale",
    collectionWidgetPlacement: "after",

    pdpProductId: 'input[name="product-id"]',
    pdpSalePrice: ".price__container .price-item.price-item--sale",
    pdpProductHandle: '.product__title a[href*="/products/"]',
    pdpProductName: ".product__title h1",
    pdpVariantId: 'input[name="id"].product-variant-id',
    pdpProductAvailable: ".product-form__submit[disabled]",
    pdpProductUrl: '.product__title a[href*="/products/"]',
    pdpWidgetAppendTarget: '[id^="price-"]',
    pdpWidgetPlacement: "after",

    cartItem: ".cart-item",
    cartTotal: ".cart__footer .totals__total-value",
    cartWidgetAppendTarget: ".cart__footer .totals",
    cartWidgetPlacement: "after",

    minCartItem: "#cart-notification-product",
    minCartTotal: "",
    minCartWidgetAppendTarget: ".cart-notification__links",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#CartDrawer .cart-item",
    cartDrawerTotal: ".cart-drawer__footer .totals__total-value",
    cartDrawerWidgetAppendTarget: ".cart-drawer__footer .totals",
    cartDrawerWidgetPlacement: "after",
  };
}

//Tinker
if (snp_theme_id === 3627) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#cart-drawer .cart-items__table-row",
    cartDrawerTotal: "#cart-drawer .cart-totals__total-value",
    cartDrawerWidgetAppendTarget: "#cart-drawer .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Atelier
if (snp_theme_id === 3621) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#cart-drawer .cart-items__table-row",
    cartDrawerTotal: "#cart-drawer .cart-totals__total-value",
    cartDrawerWidgetAppendTarget: "#cart-drawer .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Heritage
if (snp_theme_id === 3624) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#cart-drawer .cart-items__table-row",
    cartDrawerTotal: "#cart-drawer .cart-totals__total-value",
    cartDrawerWidgetAppendTarget: "#cart-drawer .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Ritual
if (snp_theme_id === 3625) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#cart-drawer .cart-items__table-row",
    cartDrawerTotal: "#cart-drawer .cart-totals__total-value",
    cartDrawerWidgetAppendTarget: "#cart-drawer .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}

//Vessel
if (snp_theme_id === 3628) {
  snpmitSelectors = {
    collectionGridItem: ".product-grid__item, .resource-list__item",
    collectionSalePrice: "product-price [ref='priceContainer'] .price",
    collectionProductId: "product-card[data-product-id]",
    collectionProductHandle:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionProductName:
      'product-card a[ref="productTitleLink"] [role="heading"]',
    collectionVariantId: "",
    collectionProductAvailable:
      ".product-badges__badge.color-custom-badge-sold-out",
    collectionProductUrl:
      'product-card a[ref="productTitleLink"][href*="/products/"]',
    collectionWidgetAppendTarget: "product-price",
    collectionWidgetPlacement: "after",

    pdpProductId: "product-form-component[data-product-id]",
    pdpSalePrice: "product-price [ref='priceContainer'] .price",
    pdpProductHandle: '.view-product-title a[href*="/products/"]',
    pdpProductName: '[data-testid="product-information-details"] h1',
    pdpVariantId:
      'form[data-type="add-to-cart-form"] input[name="id"][ref="variantId"]',
    pdpProductAvailable: '[data-testid="standalone-add-to-cart"][disabled]',
    pdpProductUrl: '.view-product-title a[href*="/products/"]',
    pdpWidgetAppendTarget: "product-price[data-product-id]",
    pdpWidgetPlacement: "after",

    cartItem: ".cart-page__items .cart-items__table-row",
    cartTotal: ".cart-page__summary .cart-totals__total-value",
    cartWidgetAppendTarget: ".cart-page__summary .cart-totals__container",
    cartWidgetPlacement: "after",

    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",

    cartDrawerItem: "#cart-drawer .cart-items__table-row",
    cartDrawerTotal: "#cart-drawer .cart-totals__total-value",
    cartDrawerWidgetAppendTarget: "#cart-drawer .cart-totals__container",
    cartDrawerWidgetPlacement: "after",
  };
}
