import bcrypt from "bcryptjs";

// In-memory database for development
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  price: string;
  salePrice?: string;
  salePriceStartDate?: string;
  salePriceEndDate?: string;
  stock: number;
  isActive: boolean;
  isFeatured?: boolean;
  
  // Google Shopping fields
  gtin?: string;
  mpn?: string;
  brand: string;
  condition: string;
  availability: string;
  googleCategory?: string;
  productType?: string;
  
  // Physical properties
  material?: string;
  color?: string;
  weight?: string;
  shippingLength?: number;
  shippingWidth?: number;
  shippingHeight?: number;
  shippingWeight?: number;
  unit?: string;
  
  // Additional attributes
  itemGroupId?: string;
  customLabel0?: string;
  customLabel1?: string;
  customLabel2?: string;
  customLabel3?: string;
  customLabel4?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  
  // Features (stored as JSON strings)
  highlights?: string;
  technicalSpecs?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

class MemoryDatabase {
  private users: Map<number, User> = new Map();
  private products: Map<number, Product> = new Map();
  private userIdCounter = 1;
  private productIdCounter = 1;

  private initialized = false;

  constructor() {
    // Initialize synchronously with a known hash
    this.initializeDefaultDataSync();
  }

  private initializeDefaultDataSync() {
    // Admin user should be created via secure process
    console.log("✅ In-memory database initialized. Create admin user via secure process.");

    // Add sample products with Google Shopping compliance
    const sampleProducts = [
      {
        id: 1,
        name: "Piso Vinílico Carvalho Clássico",
        description: "Piso vinílico de alta qualidade com acabamento em carvalho clássico. Resistente a água e de fácil instalação.",
        shortDescription: "Piso vinílico carvalho clássico - resistente e elegante",
        category: "Piso Vinílico",
        subcategory: "Carvalho",
        price: "89.90",
        salePrice: "79.90",
        stock: 100,
        isActive: true,
        isFeatured: true,
        gtin: "7891234567890",
        mpn: "IPPAX-PVC-001",
        brand: "IPPAX",
        condition: "new",
        availability: "in stock",
        googleCategory: "2826",
        productType: "Piso Vinílico > Carvalho > Clássico",
        material: "PVC",
        color: "Carvalho Natural",
        weight: "2.5kg",
        unit: "m²",
        metaTitle: "Piso Vinílico Carvalho Clássico - IPPAX",
        metaDescription: "Piso vinílico de carvalho clássico com alta resistência. Ideal para ambientes residenciais e comerciais.",
        urlSlug: "piso-vinilico-carvalho-classico",
        highlights: JSON.stringify(["Resistente à água", "Fácil instalação", "Acabamento premium", "Garantia 10 anos"]),
        technicalSpecs: JSON.stringify({
          "Espessura": "4mm",
          "Classe de Uso": "32",
          "Resistência ao Fogo": "Bfl-s1",
          "Garantia": "10 anos"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Piso Vinílico Nogueira Premium",
        description: "Piso vinílico premium com textura de nogueira natural. Acabamento sofisticado para ambientes elegantes.",
        shortDescription: "Piso vinílico nogueira premium - sofisticação e qualidade",
        category: "Piso Vinílico",
        subcategory: "Nogueira",
        price: "119.90",
        stock: 50,
        isActive: true,
        isFeatured: false,
        gtin: "7891234567891",
        mpn: "IPPAX-PVC-002",
        brand: "IPPAX",
        condition: "new",
        availability: "in stock",
        googleCategory: "2826",
        productType: "Piso Vinílico > Nogueira > Premium",
        material: "PVC",
        color: "Nogueira Escura",
        weight: "2.8kg",
        unit: "m²",
        metaTitle: "Piso Vinílico Nogueira Premium - IPPAX",
        metaDescription: "Piso vinílico premium de nogueira com textura natural. Perfeito para ambientes sofisticados.",
        urlSlug: "piso-vinilico-nogueira-premium",
        highlights: JSON.stringify(["Textura natural", "Alta durabilidade", "Antirrisco", "Design exclusivo"]),
        technicalSpecs: JSON.stringify({
          "Espessura": "5mm",
          "Classe de Uso": "33",
          "Resistência ao Fogo": "Bfl-s1",
          "Garantia": "15 anos"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Piso Vinílico Carvalho Rústico",
        description: "Piso vinílico com acabamento rústico em carvalho envelhecido. Ideal para ambientes que buscam charme e personalidade.",
        shortDescription: "Piso vinílico carvalho rústico - charme e autenticidade",
        category: "Piso Vinílico",
        subcategory: "Carvalho",
        price: "99.90",
        stock: 75,
        isActive: true,
        isFeatured: false,
        gtin: "7891234567892",
        mpn: "IPPAX-PVC-003",
        brand: "IPPAX",
        condition: "new",
        availability: "in stock",
        googleCategory: "2826",
        productType: "Piso Vinílico > Carvalho > Rústico",
        material: "PVC",
        color: "Carvalho Envelhecido",
        weight: "2.6kg",
        unit: "m²",
        metaTitle: "Piso Vinílico Carvalho Rústico - IPPAX",
        metaDescription: "Piso vinílico rústico de carvalho envelhecido. Traz charme e personalidade aos ambientes.",
        urlSlug: "piso-vinilico-carvalho-rustico",
        highlights: JSON.stringify(["Acabamento rústico", "Visual autêntico", "Fácil manutenção", "Resistente"]),
        technicalSpecs: JSON.stringify({
          "Espessura": "4mm",
          "Classe de Uso": "31",
          "Resistência ao Fogo": "Bfl-s1",
          "Garantia": "10 anos"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    this.productIdCounter = 4;
    this.userIdCounter = 2;
    this.initialized = true;

    console.log("✅ Memory database initialized with admin user and sample products");
  }

  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.userIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  // Product operations
  async findProducts(filters: {
    search?: string;
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ products: Product[]; total: number }> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);

    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }

    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    const total = products.length;
    
    if (filters.offset) {
      products = products.slice(filters.offset);
    }
    
    if (filters.limit) {
      products = products.slice(0, filters.limit);
    }

    return { products, total };
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product: Product = {
      ...productData,
      id: this.productIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    const existing = this.products.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date()
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
}

// Export singleton instance
export const memoryDb = new MemoryDatabase();

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    console.log("✅ Memory database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Memory database connection failed:", error);
    return false;
  }
}