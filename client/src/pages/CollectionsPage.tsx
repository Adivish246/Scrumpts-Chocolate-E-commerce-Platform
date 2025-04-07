import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCollections } from '@/hooks/useProducts';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, Gift, Heart, Star, Calendar, Leaf, GlassWater } from 'lucide-react';

interface CollectionCardProps {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  theme?: 'light' | 'dark';
  icon?: React.ReactNode;
  accentColor?: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ 
  id, 
  name, 
  description, 
  imageUrl, 
  theme = 'light',
  icon,
  accentColor = 'bg-amber-600'
}) => {
  const textColor = theme === 'light' ? 'text-amber-900' : 'text-white';
  const bgColor = theme === 'light' ? 'bg-white bg-opacity-90' : 'bg-amber-900 bg-opacity-90';
  
  return (
    <Link href={`/collections/${id}`}>
      <div 
        className="relative overflow-hidden rounded-2xl shadow-lg group h-80 cursor-pointer"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>

        {/* Icon badge */}
        {icon && (
          <div className={`absolute top-4 right-4 ${accentColor} p-3 rounded-full text-white`}>
            {icon}
          </div>
        )}
        
        <div className={`absolute bottom-0 left-0 right-0 p-6 ${bgColor} transition-all duration-300 transform group-hover:translate-y-0`}>
          <h3 className={`text-xl font-bold mb-2 font-display ${textColor}`}>{name}</h3>
          <p className={`text-sm mb-4 ${theme === 'light' ? 'text-amber-800' : 'text-amber-200'}`}>
            {description}
          </p>
          <Button 
            variant={theme === 'light' ? 'default' : 'outline'} 
            className={theme === 'light' ? 'bg-amber-800 hover:bg-amber-900' : 'text-white border-white hover:bg-amber-800'}
          >
            Explore Collection <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

// Seasonal collection component
const SeasonalCollections: React.FC = () => {
  const seasonalCollections = [
    {
      id: 101,
      name: "Summer Delights",
      description: "Fruity and refreshing chocolate creations perfect for the warm season",
      imageUrl: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?q=80&w=1920&auto=format&fit=crop",
      theme: 'light' as const,
      icon: <Calendar className="h-5 w-5" />,
      accentColor: 'bg-amber-600'
    },
    {
      id: 102,
      name: "Winter Warmth",
      description: "Warm spices and rich ganaches to comfort during the cold months",
      imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1920&auto=format&fit=crop",
      theme: 'dark' as const,
      icon: <Calendar className="h-5 w-5" />,
      accentColor: 'bg-amber-600'
    },
    {
      id: 103,
      name: "Fall Harvest",
      description: "Warm caramel, nut, and spice infusions celebrating autumn flavors",
      imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1920&auto=format&fit=crop",
      theme: 'dark' as const,
      icon: <Leaf className="h-5 w-5" />,
      accentColor: 'bg-amber-600'
    }
  ];

  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-amber-900">Seasonal Collections</h2>
        <Button variant="outline" className="text-amber-800">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {seasonalCollections.map((collection) => (
          <CollectionCard key={collection.id} {...collection} />
        ))}
      </div>
    </section>
  );
};

// Specialty collection component
const SpecialtyCollections: React.FC = () => {
  const specialtyCollections = [
    {
      id: 201,
      name: "Single Origin",
      description: "Experience the distinct flavor profiles from the world's finest cocoa regions",
      imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1920&auto=format&fit=crop",
      theme: 'dark' as const,
      icon: <GlassWater className="h-5 w-5" />,
      accentColor: 'bg-amber-600'
    },
    {
      id: 202,
      name: "Luxury Gift Boxes",
      description: "Exquisitely packaged assortments for special occasions and corporate gifting",
      imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1920&auto=format&fit=crop",
      theme: 'light' as const,
      icon: <Gift className="h-5 w-5" />,
      accentColor: 'bg-amber-600'
    }
  ];

  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-amber-900">Specialty Collections</h2>
        <Button variant="outline" className="text-amber-800">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specialtyCollections.map((collection) => (
          <CollectionCard key={collection.id} {...collection} />
        ))}
      </div>
    </section>
  );
};

// Database collections component
const DatabaseCollections: React.FC = () => {
  const { collections, isLoading, error } = useCollections();

  if (isLoading) {
    return (
      <section className="py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
      </section>
    );
  }

  if (error || !collections || collections.length === 0) {
    return (
      <section className="py-10">
        <div className="text-center p-8 bg-amber-50 rounded-lg">
          <p className="text-amber-800 mb-4">Unable to load collections from our database</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-amber-900">Featured Collections</h2>
        <Button variant="outline" className="text-amber-800">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <CollectionCard 
            key={collection.id} 
            id={collection.id} 
            name={collection.name} 
            description={collection.description} 
            imageUrl={collection.imageUrl}
            theme={collection.id % 2 === 0 ? 'light' : 'dark'}
            icon={<Star className="h-5 w-5" />}
          />
        ))}
      </div>
    </section>
  );
};

const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-12 h-80">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1920&auto=format&fit=crop')",
              filter: "brightness(0.7)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12 max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Chocolate Collections</h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Explore our carefully curated assortments of handcrafted chocolates for every occasion and preference
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white w-fit">
              Explore All Collections
            </Button>
          </div>
        </div>
        
        {/* Collections from the database */}
        <DatabaseCollections />
        
        {/* Seasonal Collections */}
        <SeasonalCollections />
        
        {/* Specialty Collections */}
        <SpecialtyCollections />
        
        {/* Newsletter Section */}
        <section className="py-12 px-6 bg-amber-50 rounded-xl mt-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-amber-900 mb-3">
              Stay Updated on New Collections
            </h2>
            <p className="text-amber-800 mb-6">
              Subscribe to our newsletter to be the first to know about new chocolate collections, limited editions, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-amber-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <Button className="bg-amber-800 hover:bg-amber-900 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage;