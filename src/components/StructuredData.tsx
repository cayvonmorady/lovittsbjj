import React from 'react';

interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: Array<{
    '@type': string;
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
  }>;
  image: string | string[];
  priceRange: string;
  socialLinks: string[];
}

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  socialLinks: string[];
}

interface EventData {
  name: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  image: string | string[];
  description: string;
  offers: {
    price: string | number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  performer: {
    name: string;
  };
}

type StructuredDataType = {
  LocalBusiness: LocalBusinessData;
  Organization: OrganizationData;
  Event: EventData;
};

interface StructuredDataProps {
  type: keyof StructuredDataType;
  data: StructuredDataType[keyof StructuredDataType];
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData;

  switch (type) {
    case 'LocalBusiness':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'MartialArtsSchool',
        name: data.name,
        description: data.description,
        url: data.url,
        telephone: data.telephone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.address.streetAddress,
          addressLocality: data.address.addressLocality,
          addressRegion: data.address.addressRegion,
          postalCode: data.address.postalCode,
          addressCountry: data.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
        },
        openingHoursSpecification: data.openingHours,
        image: data.image,
        priceRange: data.priceRange,
        sameAs: data.socialLinks,
      };
      break;
    case 'Organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logo,
        sameAs: data.socialLinks,
      };
      break;
    case 'Event':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: {
          '@type': 'Place',
          name: data.location.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.location.address.streetAddress,
            addressLocality: data.location.address.addressLocality,
            addressRegion: data.location.address.addressRegion,
            postalCode: data.location.address.postalCode,
            addressCountry: data.location.address.addressCountry,
          },
        },
        image: data.image,
        description: data.description,
        offers: {
          '@type': 'Offer',
          price: data.offers.price,
          priceCurrency: data.offers.priceCurrency,
          availability: data.offers.availability,
          url: data.offers.url,
        },
        performer: {
          '@type': 'Person',
          name: data.performer.name,
        },
      };
      break;
    default:
      structuredData = {};
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
