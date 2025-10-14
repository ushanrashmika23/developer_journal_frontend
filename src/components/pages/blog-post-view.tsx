import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Clock, Share2, Github, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { BlogPost } from '../blog-card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface BlogPostViewProps {
  postId: string;
  onBack: () => void;
  onPageChange: (page: string, params?: { [key: string]: string }) => void;
}

interface ApiBlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishDate: string;
  category: 'learning' | 'project' | 'tutorial' | 'reflection';
  image?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function BlogPostView({ postId, onBack, onPageChange }: BlogPostViewProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reading time tracking
  const saveReadingTime = (postId: string, additionalSeconds: number) => {
    if (!postId || additionalSeconds <= 0) return;
    const key = `reading_time_${postId}`;
    const existingTime = getReadingTime(postId);
    const newTime = existingTime + additionalSeconds;
    localStorage.setItem(key, newTime.toString());
  };

  const getReadingTime = (postId: string): number => {
    if (!postId) return 0;
    const key = `reading_time_${postId}`;
    const stored = localStorage.getItem(key);
    if (stored === null) return 0;
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Start reading timer when post loads
  useEffect(() => {
    if (post && !loading) {
      startTimeRef.current = Date.now();

      // Save reading time every 5 seconds
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          saveReadingTime(post.id, 5); // Add 5 seconds each interval
          startTimeRef.current = Date.now(); // Reset start time
        }
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Save any remaining time when component unmounts
      if (startTimeRef.current && post) {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        saveReadingTime(post.id, elapsedSeconds);
      }
    };
  }, [post, loading]);

  // Handle page visibility change (user switches tabs or minimizes)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && startTimeRef.current && post) {
        // User left the page, save current reading time
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        saveReadingTime(post.id, elapsedSeconds);
        startTimeRef.current = null;

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (!document.hidden && post && !intervalRef.current) {
        // User came back, restart timer
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
            saveReadingTime(post.id, 5);
            startTimeRef.current = Date.now();
          }
        }, 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [post]);

  // Fetch post data from API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const result = await response.json();
        if (result.code === 200 && result.status === 'success') {
          // Transform API data to match BlogPost interface
          const apiPost: ApiBlogPost = result.data;
          const transformedPost: BlogPost = {
            id: apiPost._id,
            title: apiPost.title,
            excerpt: apiPost.excerpt,
            content: apiPost.content,
            tags: apiPost.tags,
            publishDate: apiPost.publishDate,
            readTime: 0, // Will be calculated from localStorage
            category: apiPost.category,
            image: apiPost.image,
          };
          setPost(transformedPost);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        {/* Header */}
        <section className="max-w-[800px] mx-auto px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 -ml-3 hover:translate-x-[-2px] transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          {/* Post Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-6" />

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="mb-12 rounded-xl overflow-hidden">
            <Skeleton className="w-full h-64 md:h-96" />
          </div>
        </section>

        {/* Post Content Skeleton */}
        <section className="max-w-[800px] mx-auto px-6 lg:px-8 pb-16">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-16">
        <section className="max-w-[800px] mx-auto px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 -ml-3 hover:translate-x-[-2px] transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load post</h3>
            <p className="text-muted-foreground mb-6">{error || 'Post not found'}</p>
            <Button onClick={onBack} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Back to Blog
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const getCategoryColor = (category: BlogPost['category']) => {
    switch (category) {
      case 'learning':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'project':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'tutorial':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'reflection':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="max-w-[800px] mx-auto px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 -ml-3 hover:translate-x-[-2px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge
              variant="outline"
              className={getCategoryColor(post.category)}
            >
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {Math.max(Math.floor(getReadingTime(post.id) / 60), 1)} min read
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-12 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}
      </section>

      {/* Post Content */}
      <section className="max-w-[800px] mx-auto px-6 lg:px-8 pb-16">
        <article className="prose prose-lg max-w-none">
          <div className="text-foreground leading-relaxed">
            {post.content?.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-3xl font-bold text-foreground mb-6 mt-8">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-semibold text-foreground mb-4 mt-8">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-foreground mb-3 mt-6">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('```')) {
                const codeBlock = paragraph.replace(/```\w*\n?/, '').replace(/\n?```$/, '');
                return (
                  <pre key={index} className="bg-code-bg border border-border rounded-lg p-4 mb-6 overflow-x-auto">
                    <code className="text-sm font-mono text-foreground">{codeBlock}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                return (
                  <p key={index} className="text-muted-foreground italic text-center mb-6 mt-8">
                    {paragraph.replace(/^\*/, '').replace(/\*$/, '')}
                  </p>
                );
              }
              if (paragraph.includes('`') && !paragraph.startsWith('```')) {
                const parts = paragraph.split('`');
                return (
                  <p key={index} className="text-foreground mb-4">
                    {parts.map((part, i) =>
                      i % 2 === 0 ? part : (
                        <code key={i} className="bg-code-bg px-1 py-0.5 rounded text-sm font-mono">
                          {part}
                        </code>
                      )
                    )}
                  </p>
                );
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={index} className="list-disc list-inside mb-4 space-y-1">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="text-foreground">
                        {item.replace(/^- \*\*(.*?)\*\*: /, '').replace(/^- /, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-foreground mb-4 leading-relaxed">
                  {paragraph.split('**').map((part, i) =>
                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                  )}
                </p>
              );
            })}
          </div>
        </article>

        {/* Post Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share this post
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onPageChange('blog')}>
                ← More posts
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  Discuss on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}