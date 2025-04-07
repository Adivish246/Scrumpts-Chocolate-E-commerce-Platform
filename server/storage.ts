import { 
  users, collections, products, cartItems, orders, orderItems, chatHistory,
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type Collection, type InsertCollection,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type ChatHistory, type InsertChatHistory,
  type Message
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(uid: string, preferences: any): Promise<User | undefined>;

  // Products
  getProducts(filter?: {category?: string, type?: string}): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getBestsellers(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;

  // Collections
  getCollections(): Promise<Collection[]>;
  getCollectionById(id: number): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;

  // Cart
  getCartItems(userId: string): Promise<CartItem[]>;
  getCartItemWithProduct(userId: string): Promise<(CartItem & {product: Product})[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;

  // Chat
  getChatHistory(userId: string): Promise<ChatHistory | undefined>;
  saveChatHistory(chatHistory: InsertChatHistory): Promise<ChatHistory>;
  updateChatHistory(id: number, messages: Message[]): Promise<ChatHistory | undefined>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private productsData: Map<number, Product>;
  private collectionsData: Map<number, Collection>;
  private cartItemsData: Map<number, CartItem>;
  private ordersData: Map<number, Order>;
  private orderItemsData: Map<number, OrderItem>;
  private chatHistoryData: Map<number, ChatHistory>;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentCollectionId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentChatHistoryId: number;

  constructor() {
    this.usersData = new Map();
    this.productsData = new Map();
    this.collectionsData = new Map();
    this.cartItemsData = new Map();
    this.ordersData = new Map();
    this.orderItemsData = new Map();
    this.chatHistoryData = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCollectionId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentChatHistoryId = 1;

    // Initialize with some sample products
    this.initializeProducts();
    // Initialize with some sample collections
    this.initializeCollections();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(user => user.uid === uid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.usersData.set(id, user);
    return user;
  }

  async updateUserPreferences(uid: string, preferences: any): Promise<User | undefined> {
    const user = await this.getUserByUid(uid);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      preferences: preferences 
    };
    
    this.usersData.set(user.id, updatedUser);
    return updatedUser;
  }

  // Product methods
  async getProducts(filter?: {category?: string, type?: string}): Promise<Product[]> {
    let products = Array.from(this.productsData.values());
    
    if (filter) {
      if (filter.category) {
        products = products.filter(p => p.category === filter.category);
      }
      if (filter.type) {
        products = products.filter(p => p.type === filter.type);
      }
    }
    
    return products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.productsData.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.productsData.values()).filter(p => p.featured);
  }

  async getBestsellers(): Promise<Product[]> {
    return Array.from(this.productsData.values()).filter(p => p.bestseller);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: now
    };
    this.productsData.set(id, product);
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.productsData.values()).filter(
      p => p.name.toLowerCase().includes(normalizedQuery) || 
          p.description.toLowerCase().includes(normalizedQuery)
    );
  }

  // Collection methods
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collectionsData.values());
  }

  async getCollectionById(id: number): Promise<Collection | undefined> {
    return this.collectionsData.get(id);
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.currentCollectionId++;
    const collection: Collection = { ...insertCollection, id };
    this.collectionsData.set(id, collection);
    return collection;
  }

  // Cart methods
  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItemsData.values()).filter(item => item.userId === userId);
  }

  async getCartItemWithProduct(userId: string): Promise<(CartItem & {product: Product})[]> {
    const cartItems = await this.getCartItems(userId);
    return cartItems.map(item => {
      const product = this.productsData.get(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItem = Array.from(this.cartItemsData.values()).find(
      item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      return this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + insertCartItem.quantity
      ) as Promise<CartItem>;
    }

    const id = this.currentCartItemId++;
    const now = new Date();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id, 
      createdAt: now 
    };
    this.cartItemsData.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItemsData.get(id);
    if (!cartItem) return undefined;

    const updatedItem = { ...cartItem, quantity };
    this.cartItemsData.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItemsData.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const cartItems = Array.from(this.cartItemsData.values()).filter(
      item => item.userId === userId
    );
    
    for (const item of cartItems) {
      this.cartItemsData.delete(item.id);
    }
    
    return true;
  }

  // Order methods
  async createOrder(
    insertOrder: InsertOrder, 
    insertOrderItems: InsertOrderItem[]
  ): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: now 
    };
    this.ordersData.set(id, order);

    // Create order items
    for (const item of insertOrderItems) {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = {
        ...item,
        id: orderItemId,
        orderId: id
      };
      this.orderItemsData.set(orderItemId, orderItem);
    }

    // Clear the cart
    await this.clearCart(insertOrder.userId);

    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.ordersData.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItemsData.values()).filter(
      item => item.orderId === orderId
    );
  }

  // Chat methods
  async getChatHistory(userId: string): Promise<ChatHistory | undefined> {
    return Array.from(this.chatHistoryData.values()).find(
      history => history.userId === userId
    );
  }

  async saveChatHistory(insertChatHistory: InsertChatHistory): Promise<ChatHistory> {
    const id = this.currentChatHistoryId++;
    const now = new Date();
    const chatHistory: ChatHistory = {
      ...insertChatHistory,
      id,
      createdAt: now
    };
    this.chatHistoryData.set(id, chatHistory);
    return chatHistory;
  }

  async updateChatHistory(id: number, messages: Message[]): Promise<ChatHistory | undefined> {
    const chatHistory = this.chatHistoryData.get(id);
    if (!chatHistory) return undefined;

    const updatedHistory = { ...chatHistory, messages };
    this.chatHistoryData.set(id, updatedHistory);
    return updatedHistory;
  }

  // Initialize with sample data
  private initializeProducts() {
    const products: InsertProduct[] = [
      {
        name: "Dark Chocolate Truffles",
        description: "Rich ganache center infused with vanilla bourbon",
        price: 64900, // Price in paise (INR)
        imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "Truffles",
        type: "Dark",
        rating: 4.9,
        featured: true,
        bestseller: false,
        weightGrams: 150,
        flavors: "Vanilla, Bourbon",
        ingredients: "Dark chocolate, cream, vanilla, bourbon",
        shelfLife: "1 month",
        vegetarian: true
      },
      {
        name: "Hazelnut Praline Box",
        description: "Creamy hazelnut praline with crunchy texture",
        price: 84900,
        imageUrl: "https://images.unsplash.com/photo-1572748844298-9a5d64d83943?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "Pralines",
        type: "Milk",
        rating: 4.7,
        featured: true,
        bestseller: false,
        weightGrams: 200,
        flavors: "Hazelnut, Caramel",
        ingredients: "Milk chocolate, hazelnuts, sugar, butter",
        shelfLife: "2 months",
        vegetarian: true
      },
      {
        name: "Luxury Gift Hamper",
        description: "24 assorted chocolates with premium packaging",
        price: 199900,
        imageUrl: "https://images.unsplash.com/photo-1593055357429-62eaf3b259ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "Gift Sets",
        type: "Assorted",
        rating: 5.0,
        featured: true,
        bestseller: true,
        weightGrams: 500,
        flavors: "Assorted",
        ingredients: "Dark, milk, and white chocolate, nuts, fruits, caramel",
        shelfLife: "2 months",
        vegetarian: true
      },
      {
        name: "Artisanal Milk Chocolate",
        description: "Creamy milk chocolate with caramel notes",
        price: 59900,
        imageUrl: "https://images.unsplash.com/photo-1583396618422-597b2755de3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "Bars",
        type: "Milk",
        rating: 4.8,
        featured: false,
        bestseller: false,
        weightGrams: 100,
        flavors: "Caramel, Vanilla",
        ingredients: "Milk chocolate, caramel",
        shelfLife: "3 months",
        vegetarian: true
      },
      {
        name: "White Chocolate with Raspberries",
        description: "Smooth white chocolate with freeze-dried raspberries",
        price: 54900,
        imageUrl: "https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Bars",
        type: "White",
        rating: 4.6,
        featured: false,
        bestseller: false,
        weightGrams: 100,
        flavors: "Raspberry",
        ingredients: "White chocolate, freeze-dried raspberries",
        shelfLife: "2 months",
        vegetarian: true
      },
      {
        name: "Single Origin Dark Chocolate",
        description: "72% cocoa from Ecuador with rich earthy notes",
        price: 79900,
        imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Bars",
        type: "Dark",
        rating: 4.9,
        featured: false,
        bestseller: true,
        weightGrams: 100,
        flavors: "Earthy, Fruity",
        ingredients: "Single origin dark chocolate from Ecuador",
        shelfLife: "6 months",
        vegetarian: true
      },
      {
        name: "Salted Caramel Bonbons",
        description: "Liquid caramel center with sea salt in dark chocolate shell",
        price: 89900,
        imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652422?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Bonbons",
        type: "Dark",
        rating: 4.8,
        featured: true,
        bestseller: true,
        weightGrams: 180,
        flavors: "Caramel, Sea Salt",
        ingredients: "Dark chocolate, caramel, sea salt, cream",
        shelfLife: "1 month",
        vegetarian: true
      },
      {
        name: "Pistachio Chocolate Bar",
        description: "Milk chocolate with roasted pistachios and a hint of salt",
        price: 69900,
        imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "Bars",
        type: "Milk",
        rating: 4.7,
        featured: false,
        bestseller: false,
        weightGrams: 120,
        flavors: "Pistachio, Salt",
        ingredients: "Milk chocolate, pistachios, sea salt",
        shelfLife: "3 months",
        vegetarian: true
      }
    ];

    for (const product of products) {
      this.createProduct(product);
    }
  }

  private initializeCollections() {
    const collections: InsertCollection[] = [
      {
        name: "Luxury Assortment",
        description: "Our signature collection with 12 unique flavors",
        imageUrl: "https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        name: "Handcrafted Truffles",
        description: "Delicate ganache centers with premium cocoa",
        imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        name: "Gift Boxes",
        description: "Customizable selections for any occasion",
        imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652422?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      }
    ];

    for (const collection of collections) {
      this.createCollection(collection);
    }
  }
}

export const storage = new MemStorage();
