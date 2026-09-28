const SHOP_QUERY = `
query {
    shop {
        id
        name
        email
        currencyCode
        ianaTimezone
        weightUnit
        primaryDomain {
            host
        }
        plan {
            publicDisplayName
            shopifyPlus
        }
        billingAddress {
            city
            country
            province
        }
        shopOwnerName
        currencyFormats {
            moneyFormat
            moneyWithCurrencyFormat
        }
    }
}
`;

const SET_METAFIELD_MUTATION = `
mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
        metafields {
            id
            namespace
            key
            value
            type
        }
        userErrors {
            field
            message
        }
    }
}
`;

const GET_METAFIELD_QUERY = `
query getShopMetafield($namespace: String!, $key: String!) {
  shop {
    id
    metafield(namespace: $namespace, key: $key) {
      id
      value
    }
  }
}
`;

const WEB_PIXEL_CREATE_MUTATION = `
mutation webPixelCreate($webPixel: WebPixelInput!) {
  webPixelCreate(webPixel: $webPixel) {
    userErrors {
      code
      field
      message
    }
    webPixel {
      id
      settings
    }
  }
}
`;

const WEB_PIXEL_DELETE_MUTATION = `
mutation webPixelDelete($id: ID!) {
  webPixelDelete(id: $id) {
    deletedWebPixelId
    userErrors {
      code
      field
      message
    }
  }
}
`;

const APP_ACCESS_SCOPES_QUERY = `
query {
  app {
    availableAccessScopes {
      handle
      description
    }
  }
}
`;

module.exports = {
  SHOP_QUERY,
  SET_METAFIELD_MUTATION,
  GET_METAFIELD_QUERY,
  WEB_PIXEL_CREATE_MUTATION,
  WEB_PIXEL_DELETE_MUTATION,
  APP_ACCESS_SCOPES_QUERY,
};
