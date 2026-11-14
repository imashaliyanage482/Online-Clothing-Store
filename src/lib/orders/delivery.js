export const citiesByProvince = {
  'Western Province': [
    'Colombo',
    'Colombo 01',
    'Colombo 02',
    'Colombo 03',
    'Colombo 04',
    'Colombo 05',
    'Colombo 06',
    'Colombo 07',
    'Colombo 08',
    'Colombo 09',
    'Colombo 10',
    'Colombo 11',
    'Colombo 12',
    'Colombo 13',
    'Colombo 14',
    'Colombo 15',
    'Dehiwala',
    'Mount Lavinia',
    'Dehiwala-Mount Lavinia',
    'Moratuwa',
    'Kotte',
    'Sri Jayawardenepura Kotte',
    'Maharagama',
    'Kesbewa',
    'Kaduwela',
    'Homagama',
    'Battaramulla',
    'Malabe',
    'Nugegoda',
    'Rajagiriya',
    'Piliyandala',
    'Athurugiriya',
    'Pannipitiya',
    'Kohuwala',
    'Ratmalana',
    'Boralesgamuwa',
    'Padukka',
    'Hanwella',
    'Gampaha',
    'Negombo',
    'Wattala',
    'Ja-Ela',
    'Katunayake',
    'Kelaniya',
    'Kiribathgoda',
    'Minuwangoda',
    'Mirigama',
    'Kadawatha',
    'Ragama',
    'Biyagama',
    'Nittambuwa',
    'Veyangoda',
    'Delgoda',
    'Divulapitiya',
    'Kandana',
    'Seeduwa',
    'Kalutara',
    'Panadura',
    'Horana',
    'Beruwala',
    'Aluthgama',
    'Matugama',
    'Wadduwa',
    'Bandaragama',
    'Ingiriya',
  ],
  'Central Province': ['Dambulla', 'Gampola', 'Kandy', 'Matale', 'Nawalapitiya', 'Nuwara Eliya', 'Peradeniya', 'Hatton'],
  'Southern Province': ['Ambalangoda', 'Galle', 'Hambantota', 'Matara', 'Tangalle', 'Hikkaduwa', 'Beliatta', 'Weligama'],
  'Northern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya', 'Point Pedro', 'Chavakachcheri'],
  'Eastern Province': ['Ampara', 'Batticaloa', 'Kalmunai', 'Trincomalee', 'Akkaraipattu', 'Kattankudy'],
  'North Western Province': ['Chilaw', 'Kuliyapitiya', 'Kurunegala', 'Puttalam', 'Marawila', 'Narammala', 'Wariyapola'],
  'North Central Province': ['Anuradhapura', 'Polonnaruwa', 'Kekirawa', 'Medawachchiya', 'Hingurakgoda'],
  'Uva Province': ['Badulla', 'Bandarawela', 'Monaragala', 'Wellawaya', 'Haputale', 'Mahiyanganaya'],
  'Sabaragamuwa Province': ['Kegalle', 'Ratnapura', 'Mawanella', 'Balangoda', 'Embilipitiya'],
};

function normalizeCity(city) {
  return typeof city === 'string' ? city.trim().toLowerCase() : '';
}

export function getProvinceForCity(city) {
  const normalizedCity = normalizeCity(city);
  if (!normalizedCity) return '';

  // 1. Exact match
  for (const [province, cities] of Object.entries(citiesByProvince)) {
    if (cities.some((c) => normalizeCity(c) === normalizedCity)) {
      return province;
    }
  }

  // 2. Substring match (e.g. "Colombo 07" matching "Colombo")
  for (const [province, cities] of Object.entries(citiesByProvince)) {
    if (cities.some((c) => normalizedCity.includes(normalizeCity(c)))) {
      return province;
    }
  }

  return '';
}

export function getDeliveryFee(city, province) {
  const resolvedProvince = getProvinceForCity(city) || (typeof province === 'string' ? province.trim() : '');
  return resolvedProvince === 'Western Province' ? 350 : 450;
}
