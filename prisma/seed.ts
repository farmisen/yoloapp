import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const cuisines = [
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "Thai",
    "American",
    "French",
    "Mediterranean",
    "Korean"
  ]

  // Function to generate fitting restaurant names for a given cuisine
  const generateRestaurantName = (cuisine: string): string => {
    const cuisineThemes = (cuisine: string) =>
      ({
        Italian: [
          "La Trattoria",
          "Pasta Bella",
          "Ristorante Roma",
          "Il Forno",
          "Viva Italia"
        ],
        Mexican: [
          "El Camino",
          "Casa de Tacos",
          "Los Sabores",
          "Cactus Grill",
          "Tequila Sunrise"
        ],
        Chinese: [
          "Golden Dragon",
          "Red Lantern",
          "Peking Palace",
          "Shanghai Express",
          "Bamboo Garden"
        ],
        Japanese: [
          "Sakura Sushi",
          "Tokyo Table",
          "Mount Fuji Grill",
          "Zen Ramen",
          "Hibachi House"
        ],
        Indian: [
          "Curry Corner",
          "Spice Junction",
          "Tandoori Flame",
          "Maharaja's Feast",
          "Bollywood Bites"
        ],
        Thai: [
          "Thai Orchid",
          "Bangkok Bistro",
          "Lemongrass Kitchen",
          "Chiang Mai Cafe",
          "Golden Elephant"
        ],
        American: [
          "Route 66 Diner",
          "Liberty Grill",
          "The Backyard BBQ",
          "Eagle's Diner",
          "Stars and Stripes"
        ],
        French: [
          "Café Paris",
          "Le Petit Bistro",
          "Maison de Provence",
          "The Velvet Croissant",
          "Château Gourmand"
        ],
        Mediterranean: [
          "Olive & Fig",
          "Santorini Taverna",
          "Mediterraneo",
          "Aegean Breeze",
          "Basil & Lemon"
        ],
        Korean: [
          "Kimchi Corner",
          "Seoul Food",
          "Bibimbap House",
          "Gangnam Grill",
          "The Bulgogi Table"
        ]
      })[cuisine]

    const theme = cuisineThemes(cuisine)
    return theme![Math.floor(Math.random() * theme!.length)]!
  }

  // Generate mock data for ~30 restaurants
  const micrositeData = Array.from({ length: 30 }, () => {
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)]!
    const name = generateRestaurantName(cuisine)
    const phone = faker.phone.number({ style: "national" })
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    return {
      name,
      phone,
      email: `${slug}@example.com`,
      cuisine,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 2)
      ),
      updatedAt: new Date(
        Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)
      ),
      slug
    }
  })

  // Deduplicate by email
  const uniqueMicrositeData = Array.from(
    new Map(micrositeData.map((item) => [item.email, item])).values()
  )

  // Upsert data into the Microsite table
  for (const microsite of uniqueMicrositeData) {
    await prisma.microsite.upsert({
      where: { slug: microsite.slug }, // Use the slug as the unique identifier for upsert
      update: {},
      create: microsite
    })
  }

  console.log("Mock data for 30 restaurants has been successfully inserted!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
