import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Komponen Halaman Utama
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Locations from './components/Locations';
import Pricing from './components/Pricing';
import Questions from './components/Questions';
import Experience from './components/Experience';
import Reviews from './components/Reviews';
import Cta from './components/Cta';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

// Import semua halaman baru
import DiscordPricing from './pages/discord';
import MinecraftPricing from './pages/minecraft';
import VpsPricing from './pages/vps';
import AboutUs from './pages/aboutus';
import Support from './pages/support';
import TOS from './pages/tos';
import PrivacyPolicy from './pages/privacy';
import StatusPage from './pages/status';
import Dashboard from './pages/dashboard';
import AccountSettings from './pages/account';
import ServerConsole from './pages/server-console';
import ServerAnalytics from './pages/server-analytics';
import ServerSettings from './pages/server-settings';
import ServerStartup from './pages/server-startup';
import ServerFiles from './pages/server-files';
import ServerEdit from './pages/server-edit';
import CreateServer from './pages/create-server';
import ServerInstallation from './pages/server-installation';

// Komponen untuk scroll ke atas saat ganti halaman
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


const Home = () => (
  <>
    <Hero />
    <Features />
    <Locations />
    <Pricing />
    <Questions />
    <Experience />
    <Reviews />
    <Cta />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            {/* Rute Halaman Utama */}
            <Route path="/" element={<Home />} />

            {/* Rute Dashboard & Account */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<AccountSettings />} />

            {/* Rute Create Server */}
            <Route path="/create-server" element={<CreateServer />} />
            <Route path="/server/installation" element={<ServerInstallation />} />

            {/* Rute Server Management */}
            <Route path="/server/console" element={<ServerConsole />} />
            <Route path="/server-console" element={<ServerConsole />} />
            <Route path="/server/analytics" element={<ServerAnalytics />} />
            <Route path="/server/settings" element={<ServerSettings />} />
            <Route path="/server/startup" element={<ServerStartup />} />
            <Route path="/server/files" element={<ServerFiles />} />
            <Route path="/server/edit" element={<ServerEdit />} />

            {/* Rute Halaman Layanan */}
            <Route path="/discord" element={<DiscordPricing />} />
            <Route path="/minecraft" element={<MinecraftPricing />} />
            <Route path="/vps" element={<VpsPricing />} />

            {/* Rute Halaman More */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/support" element={<Support />} />
            <Route path="/tos" element={<TOS />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/status" element={<StatusPage />} />

            {/* Rute Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;