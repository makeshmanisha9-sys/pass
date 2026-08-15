require('dotenv').config();
const connectDB = require('./config/db');
const Property = require('./models/Property');

async function checkVillas() {
  await connectDB();
  const types = await Property.distinct('propertyType');
  console.log('=== DISTINCT PROPERTY TYPES IN ATLAS ===');
  console.log(types);
  
  const allProps = await Property.find({});
  console.log('Total properties count in database:', allProps.length);
  
  const villas = allProps.filter(p => 
    (p.propertyType && p.propertyType.toLowerCase().includes('villa')) ||
    (p.title && p.title.toLowerCase().includes('villa')) ||
    (p.description && p.description.toLowerCase().includes('villa'))
  );
  
  console.log(`=== FOUND ${villas.length} VILLAS IN DATABASE ===`);
  villas.forEach((v, idx) => {
    console.log(`${idx + 1}. [${v.status}] ${v.title} | City: ${v.city} | Type: "${v.propertyType}" | ID: ${v._id}`);
  });
  
  process.exit(0);
}

checkVillas().catch(console.error);
