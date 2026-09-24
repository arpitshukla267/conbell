// ---------- Types ----------
// Single source of truth for client data. Use CLIENTS in both the
// homepage carousel (ClientsCarousel) and the full clients page.

export interface Client {
  name: string;
  /** Logo path in /public. Falls back to a text badge with `name` when omitted. */
  logo?: string;
}

// ---------- Data ----------
// Logos live in /public/clients/logos/.

export const CLIENTS: Client[] = [
  { name: "Combat Engineering India Pvt Ltd", logo: "/clients/logos/1.png" },
  { name: "Maruti Suzuki India Ltd", logo: "/clients/logos/2.jpg" },
  { name: "M & B Engineering Ltd", logo: "/clients/logos/3.jpg" },
  { name: "Takenaka", logo: "/clients/logos/3.png" },
  { name: "Agrawal Metal Works Pvt Ltd", logo: "/clients/logos/4.png" },
  { name: "NKC", logo: "/clients/logos/5.png" },
  { name: "Daifuku", logo: "/clients/logos/6.png" },
  { name: "Suroj Buildcon Pvt Ltd", logo: "/clients/logos/7.webp" },
  { name: "KEI", logo: "/clients/logos/8.png" },
  { name: "Durr", logo: "/clients/logos/9.png" },
  { name: "Honda Motors", logo: "/clients/logos/10.png" },
];
