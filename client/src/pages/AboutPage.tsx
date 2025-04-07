import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Coffee, 
  Heart, 
  Leaf, 
  Lightbulb, 
  ShoppingBag, 
  Sparkles, 
  Star 
} from 'lucide-react';
import { Link } from 'wouter';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, imageUrl }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold font-display text-amber-900">{name}</h3>
      <p className="text-amber-800 mb-2 italic">{role}</p>
      <p className="text-center text-gray-600">{bio}</p>
    </div>
  );
};

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 flex flex-col items-center text-center">
      <div className="p-3 bg-amber-100 rounded-full mb-4 text-amber-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display text-amber-900 mb-2">{title}</h3>
      <p className="text-amber-800">{description}</p>
    </div>
  );
};

const AboutPage: React.FC = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Master Chocolatier",
      bio: "With over 15 years of experience crafting artisanal chocolates across Europe, Priya brings traditional techniques with innovative flavor combinations.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
    },
    {
      name: "Raj Patel",
      role: "Founder & CEO",
      bio: "Inspired by his grandmother's homemade chocolate recipes, Raj founded Scrumpts to share his passion for authentic, high-quality chocolates with the world.",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1287&auto=format&fit=crop"
    },
    {
      name: "Aisha Khan",
      role: "Head of Innovation",
      bio: "A food scientist with expertise in flavor development, Aisha leads our research into new chocolate blends and sustainable production methods.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
    },
    {
      name: "David Chen",
      role: "Sourcing Director",
      bio: "David travels the world's cocoa-growing regions to forge direct relationships with farmers and secure the finest ethically-sourced cocoa beans.",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  // Company values
  const values = [
    {
      title: "Artisanal Quality",
      description: "Every chocolate is handcrafted with patience and precision, using traditional methods that honor the craft.",
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      title: "Ethical Sourcing",
      description: "We partner directly with cocoa farmers, ensuring fair compensation and sustainable farming practices.",
      icon: <Leaf className="h-6 w-6" />
    },
    {
      title: "Innovation",
      description: "Constantly exploring new techniques and flavor combinations while respecting chocolate's rich heritage.",
      icon: <Lightbulb className="h-6 w-6" />
    },
    {
      title: "Community Impact",
      description: "Supporting education and infrastructure in the communities where our cocoa is grown.",
      icon: <Heart className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-80 md:h-96 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1606312619070-d48b4c652422?q=80&w=1287&auto=format&fit=crop')",
              filter: "brightness(0.6)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 to-transparent" />
          <div className="container mx-auto px-4 relative h-full flex flex-col justify-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About Scrumpts</h1>
              <p className="text-lg md:text-xl opacity-90">
                Crafting extraordinary chocolate experiences with passion, tradition, and innovation
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-amber-900 mb-6">Our Story</h2>
              <span className="inline-block w-20 h-1 bg-amber-600 mb-8"></span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  Scrumpts began in 2015 in a small kitchen in Mumbai, where our founder Raj Patel experimented with recreating his grandmother's cherished chocolate recipes using locally-sourced ingredients.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  What started as a passion project quickly gained attention for its unique flavors that combined traditional Indian spices with premium chocolate. As demand grew, Raj partnered with Priya Sharma, a master chocolatier trained in Belgium and France.
                </p>
                <p className="text-lg text-gray-700">
                  Today, Scrumpts has grown into a beloved brand known for its artisanal quality, innovative flavors, and commitment to ethical sourcing. Our team of chocolate artisans continues to push boundaries while honoring the traditions that make chocolate such a special treat.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1287&auto=format&fit=crop" 
                  alt="Chocolate making process" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-amber-900 mb-6">Our Values</h2>
              <span className="inline-block w-20 h-1 bg-amber-600 mb-8"></span>
              <p className="max-w-2xl mx-auto text-lg text-amber-800 mb-8">
                The principles that guide everything we do, from sourcing ingredients to crafting experiences.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <ValueCard 
                  key={index}
                  title={value.title}
                  description={value.description}
                  icon={value.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-amber-900 mb-6">Our Chocolate Making Process</h2>
              <span className="inline-block w-20 h-1 bg-amber-600 mb-8"></span>
            </div>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Coffee className="h-10 w-10" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold font-display text-amber-900 mb-2">Bean Selection</h3>
                  <p className="text-gray-700">
                    We carefully select cocoa beans from sustainable farms in regions known for their distinctive flavors. Our sourcing director travels to these regions to ensure quality and build relationships with farmers.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex justify-center md:order-last">
                  <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Sparkles className="h-10 w-10" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold font-display text-amber-900 mb-2">Artisanal Crafting</h3>
                  <p className="text-gray-700">
                    Our chocolatiers use traditional methods combined with innovative techniques to craft each chocolate by hand. From tempering to molding, every step is performed with precision and care.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Star className="h-10 w-10" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold font-display text-amber-900 mb-2">Quality Assurance</h3>
                  <p className="text-gray-700">
                    Each batch undergoes rigorous quality checks to ensure consistent flavor, texture, and appearance. Only chocolates that meet our exacting standards make it to our customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-amber-900 mb-6">Meet Our Team</h2>
              <span className="inline-block w-20 h-1 bg-amber-600 mb-8"></span>
              <p className="max-w-2xl mx-auto text-lg text-amber-800 mb-8">
                The passionate artisans and innovators behind Scrumpts' delicious creations
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMember 
                  key={index}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  imageUrl={member.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-amber-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Experience Our Passion</h2>
            <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
              Join us in our journey of crafting extraordinary chocolate experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button className="bg-white text-amber-900 hover:bg-amber-100 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shop Our Collection
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Discover Our Process
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;