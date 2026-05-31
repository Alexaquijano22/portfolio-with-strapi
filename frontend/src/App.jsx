import { useEffect } from 'react';
import { ProfileProvider, useProfileContext } from './features/profile/context/ProfileContext.jsx';
import { Header } from './features/profile/components/Header.jsx';
import { Hero } from './features/profile/components/Hero.jsx';
import { About } from './features/profile/components/About.jsx';
import { Footer } from './features/profile/components/Footer.jsx';
import { Skills } from './features/skills/components/Skills.jsx';
import { Projects } from './features/projects/components/Projects.jsx';

function Layout() {
  const { data } = useProfileContext();

  // Inject seoDescription into the existing <meta name="description"> once data resolves.
  // It is never rendered in any visible section.
  useEffect(() => {
    if (!data) return;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', data.seoDescription ?? '');
  }, [data]);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ProfileProvider>
      <Layout />
    </ProfileProvider>
  );
}

export default App;
