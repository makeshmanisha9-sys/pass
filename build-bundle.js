const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const filesToBundle = [
  'public/js/api.js',
  'public/js/components/Navbar.jsx',
  'public/js/components/Footer.jsx',
  'public/js/components/PropertyCard.jsx',
  'public/js/components/AIAssistantModal.jsx',
  'public/js/pages/HomePage.jsx',
  'public/js/pages/SearchPage.jsx',
  'public/js/pages/PropertyDetailPage.jsx',
  'public/js/pages/BookingPage.jsx',
  'public/js/pages/PaymentPage.jsx',
  'public/js/pages/BookingConfirmationPage.jsx',
  'public/js/pages/MyBookingsPage.jsx',
  'public/js/pages/WishlistPage.jsx',
  'public/js/pages/UserProfilePage.jsx',
  'public/js/pages/AuthPages.jsx',
  'public/js/pages/OwnerDashboard.jsx',
  'public/js/pages/AdminDashboard.jsx',
  'public/js/pages/StaticPages.jsx',
  'public/js/pages/TouristGuidePage.jsx',
  'public/js/App.jsx'
];

let bundleCode = '/* Passage Production Single Bundle with Auto-Retry Mount */\n';
for (const relPath of filesToBundle) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    const code = fs.readFileSync(fullPath, 'utf8');
    const res = babel.transformSync(code, {
      presets: ['@babel/preset-react'],
      filename: path.basename(relPath)
    });
    bundleCode += '\n/* --- ' + relPath + ' --- */\n' + res.code + '\n';
  }
}

// Mount app safely with polling retry loop
bundleCode += `
function mountPassageApp() {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || typeof window.App === 'undefined') {
    setTimeout(mountPassageApp, 50);
    return;
  }

  try {
    if (!window._passageAppMounted) {
      window._passageAppMounted = true;
      const root = ReactDOM.createRoot(rootEl);
      root.render(React.createElement(window.App));
    }
  } catch (e) {
    console.error('Passage App Mount Error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountPassageApp);
} else {
  mountPassageApp();
}
`;

fs.writeFileSync(path.join(__dirname, 'public/js/app-bundle.js'), bundleCode);
console.log('✅ Local App bundle rebuilt successfully: public/js/app-bundle.js (Size:', bundleCode.length, 'bytes)');
