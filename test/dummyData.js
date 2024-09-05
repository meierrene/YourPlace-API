let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Santa Claus Village',
    description: "Famous Santa's village located in the heart of Finland",
    imageUrl:
      'https://santaclausvillage.info/wp-content/uploads/2023/07/santa-claus-village-under-northern-lights-europevideoprod-copy-750x504-1.jpg',
    address: 'Tarvantie 1 96930 Rovaniemi, Finland',
    location: { lat: 66.5434888, lng: 25.8476837 },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Neuschwanstein Castle',
    description:
      'The most beautiful castle located in the southern most Germany Region',
    imageUrl:
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0b/f4/01/cb.jpg',
    address: 'Neuschwansteinstrasse 20, 87645 Schwangau, Germany',
    location: { lat: 47.5575803, lng: 10.7497969 },
    creator: 'u2',
  },
];

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'USER #1',
    image: 'https://i.pravatar.cc/300',
    places: 6,
  },
  {
    id: 'u2',
    name: 'USER #2',
    image: 'https://i.pravatar.cc/300',
    places: 5,
  },
  {
    id: 'u3',
    name: 'USER #1',
    image: 'https://i.pravatar.cc/300',
    places: 4,
  },
];

module.exports = { DUMMY_PLACES, DUMMY_USERS };
