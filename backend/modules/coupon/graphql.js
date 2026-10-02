const SHOPIFY_DISCOUNT_QUERY = `
  query getShopifyDiscount($query: String!) {
    codeDiscountNodes(first: 1, query: $query) {
      nodes {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
            startsAt
            endsAt
            summary
          }
          ... on DiscountCodeBxgy {
            title
            status
            startsAt
            endsAt
            summary
          }
          ... on DiscountCodeFreeShipping {
            title
            status
            startsAt
            endsAt
            summary
          }
        }
      }
    }
  }
`;

/**
 * Fetch and validate discount code from Shopify GraphQL
 */
const getShopifyDiscountByCode = async (graphqlClient, code) => {
  const cleanCode = code.trim().toUpperCase();
  const gqlRes = await graphqlClient.request(SHOPIFY_DISCOUNT_QUERY, {
    variables: { query: cleanCode },
  });

  const node = gqlRes.data?.codeDiscountNodes?.nodes?.[0];
  const cd = node?.codeDiscount;

  if (!node || !cd) return null;

  return {
    shopifyDiscountId: node.id,
    code: cleanCode,
    title: cd.title || cleanCode,
    status: cd.status ? String(cd.status).toUpperCase() : 'ACTIVE',
    startsAt: cd.startsAt ? new Date(cd.startsAt) : null,
    endsAt: cd.endsAt ? new Date(cd.endsAt) : null,
    summary: cd.summary || cd.title || `${cleanCode} offer`,
  };
};

module.exports = {
  SHOPIFY_DISCOUNT_QUERY,
  getShopifyDiscountByCode,
};

