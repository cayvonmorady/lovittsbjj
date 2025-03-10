import React from 'react';

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Organization' | 'Event';
  data: any;
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
