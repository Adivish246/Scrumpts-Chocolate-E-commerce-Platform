import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Coffee, 
  Globe, 
  Leaf, 
  MapPin, 
  PlayCircle, 
  ThumbsUp, 
  Utensils 
} from 'lucide-react';
import { Link } from 'wouter';

interface ArticleCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  readTime: string;
  date: string;
  slug: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  category, 
  readTime, 
  date,
  slug
}) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="h-52 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
            {category}
          </Badge>
          <span className="text-sm text-gray-500">{readTime}</span>
        </div>
        <CardTitle className="text-xl font-display text-amber-900">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center pt-0">
        <span className="text-sm text-gray-500 flex items-center">
          <Calendar className="h-4 w-4 mr-1" /> {date}
        </span>
        <Link href={`/learn/${slug}`}>
          <Button variant="outline" className="text-amber-800 border-amber-200 hover:bg-amber-50">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

interface ClassCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  duration: string;
  level: string;
  price: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  date, 
  duration, 
  level,
  price
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-amber-600 hover:bg-amber-700">{level}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-display text-amber-900">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-amber-800" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Coffee className="h-4 w-4 mr-2 text-amber-800" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center col-span-2">
            <Utensils className="h-4 w-4 mr-2 text-amber-800" />
            <span>All materials included</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <span className="font-bold text-amber-900">{price}</span>
        <Button className="bg-amber-800 hover:bg-amber-900">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const LearnPage: React.FC = () => {
  // Blog articles data
  const articles = [
    {
      title: "The Art of Chocolate Tasting",
      description: "Learn how to properly taste chocolate and identify flavor notes like a professional chocolatier.",
      imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1470&auto=format&fit=crop",
      category: "Tasting",
      readTime: "5 min read",
      date: "March 15, 2025",
      slug: "art-of-chocolate-tasting"
    },
    {
      title: "From Bean to Bar: The Journey of Chocolate",
      description: "Explore the fascinating process of transforming cocoa beans into the delicious chocolate we all love.",
      imageUrl: "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1287&auto=format&fit=crop",
      category: "Production",
      readTime: "8 min read",
      date: "February 28, 2025",
      slug: "bean-to-bar-journey"
    },
    {
      title: "Single-Origin Chocolate: Why Region Matters",
      description: "Discover how geographical location affects the flavor profiles of cocoa and the resulting chocolate.",
      imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1287&auto=format&fit=crop",
      category: "Origins",
      readTime: "6 min read",
      date: "February 10, 2025",
      slug: "single-origin-chocolate"
    },
    {
      title: "Pairing Chocolate with Wine and Spirits",
      description: "Expert tips on creating perfect pairings between fine chocolates and your favorite beverages.",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1689&auto=format&fit=crop",
      category: "Pairing",
      readTime: "7 min read",
      date: "January 22, 2025",
      slug: "chocolate-wine-pairing"
    }
  ];

  // Workshops and classes data
  const classes = [
    {
      title: "Truffle Making Masterclass",
      description: "Learn to craft exquisite chocolate truffles with our master chocolatier in this hands-on workshop.",
      imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1287&auto=format&fit=crop",
      date: "April 15, 2025",
      duration: "3 hours",
      level: "Beginner",
      price: "₹3,500"
    },
    {
      title: "Advanced Chocolate Tempering",
      description: "Perfect the art of tempering chocolate to achieve that professional shine and snap in your creations.",
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d8e3f2985?q=80&w=1287&auto=format&fit=crop",
      date: "April 22, 2025",
      duration: "4 hours",
      level: "Intermediate",
      price: "₹4,500"
    },
    {
      title: "Chocolate and Spice Pairing",
      description: "Explore the exciting world of combining Indian spices with chocolate to create unique flavor experiences.",
      imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652422?q=80&w=1287&auto=format&fit=crop",
      date: "May 5, 2025",
      duration: "2 hours",
      level: "All Levels",
      price: "₹2,800"
    }
  ];

  const faqs = [
    {
      question: "What makes dark chocolate different from milk chocolate?",
      answer: "Dark chocolate has a higher cocoa content (typically 50-90%) compared to milk chocolate (around 10-50%). Dark chocolate contains little to no milk solids and less sugar, giving it a more intense, sometimes bitter flavor. Milk chocolate includes milk powder or condensed milk, creating a creamier, sweeter taste with a lighter color."
    },
    {
      question: "How should I store chocolate to maintain its quality?",
      answer: "Store chocolate in a cool, dry place at 65-70°F (18-21°C), away from strong odors and direct sunlight. Avoid refrigeration as it can cause 'sugar bloom' (a whitish appearance) due to condensation when removed. If refrigeration is necessary in hot climates, seal chocolate in an airtight container and allow it to come to room temperature before unwrapping to prevent condensation."
    },
    {
      question: "Is chocolate really good for health or is that a myth?",
      answer: "Dark chocolate (70%+ cocoa) does offer health benefits when consumed in moderation. It contains antioxidants called flavanols that may improve heart health by reducing blood pressure and improving blood flow. It also contains minerals like iron, magnesium, and zinc. However, these benefits come with the caveat that chocolate also contains sugar and fat, so moderation is key."
    },
    {
      question: "How long does it take to make chocolate from bean to bar?",
      answer: "The bean-to-bar process typically takes 2-4 weeks. After harvesting, cocoa beans are fermented (5-7 days) and dried (1-2 weeks). At the chocolate factory, beans are roasted (30-90 minutes), cracked and winnowed to remove shells, then ground and conched (a mixing/aerating process that can take 24-72 hours). Finally, the chocolate is tempered, molded, and cooled before packaging."
    },
    {
      question: "What is 'tempering' chocolate and why is it important?",
      answer: "Tempering is the process of heating and cooling chocolate to specific temperatures to establish stable cocoa butter crystals. Properly tempered chocolate has a glossy appearance, satisfying snap when broken, melts smoothly in your mouth, and resists 'blooming' (white discoloration). Without proper tempering, chocolate may be dull, soft, melt too quickly, and develop bloom over time."
    },
    {
      question: "Can I participate in a workshop if I have food allergies?",
      answer: "Yes, with prior notification. Please inform us of any allergies when booking a workshop so our instructors can prepare accordingly. Our kitchen handles common allergens including nuts, dairy, and gluten, but we can often make accommodations or suggest alternative ingredients for many allergies. For severe allergies, please contact us directly to discuss your specific situation."
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
              backgroundImage: "url('https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1470&auto=format&fit=crop')",
              filter: "brightness(0.6)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 to-transparent" />
          <div className="container mx-auto px-4 relative h-full flex flex-col justify-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Learn About Chocolate</h1>
              <p className="text-lg md:text-xl opacity-90">
                Discover the art, science, and history behind the world's favorite treat
              </p>
            </div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-12">
          {/* Main content tabs */}
          <Tabs defaultValue="articles" className="mb-12">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-amber-50">
                <TabsTrigger value="articles" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                  Articles & Guides
                </TabsTrigger>
                <TabsTrigger value="classes" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                  Workshops & Classes
                </TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                  Chocolate FAQ
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Articles tab content */}
            <TabsContent value="articles">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-amber-900 mb-4">Chocolate Articles & Guides</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Enhance your chocolate knowledge with our expertly written guides covering everything from tasting techniques to the history of chocolate.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {articles.map((article, index) => (
                  <ArticleCard 
                    key={index}
                    title={article.title}
                    description={article.description}
                    imageUrl={article.imageUrl}
                    category={article.category}
                    readTime={article.readTime}
                    date={article.date}
                    slug={article.slug}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Button variant="outline" className="text-amber-800">
                  View All Articles
                </Button>
              </div>
            </TabsContent>

            {/* Classes tab content */}
            <TabsContent value="classes">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-amber-900 mb-4">Chocolate Workshops & Classes</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Get hands-on experience with our interactive workshops led by master chocolatiers. Perfect for beginners and chocolate enthusiasts alike.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {classes.map((classItem, index) => (
                  <ClassCard 
                    key={index}
                    title={classItem.title}
                    description={classItem.description}
                    imageUrl={classItem.imageUrl}
                    date={classItem.date}
                    duration={classItem.duration}
                    level={classItem.level}
                    price={classItem.price}
                  />
                ))}
              </div>
              
              {/* Virtual workshop promo */}
              <div className="bg-amber-50 rounded-lg p-8 border border-amber-200 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1606312619070-d48b4c652422?q=80&w=1287&auto=format&fit=crop" 
                      alt="Virtual chocolate tasting workshop" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <Badge className="bg-amber-600 hover:bg-amber-600 mb-4">NEW</Badge>
                  <h3 className="text-2xl font-display font-bold text-amber-900 mb-2">
                    Virtual Chocolate Tasting Workshop
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Join our master chocolatier for an immersive online experience. We'll ship a tasting kit to your home before the session, allowing you to discover the nuances of fine chocolate from anywhere in the world.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-sm text-amber-800">
                      <Calendar className="h-4 w-4 mr-1" />
                      Next session: April 30, 2025
                    </div>
                    <div className="flex items-center text-sm text-amber-800">
                      <Coffee className="h-4 w-4 mr-1" />
                      90 minutes
                    </div>
                    <div className="flex items-center text-sm text-amber-800">
                      <Globe className="h-4 w-4 mr-1" />
                      Join from anywhere
                    </div>
                  </div>
                  <Button className="bg-amber-800 hover:bg-amber-900">
                    <PlayCircle className="mr-2 h-4 w-4" /> Learn More
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* FAQ tab content */}
            <TabsContent value="faq">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-amber-900 mb-4">Chocolate FAQ</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Common questions about chocolate answered by our experts
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-amber-900 font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>

          {/* Origin section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-amber-900 mb-4">Explore Cocoa Origins</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Discover how geography and climate influence the distinctive flavors of chocolate
              </p>
            </div>
            
            <div className="bg-amber-900 rounded-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1287&auto=format&fit=crop" 
                    alt="World map highlighting cocoa growing regions" 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-900 md:block hidden"></div>
                </div>
                <div className="p-8 md:p-12 text-white">
                  <h3 className="text-2xl font-display font-bold mb-4">
                    The Cocoa Belt: Where Chocolate Begins
                  </h3>
                  <p className="mb-6 text-amber-100">
                    Cocoa trees thrive in specific climate conditions found primarily within 20 degrees north and south of the equator, in what's known as the "Cocoa Belt."
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-800 p-2 rounded-full text-white mt-1">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">South American Origins</h4>
                        <p className="text-amber-100">
                          Known for fruity, floral notes with hints of red berries and citrus. Ecuador's Nacional beans are particularly prized.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-800 p-2 rounded-full text-white mt-1">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">West African Beans</h4>
                        <p className="text-amber-100">
                          Producing over 70% of the world's cocoa, this region delivers beans with earthy, robust flavors and subtle bitter notes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-800 p-2 rounded-full text-white mt-1">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Asian & Pacific</h4>
                        <p className="text-amber-100">
                          Offering unique smoky, spicy profiles with less acidity. Indonesian beans often have earthy, woody characteristics.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="mt-8 bg-white text-amber-900 hover:bg-amber-100">
                    Explore Origin Guide
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter section */}
          <section className="bg-amber-50 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-display font-bold text-amber-900 mb-3">
              Join Our Chocolate Education Community
            </h2>
            <p className="text-amber-800 mb-6 max-w-2xl mx-auto">
              Subscribe to receive chocolate education content, workshop announcements, and exclusive recipes directly to your inbox.
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
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearnPage;