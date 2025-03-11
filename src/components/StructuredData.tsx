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
    latitude: string | number;
    longitude: string | number;
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
  description?: string; 
}

interface EventData {
  name: string;
  url: string; 
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

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Organization' | 'Event';
  data: LocalBusinessData | OrganizationData | EventData;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData;

  switch (type) {
    case 'LocalBusiness': {
      const businessData = data as LocalBusinessData;
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'MartialArtsSchool',
        name: businessData.name,
        description: businessData.description,
        url: businessData.url,
        telephone: businessData.telephone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: businessData.address.streetAddress,
          addressLocality: businessData.address.addressLocality,
          addressRegion: businessData.address.addressRegion,
          postalCode: businessData.address.postalCode,
          addressCountry: businessData.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: businessData.geo.latitude,
          longitude: businessData.geo.longitude,
        },
        openingHoursSpecification: businessData.openingHours,
        image: businessData.image,
        priceRange: businessData.priceRange,
        sameAs: businessData.socialLinks,
      };
      break;
    }
    case 'Organization': {
      const orgData = data as OrganizationData;
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: orgData.name,
        url: orgData.url,
        logo: orgData.logo,
        sameAs: orgData.socialLinks,
      };
      break;
    }
    case 'Event': {
      const eventData = data as EventData;
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: eventData.name,
        url: eventData.url,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        location: {
          '@type': 'Place',
          name: eventData.location.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: eventData.location.address.streetAddress,
            addressLocality: eventData.location.address.addressLocality,
            addressRegion: eventData.location.address.addressRegion,
            postalCode: eventData.location.address.postalCode,
            addressCountry: eventData.location.address.addressCountry,
          },
        },
        image: eventData.image,
        description: eventData.description,
        offers: {
          '@type': 'Offer',
          price: eventData.offers.price,
          priceCurrency: eventData.offers.priceCurrency,
          availability: eventData.offers.availability,
          url: eventData.offers.url,
        },
        performer: {
          '@type': 'Person',
          name: eventData.performer.name,
        },
      };
      break;
    }
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
