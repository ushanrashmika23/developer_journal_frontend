import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, Calendar, Clock } from 'lucide-react';
import { BlogCard, BlogPost } from '../blog-card';
import { SkeletonBlogCard } from '../ui/skeleton-blog-card';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { API_ENDPOINTS } from '../../config/api';

interface BlogPageProps {
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

export function BlogPage({ onPageChange }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.POSTS_META_LIST);
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

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort posts
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'shortest':
          return a.readTime - b.readTime;
        case 'longest':
          return b.readTime - a.readTime;
        case 'newest':
        default:
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
    });
  }, [blogPosts, searchQuery, categoryFilter, sortBy]);

  const postCounts = useMemo(() => {
    return {
      total: blogPosts.length,
      learning: blogPosts.filter(p => p.category === 'learning').length,
      tutorial: blogPosts.filter(p => p.category === 'tutorial').length,
      project: blogPosts.filter(p => p.category === 'project').length,
      reflection: blogPosts.filter(p => p.category === 'reflection').length,
    };
  }, [blogPosts]);

  const featuredPost = filteredAndSortedPosts[0];
  const regularPosts = filteredAndSortedPosts.slice(1);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Developer Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My thoughts, learnings, and insights from the world of software development. 
            From technical tutorials to project reflections and weekly learning summaries.
          </p>
        </div>

        {/* Blog Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {loading ? (
            <>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            </>
          ) : (
            <>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-foreground">{postCounts.total}</div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-blue-600">{postCounts.learning}</div>
                <div className="text-sm text-muted-foreground">Learning</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-purple-600">{postCounts.tutorial}</div>
                <div className="text-sm text-muted-foreground">Tutorials</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-green-600">{postCounts.project}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-orange-600">{postCounts.reflection}</div>
                <div className="text-sm text-muted-foreground">Reflections</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Filters and Search */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Filters</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="reflection">Reflection</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="shortest">Shortest Read</SelectItem>
                <SelectItem value="longest">Longest Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="px-3 py-1">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="px-3 py-1">
                Category: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {loading ? (
        <section className="max-w-[1200px] mx-auto px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Post</h2>
          <SkeletonBlogCard featured={true} />
        </section>
      ) : featuredPost && (
        <section className="max-w-[1200px] mx-auto px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Post</h2>
          <BlogCard 
            post={featuredPost} 
            featured={true}
            onClick={(postId) => onPageChange('blog-post-view', { id: postId })}
          />
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 pb-16">
        {loading ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Posts</h2>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonBlogCard key={index} />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load posts</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : regularPosts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                All Posts ({regularPosts.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Sorted by {sortBy.replace('est', '')}</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  onClick={(postId) => onPageChange('blog-post-view', { id: postId })}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setSortBy('newest');
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}