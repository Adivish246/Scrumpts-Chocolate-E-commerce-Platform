import { db } from "./db";
import { products, collections } from "@shared/schema";
import { storage } from "./storage";

// Sample chocolates
const chocolates = [
  {
    name: "Dark Chocolate Truffles",
    description: "Luxurious dark chocolate truffles with a smooth ganache center",
    price: 2499,
    imageUrl: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1165&q=80",
    category: "truffles",
    type: "dark",
    featured: true,
    bestseller: true,
    weightGrams: 100,
    flavors: "Rich, bitter, smooth",
    ingredients: "Cocoa mass, cocoa butter, sugar, vanilla",
    shelfLife: "3 weeks",
    vegetarian: true
  },
  {
    name: "Milk Chocolate Bar",
    description: "Creamy milk chocolate bar with hints of caramel",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    category: "bars",
    type: "milk",
    featured: false,
    bestseller: true,
    weightGrams: 85,
    flavors: "Sweet, creamy, caramel",
    ingredients: "Milk solids, cocoa butter, sugar, cocoa mass, vanilla",
    shelfLife: "6 months",
    vegetarian: true
  },
  {
    name: "White Chocolate Raspberry",
    description: "Sweet white chocolate with tart raspberry pieces",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "bars",
    type: "white",
    featured: true,
    bestseller: false,
    weightGrams: 90,
    flavors: "Sweet, creamy, tart",
    ingredients: "Cocoa butter, sugar, milk solids, freeze-dried raspberries, vanilla",
    shelfLife: "4 months",
    vegetarian: true
  },
  {
    name: "Hazelnut Pralines",
    description: "Smooth milk chocolate filled with creamy hazelnut paste",
    price: 2299,
    imageUrl: "https://images.unsplash.com/photo-1605533640045-e831413503d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "pralines",
    type: "milk",
    featured: false,
    bestseller: true,
    weightGrams: 120,
    flavors: "Nutty, sweet, smooth",
    ingredients: "Milk chocolate, hazelnuts, sugar, vanilla",
    shelfLife: "2 weeks",
    vegetarian: true
  },
  {
    name: "Sea Salt Caramel Chocolate",
    description: "Dark chocolate filled with salted caramel",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1582176604856-e824b4736522?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1261&q=80",
    category: "filled",
    type: "dark",
    featured: true,
    bestseller: false,
    weightGrams: 110,
    flavors: "Sweet, salty, bitter",
    ingredients: "Dark chocolate, butter, cream, sugar, sea salt",
    shelfLife: "2 weeks",
    vegetarian: true
  },
  {
    name: "Mint Dark Chocolate Thins",
    description: "Thin dark chocolate pieces with refreshing mint",
    price: 1699,
    imageUrl: "https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    category: "thins",
    type: "dark",
    featured: false,
    bestseller: false,
    weightGrams: 75,
    flavors: "Minty, refreshing, bitter",
    ingredients: "Dark chocolate, peppermint oil, sugar",
    shelfLife: "4 months",
    vegetarian: true
  },
  {
    name: "Cherry Liqueur Chocolate",
    description: "Dark chocolate with cherry liqueur filling",
    price: 2499,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1272&q=80",
    category: "filled",
    type: "dark",
    featured: true,
    bestseller: false,
    weightGrams: 150,
    flavors: "Cherry, rich, boozy",
    ingredients: "Dark chocolate, cherries, sugar, cherry liqueur",
    shelfLife: "3 weeks",
    vegetarian: true
  },
  {
    name: "Orange Blossom Chocolate",
    description: "Milk chocolate infused with orange essence",
    price: 1799,
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "bars",
    type: "milk",
    featured: false,
    bestseller: true,
    weightGrams: 90,
    flavors: "Citrusy, floral, sweet",
    ingredients: "Milk chocolate, orange oil, orange zest, sugar",
    shelfLife: "4 months",
    vegetarian: true
  }
];

// Sample collections
const sampleCollections = [
  {
    name: "Luxury Assortment",
    description: "Our finest selection of handcrafted chocolates",
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    name: "Dark Chocolate Selection",
    description: "For the true dark chocolate connoisseur",
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
  },
  {
    name: "Seasonal Specials",
    description: "Limited edition chocolates using seasonal ingredients",
    imageUrl: "https://images.unsplash.com/photo-1614119068002-9af7f4ee5d96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
  },
  {
    name: "Gift Collections",
    description: "Perfect chocolates for presenting as gifts",
    imageUrl: "https://images.unsplash.com/photo-1621472128333-e228a8883e10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database...");
    
    // Check if products already exist
    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      console.log("Adding products...");
      for (const chocolate of chocolates) {
        await storage.createProduct(chocolate);
      }
      console.log(`Added ${chocolates.length} products`);
    } else {
      console.log(`Products already exist, skipping seeding`);
    }
    
    // Check if collections already exist
    const existingCollections = await db.select().from(collections);
    if (existingCollections.length === 0) {
      console.log("Adding collections...");
      for (const collection of sampleCollections) {
        await storage.createCollection(collection);
      }
      console.log(`Added ${sampleCollections.length} collections`);
    } else {
      console.log(`Collections already exist, skipping seeding`);
    }
    
    console.log("Database seeding complete");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Execute seed function if this file is run directly
if (process.argv[1].endsWith('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

export { seedDatabase };