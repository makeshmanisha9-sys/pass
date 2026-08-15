const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Availability = require('./models/Availability');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const Wishlist = require('./models/Wishlist');
const Document = require('./models/Document');
const Inquiry = require('./models/Inquiry');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');
const CurrencyRate = require('./models/CurrencyRate');

const seedDataHelper = async () => {
  try {
    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Availability.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await Document.deleteMany({});
    await Inquiry.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});
    await CurrencyRate.deleteMany({});

    console.log('Seeding Currency Rates...');
    await CurrencyRate.create({
      baseCurrency: 'INR',
      rates: {
        INR: 1.0,
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0094,
        AUD: 0.018,
        CAD: 0.016,
        SGD: 0.016,
        JPY: 1.78
      }
    });

    console.log('Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const tenantPassword = await bcrypt.hash('tenant123', salt);
    const ownerPassword = await bcrypt.hash('owner123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    // Sample Tenants (Foreign Expats)
    const tenant1 = await User.create({
      name: 'Lena Hoffman',
      email: 'tenant@passage.com',
      password: tenantPassword,
      role: 'tenant',
      nationality: 'Germany',
      passportNumber: 'DE98273641',
      phone: '+49 151 892019',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    const tenant2 = await User.create({
      name: 'Daniel Okonjo',
      email: 'daniel@passage.com',
      password: tenantPassword,
      role: 'tenant',
      nationality: 'Nigeria',
      passportNumber: 'NG77192038',
      phone: '+234 802 119203',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    const tenant3 = await User.create({
      name: 'Sophie Laurent',
      email: 'sophie@passage.com',
      password: tenantPassword,
      role: 'tenant',
      nationality: 'France',
      passportNumber: 'FR88291024',
      phone: '+33 612 345678',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    const tenant4 = await User.create({
      name: 'Kenji Takahashi',
      email: 'kenji@passage.com',
      password: tenantPassword,
      role: 'tenant',
      nationality: 'Japan',
      passportNumber: 'JP99881122',
      phone: '+81 90 1234 5678',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    // Sample Property Owners
    const owner1 = await User.create({
      name: 'Rajesh Sharma',
      email: 'owner@passage.com',
      password: ownerPassword,
      role: 'owner',
      nationality: 'Indian',
      phone: '+91 98400 12345',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    const owner2 = await User.create({
      name: 'Ananya Rao',
      email: 'ananya@passage.com',
      password: ownerPassword,
      role: 'owner',
      nationality: 'Indian',
      phone: '+91 99620 67890',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    const owner3 = await User.create({
      name: 'Vikramaditya Singh',
      email: 'vikram@passage.com',
      password: ownerPassword,
      role: 'owner',
      nationality: 'Indian',
      phone: '+91 98100 45678',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    // Admin User
    const admin = await User.create({
      name: 'Passage Executive Admin',
      email: 'admin@passage.com',
      password: adminPassword,
      role: 'admin',
      nationality: 'Indian',
      phone: '+91 44 2800 9000',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    console.log('Generating 50+ Verified Properties across 8 Indian Cities...');

    const citiesData = [
      {
        city: 'Chennai',
        neighborhoods: ['R.A. Puram', 'Nungambakkam', 'East Coast Road (ECR)', 'Boat Club', 'Adyar', 'Besant Nagar'],
        latBase: 13.02, lngBase: 80.24,
        attractions: [
          { name: 'Marina Beach & Promenade', type: 'Beach', distance: '1.2 km' },
          { name: 'Kapaleeshwarar Temple', type: 'Heritage', distance: '2.5 km' },
          { name: 'Phoenix Marketcity Mall', type: 'Shopping', distance: '4.0 km' }
        ],
        restaurants: [
          { name: 'Amethyst Cafe & Bistro', cuisine: 'Continental & Coffee', distance: '1.0 km', rating: 4.8 },
          { name: 'Murugan Idli Shop', cuisine: 'South Indian', distance: '0.8 km', rating: 4.7 }
        ]
      },
      {
        city: 'Bangalore',
        neighborhoods: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Lavelle Road', 'UB City'],
        latBase: 12.93, lngBase: 77.62,
        attractions: [
          { name: 'Cubbon Park & Botanical Gardens', type: 'Nature', distance: '1.5 km' },
          { name: 'UB City Luxury Mall', type: 'Shopping', distance: '0.9 km' },
          { name: 'Bangalore Palace', type: 'Heritage', distance: '3.8 km' }
        ],
        restaurants: [
          { name: 'Toit Craft Brewery', cuisine: 'Pub & Woodfire Pizza', distance: '0.5 km', rating: 4.9 },
          { name: 'Corner House Ice Cream', cuisine: 'Desserts', distance: '0.7 km', rating: 4.8 }
        ]
      },
      {
        city: 'Mumbai',
        neighborhoods: ['Bandra West', 'Juhu Beach', 'Colaba', 'Lower Parel', 'Worli Sea Face', 'Powai Lake'],
        latBase: 19.06, lngBase: 72.83,
        attractions: [
          { name: 'Gateway of India', type: 'Heritage Monument', distance: '2.0 km' },
          { name: 'Marine Drive Promenade', type: 'Iconic Bay Walk', distance: '1.1 km' },
          { name: 'Bandra Fort & Promenade', type: 'Scenic Viewpoint', distance: '0.8 km' }
        ],
        restaurants: [
          { name: 'The Table Colaba', cuisine: 'Global Fine Dining', distance: '0.6 km', rating: 4.9 },
          { name: 'Bastian Bandra', cuisine: 'Seafood & Brunch', distance: '0.4 km', rating: 4.8 }
        ]
      },
      {
        city: 'Delhi',
        neighborhoods: ['Golf Links', 'Vasant Vihar', 'Defense Colony', 'Jor Bagh', 'Chanakyapuri', 'Hauz Khas Village'],
        latBase: 28.59, lngBase: 77.23,
        attractions: [
          { name: 'Lodhi Art District & Gardens', type: 'Park & Culture', distance: '0.9 km' },
          { name: 'Qutub Minar Complex', type: 'UNESCO World Heritage', distance: '4.2 km' },
          { name: 'Khan Market Shopping Hub', type: 'Boutique Shopping', distance: '0.5 km' }
        ],
        restaurants: [
          { name: 'Indian Accent', cuisine: 'Modern Indian Gastronomy', distance: '1.2 km', rating: 4.9 },
          { name: 'Perch Wine & Coffee Bar', cuisine: 'European Cafe', distance: '0.4 km', rating: 4.7 }
        ]
      },
      {
        city: 'Hyderabad',
        neighborhoods: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'HITEC City', 'Madhapur', 'Financial District'],
        latBase: 17.43, lngBase: 78.40,
        attractions: [
          { name: 'Golconda Fort', type: 'Historical Fortress', distance: '3.5 km' },
          { name: 'Hussain Sagar Lake & Buddha Statue', type: 'Lake View', distance: '2.8 km' },
          { name: 'IKEA & Inorbit Mall Gachibowli', type: 'Shopping', distance: '1.5 km' }
        ],
        restaurants: [
          { name: 'Paradise Biryani', cuisine: 'Hyderabadi Mughlai', distance: '1.0 km', rating: 4.8 },
          { name: 'Roastery Coffee House', cuisine: 'Artisanal Coffee & Bistro', distance: '0.5 km', rating: 4.9 }
        ]
      },
      {
        city: 'Goa',
        neighborhoods: ['Ashwem Beach', 'Anjuna', 'Candolim', 'Panjim Heritage Quarter', 'Assagao', 'Palolem'],
        latBase: 15.58, lngBase: 73.74,
        attractions: [
          { name: 'Ashwem Sunset Beach', type: 'Pristine Beach', distance: '0.3 km' },
          { name: 'Fontainhas Latin Quarter', type: 'Heritage Architecture', distance: '5.0 km' },
          { name: 'Aguada Fort & Lighthouse', type: 'Ocean Viewpoint', distance: '3.2 km' }
        ],
        restaurants: [
          { name: 'Gunpowder Assagao', cuisine: 'South Indian Coastal', distance: '0.7 km', rating: 4.9 },
          { name: 'Thalassa Greek Taverna', cuisine: 'Mediterranean Sunset Dining', distance: '1.5 km', rating: 4.8 }
        ]
      },
      {
        city: 'Kochi',
        neighborhoods: ['Fort Kochi', 'Marine Drive', 'Mattancherry', 'Kakkanad InfoPark', 'Willingdon Island'],
        latBase: 9.96, lngBase: 76.24,
        attractions: [
          { name: 'Chinese Fishing Nets Promenade', type: 'Heritage Coastal', distance: '0.4 km' },
          { name: 'Mattancherry Palace Museum', type: 'Historical Palace', distance: '1.8 km' },
          { name: 'Lulu International Mall', type: 'Mega Shopping Mall', distance: '6.5 km' }
        ],
        restaurants: [
          { name: 'Kashi Art Cafe', cuisine: 'Artisan Cafe & Bakery', distance: '0.3 km', rating: 4.8 },
          { name: 'Oceanos Seafood Restaurant', cuisine: 'Kerala Coastal Seafood', distance: '0.6 km', rating: 4.9 }
        ]
      },
      {
        city: 'Jaipur',
        neighborhoods: ['C-Scheme', 'Malviya Nagar', 'Raja Park', 'Civil Lines', 'Bani Park'],
        latBase: 26.91, lngBase: 75.79,
        attractions: [
          { name: 'Hawa Mahal Palace of Winds', type: 'Heritage Landmark', distance: '2.1 km' },
          { name: 'Amer Fort & Elephant Sanctuary', type: 'Hill Fort', distance: '8.0 km' },
          { name: 'Johari Bazaar Craft Market', type: 'Handicrafts & Gems', distance: '1.5 km' }
        ],
        restaurants: [
          { name: 'Caffé Palladio', cuisine: 'Italian & Fine Teas', distance: '0.5 km', rating: 4.9 },
          { name: 'LMB Laxmi Misthan Bhandar', cuisine: 'Traditional Rajasthani Thali', distance: '1.8 km', rating: 4.7 }
        ]
      }
    ];

    const propertyTypes = [
      'Penthouse', 'Executive Loft', 'Sea-Facing Villa', 'Heritage Home', 
      'Studio', 'Serviced Apartment', 'Garden Flat', 'Luxury Duplex', 
      'Eco Bungalow', 'Co-living Hub', 'Beach Cottage', 'Skyline Suite',
      'Colonial Bungalow', 'Lake View Villa', 'Boutique Residency'
    ];

    const allAmenities = [
      'WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 'Furnished', 
      'Gym', 'Balcony', 'Terrace', 'Security', 'Swimming Pool', 'Parking', 'Elevator', 
      'Dedicated Workspace', 'Daily Maid Service', 'Full Kitchen', 'Washing Machine', 
      'Pet Friendly', 'Sea View', 'Garden', 'Gated Community', 'EV Charger', 'Concierge'
    ];

    const sampleImages = [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
    ];

    const propertiesToInsert = [];
    let propCounter = 1;

    for (const cityMeta of citiesData) {
      // 6 to 7 properties per city => total ~52 properties
      for (let i = 0; i < 7; i++) {
        const neighborhood = cityMeta.neighborhoods[i % cityMeta.neighborhoods.length];
        const propType = propertyTypes[(propCounter - 1) % propertyTypes.length];
        const owner = (propCounter % 3 === 0) ? owner3 : (propCounter % 2 === 0 ? owner2 : owner1);

        // Price logic: 35,000 to 140,000 INR per month
        const baseMonthly = 35000 + ((propCounter * 4500) % 95000);
        const nightlyPrice = Math.round(baseMonthly / 25);
        const depositAmount = baseMonthly * 2;

        // Amenities slice
        const amenCount = 6 + (propCounter % 8);
        const amenities = allAmenities.slice(0, amenCount);

        const latOffset = ((i * 0.007) - 0.02);
        const lngOffset = ((i * 0.008) - 0.02);

        const coverImg = sampleImages[(propCounter - 1) % sampleImages.length];
        const secondaryImg = sampleImages[propCounter % sampleImages.length];

        propertiesToInsert.push({
          title: `${propType} with ${neighborhood} Views`,
          description: `Spacious, fully verified foreigner-friendly ${propType.toLowerCase()} located in prime ${neighborhood}, ${cityMeta.city}. Includes high-speed 300 Mbps optical fiber internet, 100% generator power backup, ergonomic workspace, and landlord documentation assistance for FRRO registration.`,
          ownerId: owner._id,
          city: cityMeta.city,
          neighborhood: neighborhood,
          address: `${10 + i * 4}, ${neighborhood}, ${cityMeta.city}, India`,
          location: {
            lat: Number((cityMeta.latBase + latOffset).toFixed(4)),
            lng: Number((cityMeta.lngBase + lngOffset).toFixed(4))
          },
          pricePerNight: nightlyPrice,
          pricePerMonth: baseMonthly,
          deposit: depositAmount,
          bedrooms: 1 + (propCounter % 4),
          bathrooms: 1 + (propCounter % 3),
          maxGuests: 2 + (propCounter % 5),
          propertyType: propType,
          leaseTerms: ['1 month', '3 months', '6 months', '12 months'],
          amenities: amenities,
          coverImage: coverImg,
          images: [coverImg, secondaryImg],
          status: (propCounter % 15 === 0) ? 'pending_verification' : 'verified',
          rating: Number((4.5 + (propCounter % 6) * 0.1).toFixed(1)),
          reviewCount: 8 + (propCounter * 3) % 40,
          frroSupported: true,
          instantBooking: (propCounter % 3 !== 0),
          featured: (propCounter % 5 === 0),
          isShortTerm: true,
          isLongTerm: true,
          isForeignerFriendly: true,
          virtualTourUrl: coverImg,
          nearbyAttractions: cityMeta.attractions,
          nearbyRestaurants: cityMeta.restaurants,
          houseRules: [
            'No smoking indoors',
            'Quiet hours after 10 PM',
            'Passport copy required for FRRO registration',
            'Pets allowed on request'
          ]
        });

        propCounter++;
      }
    }

    const createdProperties = await Property.insertMany(propertiesToInsert);
    console.log(`Successfully seeded ${createdProperties.length} Properties.`);

    console.log('Seeding Sample Bookings...');
    const b1 = await Booking.create({
      bookingNumber: 'PAS-2026-9810',
      propertyId: createdProperties[0]._id,
      tenantId: tenant1._id,
      ownerId: createdProperties[0].ownerId,
      checkIn: new Date('2026-09-01'),
      checkOut: new Date('2026-09-30'),
      totalAmount: createdProperties[0].pricePerMonth,
      currency: 'INR',
      guests: 2,
      status: 'confirmed',
      paymentStatus: 'paid',
      specialRequests: 'Late night arrival from FRA flight, need key in lockbox.'
    });

    const b2 = await Booking.create({
      bookingNumber: 'PAS-2026-9811',
      propertyId: createdProperties[1]._id,
      tenantId: tenant2._id,
      ownerId: createdProperties[1].ownerId,
      checkIn: new Date('2026-10-05'),
      checkOut: new Date('2026-11-05'),
      totalAmount: createdProperties[1].pricePerMonth,
      currency: 'INR',
      guests: 1,
      status: 'pending',
      paymentStatus: 'unpaid',
      specialRequests: 'Need desk and dual monitors for remote work.'
    });

    const b3 = await Booking.create({
      bookingNumber: 'PAS-2026-9812',
      propertyId: createdProperties[2]._id,
      tenantId: tenant3._id,
      ownerId: createdProperties[2].ownerId,
      checkIn: new Date('2026-07-01'),
      checkOut: new Date('2026-07-31'),
      totalAmount: createdProperties[2].pricePerMonth,
      currency: 'INR',
      guests: 2,
      status: 'completed',
      paymentStatus: 'paid'
    });

    console.log('Seeding Payments...');
    await Payment.create({
      bookingId: b1._id,
      tenantId: tenant1._id,
      amount: createdProperties[0].pricePerMonth,
      currency: 'INR',
      provider: 'razorpay',
      transactionId: 'pay_RZP_TEST_9810293',
      status: 'success',
      paymentMethod: 'Credit Card (International)'
    });

    await Payment.create({
      bookingId: b3._id,
      tenantId: tenant3._id,
      amount: createdProperties[2].pricePerMonth,
      currency: 'INR',
      provider: 'stripe',
      transactionId: 'ch_STRIPE_MOCK_882910',
      status: 'success',
      paymentMethod: 'Stripe Checkout'
    });

    console.log('Seeding Reviews...');
    await Review.create({
      propertyId: createdProperties[0]._id,
      tenantId: tenant1._id,
      bookingId: b1._id,
      tenantName: tenant1.name,
      tenantCountry: tenant1.nationality,
      tenantAvatar: tenant1.avatar,
      rating: 5,
      cleanliness: 5,
      location: 5,
      communication: 5,
      value: 4.8,
      comment: 'Outstanding expat stay! The landlord Rajesh provided all FRRO paperwork within 24 hours of arrival. High speed fiber internet worked flawlessly for video calls.',
      verifiedStay: true
    });

    await Review.create({
      propertyId: createdProperties[2]._id,
      tenantId: tenant3._id,
      bookingId: b3._id,
      tenantName: tenant3.name,
      tenantCountry: tenant3.nationality,
      tenantAvatar: tenant3.avatar,
      rating: 5,
      cleanliness: 5,
      location: 4.8,
      communication: 5,
      value: 4.9,
      comment: 'Fantastic sea view apartment in Bandra. Safe neighborhood, walking distance to cafes and grocery stores.',
      verifiedStay: true
    });

    console.log('Seeding Passports / Documents...');
    await Document.create({
      userId: tenant1._id,
      documentType: 'passport',
      fileName: 'passport_germany_lena.pdf',
      fileUrl: '/uploads/documents/passport_germany_lena.pdf',
      status: 'verified'
    });

    await Document.create({
      userId: tenant2._id,
      documentType: 'visa',
      fileName: 'e_visa_india_daniel.pdf',
      fileUrl: '/uploads/documents/e_visa_india_daniel.pdf',
      status: 'pending'
    });

    console.log('Seeding Notifications...');
    await Notification.create({
      userId: tenant1._id,
      title: 'Booking Confirmed!',
      message: 'Your stay at Light-Filled Penthouse has been confirmed. Landlord FRRO form sent to your email.',
      type: 'booking',
      read: false
    });

    await Notification.create({
      userId: owner1._id,
      title: 'New Booking Request',
      message: 'Daniel O. requested booking for Modern Executive Loft.',
      type: 'booking_request',
      read: false
    });

    console.log('===========================================================');
    console.log('✨ Seed completed successfully!');
    console.log(`- Users: Tenants (tenant@passage.com), Owners (owner@passage.com), Admin (admin@passage.com)`);
    console.log(`- Password for all seed accounts: tenant123 / owner123 / admin123`);
    console.log(`- Properties created: ${createdProperties.length}`);
    console.log('===========================================================');
  } catch (error) {
    console.error('Error during database seed:', error);
    throw error;
  }
};

module.exports = seedDataHelper;
