import { gql } from "@apollo/client";

/** Matches live WordPress ACF GraphQL field names */
const activityFieldsFragment = `
  activityFields {
    activityDate
    activityTime
    activityLocation
    activityStatus
    registrationUrl
    eventEndDate
  }
`;

const promotionFieldsFragment = `
  promotionFields {
    promotionType
    videoUrl
    promotionDate
    pdfFile {
      node {
        sourceUrl
        mediaItemUrl
      }
    }
  }
`;

const featuredImageFragment = `
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
`;

export const GET_ACTIVITIES = gql`
  query GetActivities($first: Int = 50) {
    activities(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        date
        excerpt
        ${featuredImageFragment}
        ${activityFieldsFragment}
      }
    }
  }
`;

export const GET_ACTIVITY_BY_SLUG = gql`
  query GetActivityBySlug($slug: ID!) {
    activity(id: $slug, idType: URI) {
      id
      slug
      title
      date
      excerpt
      content
      ${featuredImageFragment}
      ${activityFieldsFragment}
    }
  }
`;

export const GET_PROMOTIONS = gql`
  query GetPromotions($first: Int = 50) {
    promotions(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        date
        excerpt
        ${featuredImageFragment}
        ${promotionFieldsFragment}
      }
    }
  }
`;

export const GET_PROMOTION_BY_SLUG = gql`
  query GetPromotionBySlug($slug: ID!) {
    promotion(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      excerpt
      content
      ${featuredImageFragment}
      ${promotionFieldsFragment}
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      slug
      title
      content
      date
    }
  }
`;

export const GET_SITE_CONTACT = gql`
  query GetSiteContact {
    siteContactFields {
      contactAddress
      contactPhone
      contactEmail
    }
  }
`;

export const GET_ACTIVITIES_QUERY = `
  query GetActivities($first: Int = 50) {
    activities(first: $first, where: { status: PUBLISH }) {
      nodes {
        id slug title date excerpt
        ${featuredImageFragment}
        ${activityFieldsFragment}
      }
    }
  }
`;

export const GET_ACTIVITY_BY_SLUG_QUERY = `
  query GetActivityBySlug($slug: ID!) {
    activity(id: $slug, idType: URI) {
      id slug title date excerpt content
      ${featuredImageFragment}
      ${activityFieldsFragment}
    }
  }
`;

export const GET_PROMOTIONS_QUERY = `
  query GetPromotions($first: Int = 50) {
    promotions(first: $first, where: { status: PUBLISH }) {
      nodes {
        id slug title date excerpt
        ${featuredImageFragment}
        ${promotionFieldsFragment}
      }
    }
  }
`;

export const GET_PROMOTION_BY_SLUG_QUERY = `
  query GetPromotionBySlug($slug: ID!) {
    promotion(id: $slug, idType: SLUG) {
      id slug title date excerpt content
      ${featuredImageFragment}
      ${promotionFieldsFragment}
    }
  }
`;

export const GET_PAGE_BY_SLUG_QUERY = `
  query GetPageBySlug($uri: ID!) {
    page(id: $uri, idType: URI) {
      id slug title content date
    }
  }
`;

export const GET_SITE_CONTACT_QUERY = `
  query GetSiteContact {
    siteContactFields {
      contactAddress
      contactPhone
      contactEmail
    }
  }
`;

/** Fallback query without optional plugin fields (eventEndDate, pdfFile) */
export const GET_ACTIVITIES_QUERY_SAFE = `
  query GetActivities($first: Int = 50) {
    activities(first: $first, where: { status: PUBLISH }) {
      nodes {
        id slug title date excerpt content
        ${featuredImageFragment}
        activityFields {
          activityDate
          activityTime
          activityLocation
          activityStatus
          registrationUrl
        }
      }
    }
  }
`;

export const GET_PROMOTIONS_QUERY_SAFE = `
  query GetPromotions($first: Int = 50) {
    promotions(first: $first, where: { status: PUBLISH }) {
      nodes {
        id slug title date excerpt content
        ${featuredImageFragment}
        promotionFields {
          promotionType
          videoUrl
          promotionDate
        }
      }
    }
  }
`;

export const GET_ACTIVITY_BY_SLUG_QUERY_SAFE = `
  query GetActivityBySlug($slug: ID!) {
    activity(id: $slug, idType: URI) {
      id slug title date excerpt content
      ${featuredImageFragment}
      activityFields {
        activityDate
        activityLocation
        activityStatus
        registrationUrl
      }
    }
  }
`;

export const GET_PROMOTION_BY_SLUG_QUERY_SAFE = `
  query GetPromotionBySlug($slug: ID!) {
    promotion(id: $slug, idType: SLUG) {
      id slug title date excerpt content
      ${featuredImageFragment}
      promotionFields {
        promotionType
        videoUrl
      }
    }
  }
`;
