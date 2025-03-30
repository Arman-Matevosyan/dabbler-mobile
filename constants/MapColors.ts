export const lightMapStyle = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#a9dfff',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5f9f0',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 10,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c0e8ca',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#333333',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#888888',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#a0caf5',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c7dbf5',
      },
    ],
  },
];

export const darkMapStyle = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#052f43',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#0f1b29',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#1c3148',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#0d1624',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#1c3148',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#2f4369',
      },
      {
        weight: 1,
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#dbe5ff',
      },
    ],
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#dbe5ff',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#4f8daf',
      },
    ],
  },
];
