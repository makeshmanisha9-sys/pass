const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// Curated Tourist Attractions, Cafes, and Shopping Data for 8 Indian Cities
const touristGuideData = {
  chennai: {
    city: 'Chennai',
    attractions: [
      { name: 'Marina Beach & Promenade', type: 'Beach & Coastal Walk', distance: '1.2 km', desc: 'World’s second longest natural urban beach, famous for sunset walks and street food.' },
      { name: 'Kapaleeshwarar Temple (Mylapore)', type: 'UNESCO Heritage & Architecture', distance: '2.5 km', desc: '7th-century Dravidian architectural masterpiece dedicated to Lord Shiva.' },
      { name: 'San Thome Cathedral Basilica', type: 'Historical Monument', distance: '3.0 km', desc: 'Neo-Gothic church built over the tomb of Saint Thomas the Apostle.' }
    ],
    restaurants: [
      { name: 'Amethyst Cafe & Bistro', cuisine: 'Continental & Artisanal Coffee', location: 'Royapettah', rating: 4.8 },
      { name: 'Murugan Idli Shop', cuisine: 'Authentic South Indian Tiffin', location: 'T. Nagar', rating: 4.7 }
    ],
    shopping: ['Phoenix Marketcity (Velachery)', 'Express Avenue Mall', 'T. Nagar Silk & Handicrafts Hub']
  },
  bangalore: {
    city: 'Bangalore',
    attractions: [
      { name: 'Cubbon Park & Botanical Gardens', type: 'Nature & Parks', distance: '1.5 km', desc: '300-acre green lung of Bengaluru surrounded by colonial heritage buildings.' },
      { name: 'Bangalore Palace & Grounds', type: 'Royal Heritage', distance: '3.8 km', desc: 'Tudor-style royal residence reminiscent of England’s Windsor Castle.' },
      { name: 'UB City Luxury Promenade', type: 'Luxury Shopping & Dining', distance: '0.9 km', desc: 'India’s premier luxury mall with open-air rooftop lounges.' }
    ],
    restaurants: [
      { name: 'Toit Craft Brewery', cuisine: 'Microbrewery & Woodfire Pizza', location: 'Indiranagar', rating: 4.9 },
      { name: 'Roastery Coffee House', cuisine: 'Artisanal Brews & Brunch', location: 'Koramangala', rating: 4.8 }
    ],
    shopping: ['UB City Luxury Mall', 'Commercial Street', 'Phoenix Marketcity Whitefield']
  },
  mumbai: {
    city: 'Mumbai',
    attractions: [
      { name: 'Gateway of India & Taj Palace', type: 'Iconic Landmark', distance: '2.0 km', desc: '1924 basalt archway overlooking the Arabian Sea and historic Taj Mahal Hotel.' },
      { name: 'Marine Drive (Queen’s Necklace)', type: 'Sea View Promenade', distance: '1.1 km', desc: '3.6 km C-shaped Boulevard along the Arabian coastline.' },
      { name: 'Bandra Fort & Promenade', type: 'Scenic Viewpoint', distance: '0.8 km', desc: 'Portuguese colonial fort overlooking the Sea Link bridge.' }
    ],
    restaurants: [
      { name: 'The Table Colaba', cuisine: 'Global Fine Dining', location: 'Colaba', rating: 4.9 },
      { name: 'Bastian Bandra', cuisine: 'Seafood & Sunday Brunch', location: 'Bandra West', rating: 4.8 }
    ],
    shopping: ['Colaba Causeway Handicrafts', 'Palladium Luxury Mall (Lower Parel)', 'Linking Road Fashion Hub']
  },
  delhi: {
    city: 'Delhi',
    attractions: [
      { name: 'Lodhi Art District & Gardens', type: 'Park & Open-Air Art', distance: '0.9 km', desc: 'Lush 90-acre Mughal garden complex surrounded by India’s first open-air street art district.' },
      { name: 'Qutub Minar Complex', type: 'UNESCO World Heritage', distance: '4.2 km', desc: '73-meter marble & red sandstone tower built in 1193.' },
      { name: 'Khan Market Boutique Enclave', type: 'Expats Shopping & Dining', distance: '0.5 km', desc: 'Ranked among Asia’s most prestigious high-street retail markets.' }
    ],
    restaurants: [
      { name: 'Indian Accent', cuisine: 'Modern Indian Gastronomy', location: 'Lodhi Road', rating: 4.9 },
      { name: 'Perch Wine & Coffee Bar', cuisine: 'European Cafe & Sangria', location: 'Khan Market', rating: 4.7 }
    ],
    shopping: ['Khan Market', 'Select CITYWALK Saket', 'Dilli Haat Open-Air Craft Bazaar']
  },
  hyderabad: {
    city: 'Hyderabad',
    attractions: [
      { name: 'Golconda Fort & Qutb Shahi Tombs', type: 'Historical Fortress', distance: '3.5 km', desc: 'Imposing 16th-century fortress known for acoustic engineering and diamond mines.' },
      { name: 'Hussain Sagar Lake & Buddha Statue', type: 'Lake Viewpoint', distance: '2.8 km', desc: 'Monolithic 18-meter granite Buddha statue centered in the bay.' }
    ],
    restaurants: [
      { name: 'Paradise Biryani', cuisine: 'Hyderabadi Dum Biryani', location: 'Secunderabad', rating: 4.8 },
      { name: 'Roastery Coffee House', cuisine: 'Specialty Roaster & Bistro', location: 'Jubilee Hills', rating: 4.9 }
    ],
    shopping: ['Inorbit Mall Gachibowli', 'IKEA Hyderabad', 'Laad Bazaar Pearl Market']
  },
  goa: {
    city: 'Goa',
    attractions: [
      { name: 'Ashwem Sunset Beach', type: 'Pristine Expat Beach', distance: '0.3 km', desc: 'Quiet, palm-fringed beach popular with international expats and kite surfers.' },
      { name: 'Fontainhas Latin Quarter', type: 'Portuguese Architecture', distance: '5.0 km', desc: 'UNESCO-recognized colorful Portuguese heritage enclave in Panjim.' }
    ],
    restaurants: [
      { name: 'Gunpowder Assagao', cuisine: 'Peninsular Coastal Dining', location: 'Assagao', rating: 4.9 },
      { name: 'Thalassa Greek Taverna', cuisine: 'Mediterranean Sunset Dining', location: 'Siolim', rating: 4.8 }
    ],
    shopping: ['Anjuna Wednesday Flea Market', 'Panjim Municipal Market', 'Mapusa Friday Bazaar']
  },
  kochi: {
    city: 'Kochi',
    attractions: [
      { name: 'Chinese Fishing Nets Promenade', type: 'Heritage Coastal', distance: '0.4 km', desc: '14th-century fixed land installations introduced by Chinese traders.' },
      { name: 'Mattancherry Dutch Palace & Jew Town', type: 'Heritage Quarter', distance: '1.8 km', desc: 'Ancient spice markets, antique shops, and 1568 Paradesi Synagogue.' }
    ],
    restaurants: [
      { name: 'Kashi Art Cafe', cuisine: 'Artisanal Cafe & Gallery', location: 'Fort Kochi', rating: 4.8 },
      { name: 'Oceanos Seafood Restaurant', cuisine: 'Kerala Coastal Seafood', location: 'Fort Kochi', rating: 4.9 }
    ],
    shopping: ['Lulu International Mall', 'Jew Town Antiques Market', 'Broadway Heritage Market']
  },
  jaipur: {
    city: 'Jaipur',
    attractions: [
      { name: 'Hawa Mahal (Palace of Winds)', type: 'Royal Heritage Landmark', distance: '2.1 km', desc: '5-story pink honeycomb facade built in 1799 with 953 small windows.' },
      { name: 'Amer Fort & Maota Lake', type: 'Hilltop Fortress', distance: '8.0 km', desc: 'Majestic red sandstone and marble fort overlooking Maota Lake.' }
    ],
    restaurants: [
      { name: 'Caffé Palladio', cuisine: 'Italian & Herbal Teas', location: 'C-Scheme', rating: 4.9 },
      { name: 'LMB Laxmi Misthan Bhandar', cuisine: 'Rajasthani Royal Thali', location: 'Johari Bazaar', rating: 4.7 }
    ],
    shopping: ['Johari Bazaar (Gems & Jewelry)', 'Bapu Bazaar (Textiles & Handicrafts)', 'World Trade Park']
  }
};

