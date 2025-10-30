import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { Navigation } from './components/navigation';
import { HomePage } from './components/pages/home-page';
import { ProjectsPage } from './components/pages/projects-page';
import { BlogPage } from './components/pages/blog-page';
import { TimelinePage } from './components/pages/timeline-page';
import { AboutPage } from './components/pages/about-page';
import { BlogPostView } from './components/pages/blog-post-view';
import { ProjectView } from './components/pages/project-view';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentParams, setCurrentParams] = useState<{ [key: string]: string }>({});

  // Handle page transitions with smooth animations
  const handlePageChange = (page: string, params?: { [key: string]: string }) => {
    setCurrentPage(page);
    setCurrentParams(params || {});

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL without reloading (simple client-side routing)
    let url = '/';
    if (page !== 'home') {
      url = `/${page}`;
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
      }
    }
    window.history.pushState(null, '', url);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const params: { [key: string]: string } = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      const page = path === '/' ? 'home' : path.slice(1);
      const validPages = ['home', 'projects', 'blog', 'timeline', 'about', 'project-view', 'blog-post-view'];

      if (validPages.includes(page)) {
        setCurrentPage(page);
        setCurrentParams(params);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial page based on URL
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'projects':
        return <ProjectsPage onPageChange={handlePageChange} />;
      case 'blog':
        return <BlogPage onPageChange={handlePageChange} />;
      case 'timeline':
        return <TimelinePage onPageChange={handlePageChange} />;
      case 'about':
        return <AboutPage onPageChange={handlePageChange} />;
      case 'project-view':
        return (
          <ProjectView
            projectId={currentParams.id || '1'}
            onBack={() => handlePageChange('projects')}
            onPageChange={handlePageChange}
          />
        );
      case 'blog-post-view':
        return (
          <BlogPostView
            postId={currentParams.id || '1'}
            onBack={() => handlePageChange('blog')}
            onPageChange={handlePageChange}
          />
        );
      case 'home':
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navigation
          currentPage={currentPage.startsWith('blog-post-view') ? 'blog' : currentPage.startsWith('project-view') ? 'projects' : currentPage}
          onPageChange={handlePageChange}
        />

        <main className="relative">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-background/50">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-4">DevJournal</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  A personal development journal and blog where I share my learning journey,
                  projects, and insights in web development.
                </p>
                <p className="text-sm text-muted-foreground">
                  Built with React, TypeScript, and Tailwind CSS
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-4">Navigation</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <button
                      onClick={() => handlePageChange('home')}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePageChange('projects')}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      Projects
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePageChange('blog')}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      Blog
                    </button>
                  </li>
                  {/* <li>
                    <button
                      onClick={() => window.open('https://ushanrashmika23.vercel.app/', '_blank')}
                      className="hover:text-primary transition-colors"
                    >
                      Portfolio
                    </button>
                  </li> */}
                  <li>
                    <button
                      onClick={() => handlePageChange('about')}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      About
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="https://github.com/ushanrashmika23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/ushanrashmika23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://ushanrashmika23.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      Portfolio
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:ushanrashmika23@gmail.com"
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Built with lots of coffee ☕<br/>
                © 2025 DevJournal | ushanrashmika23.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}