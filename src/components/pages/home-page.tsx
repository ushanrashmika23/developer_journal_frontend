import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, BookOpen, Target, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BlogCard, BlogPost } from '../blog-card';
import { SkeletonBlogCard } from '../ui/skeleton-blog-card';
import { Skeleton } from '../ui/skeleton';
import { ProjectCard, Project } from '../project-card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HomePageProps {
  onPageChange: (page: string, params?: {[key: string]: string}) => void;
}

interface ApiBlogPost {
  _id: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishDate: string;
  category: 'learning' | 'project' | 'tutorial' | 'reflection';
  image?: string;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/posts/metaList');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const result = await response.json();
        if (result.code === 200 && result.status === 'success') {
          // Transform API data to match BlogPost interface
          const transformedPosts: BlogPost[] = result.data.map((post: ApiBlogPost) => ({
            id: post._id,
            title: post.title,
            excerpt: post.excerpt,
            tags: post.tags,
            publishDate: post.publishDate,
            readTime: 0, // Will be calculated from localStorage
            category: post.category,
            image: post.image,
          }));
          setBlogPosts(transformedPosts);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        setProjectsError(null);
        const response = await fetch('http://localhost:3000/projects/metaList');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const result = await response.json();
        if (result.code === 200 && result.status === 'success') {
          // Transform API data to match Project interface
          const transformedProjects: Project[] = result.data.map((project: any) => ({
            id: project._id,
            title: project.title,
            description: Array.isArray(project.description) ? project.description.join(' ') : project.description,
            techStack: project.techStack,
            progress: project.progress,
            status: project.status.toLowerCase().replace(' ', '-') as Project['status'],
            startDate: project.startDate,
            githubUrl: project.githubUrl,
            demoUrl: project.demoUrl,
            image: project.firstScreenShot,
          }));
          setProjects(transformedProjects);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        setProjectsError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get reading time from localStorage
  const getReadingTime = (postId: string): number => {
    if (!postId) return 0;
    const key = `reading_time_${postId}`;
    const stored = localStorage.getItem(key);
    if (stored === null) return 0;
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Get featured post (first post) and recent posts (next 3)
  const featuredPost = blogPosts[0];
  const latestPosts = blogPosts.slice(1, 4); // Next 3 posts for the compact layout
  const recentPosts = blogPosts.slice(4, 6); // Posts 5-6 for recent posts section

  // Get featured projects (first 2 projects)
  const featuredProjects = projects.slice(0, 2);

  const stats = [
    { label: 'Projects Completed', value: '12', icon: Target },
    { label: 'Blog Posts Written', value: '34', icon: BookOpen },
    { label: 'Lines of Code', value: '25K+', icon: Code },
    { label: 'Days Learning', value: '180+', icon: Calendar },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Building in Public,
              <br />
              <span className="text-primary">Learning in the Open</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Welcome to my developer journey. This is where I document my learning process, 
              share project insights, and reflect on the challenges and breakthroughs in my 
              software development career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => onPageChange('projects')}
                className="px-6 py-3 bg-primary hover:bg-primary/90"
              >
                View My Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => onPageChange('about')}
                className="px-6 py-3"
              >
                About Me
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1615285307672-09b361d7c61a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjB3b3Jrc3BhY2UlMjBzZXR1cHxlbnwxfHx8fDE3NTcwMTk0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Developer workspace"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Blog Post */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Latest Insight</h2>
          <Button 
            variant="ghost" 
            onClick={() => onPageChange('blog')}
            className="text-primary hover:text-primary/80"
          >
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonBlogCard featured={true} />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg border border-border">
                  <Skeleton className="flex-shrink-0 w-16 h-16 rounded-md" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4 mb-2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : featuredPost ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BlogCard 
                post={featuredPost} 
                featured={true}
                onClick={(postId) => onPageChange('blog-post-view', { id: postId })}
              />
            </div>
            
          </div>
        ) : null}
      </section>

      {/* Recent Posts */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Recent Posts</h2>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            <SkeletonBlogCard />
            <SkeletonBlogCard />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <BlogCard 
                key={post.id} 
                post={post}
                onClick={(postId) => onPageChange('blog-post-view', { id: postId })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Projects */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Current Projects</h2>
          <Button
            variant="ghost"
            onClick={() => onPageChange('projects')}
            className="text-primary hover:text-primary/80"
          >
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {projectsLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        ) : projectsError ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load projects</h3>
            <p className="text-muted-foreground mb-6">{projectsError}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={(projectId) => onPageChange('project-view', { id: projectId })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Projects will appear here once they're added to the system.
            </p>
            <Button onClick={() => onPageChange('projects')}>
              View All Projects
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}