// @route   POST /api/ai/recommend
router.post('/recommend', async (req, res) => {
  try {
    const { city, budget, purpose, leaseLength, nationality } = req.body;
    let query = { status: 'verified' };

    if (city && city !== 'All') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    if (budget) {
      const budgetNum = Number(budget);
      if (!isNaN(budgetNum)) {
        query.pricePerMonth = { $lte: budgetNum * 1.25 };
      }
    }

    let properties = await Property.find(query).limit(6);
    if (properties.length === 0) {
      properties = await Property.find({ status: 'verified' }).limit(6);
    }

    const recommendations = properties.map(p => {
      let matchScore = 88 + Math.floor(Math.random() * 11);
      let reason = `Ideal for ${nationality || 'foreign expats'} seeking ${p.propertyType.toLowerCase()} in ${p.neighborhood}, ${p.city}. Includes verified landlord with FRRO visa paperwork support.`;
      
      if (purpose && purpose.toLowerCase().includes('remote')) {
        reason += ` High-speed 300 Mbps fiber optical internet and quiet study space.`;
      }

      return {
        property: p,
        matchScore,
        aiReasoning: reason
      };
    });

    res.json({
      success: true,
      summary: `Found ${recommendations.length} top Passage verified matches tailored for ${nationality || 'foreign national'} relocation to ${city || 'India'}.`,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/ai/chat
// @desc    Passage Expat AI Concierge Chatbot Endpoint with Tourist Place Recommendations
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const lowerMsg = message.toLowerCase();
    let reply = "";
    let suggestedProperties = [];
    let touristInfo = null;

    const cities = ['chennai', 'bangalore', 'mumbai', 'delhi', 'goa', 'hyderabad', 'kochi', 'jaipur'];
    let targetCity = cities.find(c => lowerMsg.includes(c));

    if (targetCity) {
      touristInfo = touristGuideData[targetCity];
    }

    if (lowerMsg.includes('tourist') || lowerMsg.includes('attraction') || lowerMsg.includes('visit') || lowerMsg.includes('sightseeing') || lowerMsg.includes('place') || lowerMsg.includes('guide')) {
      if (targetCity && touristInfo) {
        reply = `Here are top tourist attractions, expat cafes, and shopping areas in ${touristInfo.city}:\n\n` +
          `📍 Top Tourist Places: ${touristInfo.attractions.map(a => `${a.name} (${a.type})`).join(', ')}\n\n` +
          `☕ Expat Cafes & Dining: ${touristInfo.restaurants.map(r => `${r.name} (${r.cuisine})`).join(', ')}\n\n` +
          `🛍️ Shopping Hubs: ${touristInfo.shopping.join(', ')}`;
      } else {
        reply = "India features incredible tourist places across all 8 Passage cities! For instance:\n" +
          "• Chennai: Marina Beach, Kapaleeshwarar Temple, San Thome Basilica\n" +
          "• Bangalore: Cubbon Park, UB City Luxury Mall, Bangalore Palace\n" +
          "• Mumbai: Gateway of India, Marine Drive Promenade, Bandra Fort\n" +
          "• Delhi: Lodhi Art District, Qutub Minar, Khan Market\n" +
          "• Goa: Ashwem Beach, Fontainhas Latin Quarter, Aguada Fort\n" +
          "• Hyderabad: Golconda Fort, Hussain Sagar Lake\n" +
          "• Kochi: Chinese Fishing Nets, Fort Kochi Spice Markets\n" +
          "• Jaipur: Hawa Mahal Palace, Amer Fort, Johari Bazaar\n\n" +
          "Specify any city (e.g. 'Show tourist places in Goa') for localized recommendations!";
      }

      let query = { status: 'verified' };
      if (targetCity) query.city = new RegExp(`^${targetCity}$`, 'i');
      suggestedProperties = await Property.find(query).limit(3);
    } else if (targetCity || lowerMsg.includes('home') || lowerMsg.includes('rent') || lowerMsg.includes('apartment') || lowerMsg.includes('bhk') || lowerMsg.includes('flat') || lowerMsg.includes('villa') || lowerMsg.includes('stay') || lowerMsg.includes('find')) {
      let query = { status: 'verified' };
      if (targetCity) query.city = new RegExp(`^${targetCity}$`, 'i');
      suggestedProperties = await Property.find(query).limit(3);

      if (targetCity && touristInfo) {
        reply = `Here are Passage verified expat residences in ${touristInfo.city}. Nearby highlights include ${touristInfo.attractions[0].name} and dining at ${touristInfo.restaurants[0].name}.`;
      } else {
        reply = "Here are top Passage verified homes across major Indian metros with 300 Mbps fiber WiFi, power backup, and FRRO visa paperwork assistance.";
      }
    } else if (lowerMsg.includes('frro') || lowerMsg.includes('visa') || lowerMsg.includes('paperwork') || lowerMsg.includes('legal')) {
      reply = "Foreign nationals on Employment, Business, Tourist, or Student visas can legally lease residential properties in India. Passage prepares landlord-tenant lease agreements compliant with Section 14 of the Foreigners Act and assists with online FRRO (Form C) registration within 14 days of arrival.";
    } else {
      reply = "Welcome to Passage! I am your AI Relocation Assistant. Ask me to recommend tourist places, budget apartments near IT parks, explain FRRO visa paperwork, or show verified homes in Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Goa, Kochi, and Jaipur.";
    }

    res.json({
      success: true,
      reply,
      touristInfo,
      suggestedProperties: suggestedProperties.map(p => ({
        _id: p._id,
        title: p.title,
        city: p.city,
        neighborhood: p.neighborhood,
        pricePerMonth: p.pricePerMonth,
        pricePerNight: p.pricePerNight,
        coverImage: p.coverImage,
        rating: p.rating,
        propertyType: p.propertyType
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
