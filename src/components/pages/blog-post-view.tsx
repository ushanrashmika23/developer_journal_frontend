import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Clock, Share2, Github, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { ShareModal } from '../ui/share-modal';
import { BlogPost } from '../blog-card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTheme } from '../theme-provider';
import { API_ENDPOINTS } from '../../config/api';

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { theme } = useTheme();
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
        const response = await fetch(API_ENDPOINTS.POST_BY_ID(postId));
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
          console.log(post);

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
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant="outline"
              className={getCategoryColor(post.category)}
            >
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="hidden sm:flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {Math.max(Math.floor(getReadingTime(post.id) / 60), 1)} min read
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="sm:hidden">
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: '2-digit',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
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
            <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
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
          <div className={`leading-8 text-lg font-normal ${theme === 'dark' ? 'text-gray-300' : 'text-foreground/85'}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' }}>
            {post.content?.split('\n\n').map((paragraph, index) => {
              // Headings
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className={`text-3xl font-bold mb-8 mt-10 leading-tight ${theme === 'dark' ? 'text-foreground/80' : 'text-foreground/90'}`}>
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className={`text-2xl font-bold mb-6 mt-10 leading-snug ${theme === 'dark' ? 'text-foreground/80' : 'text-foreground/90'}`}>
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className={`text-xl font-semibold mb-4 mt-8 leading-snug ${theme === 'dark' ? 'text-foreground/80' : 'text-foreground/90'}`}>
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }

              // Code blocks
              if (paragraph.startsWith('```')) {
                const codeBlock = paragraph.replace(/```\w*\n?/, '').replace(/\n?```$/, '');
                return (
                  <pre key={index} className="bg-code-bg border border-border rounded-xl p-6 mb-8 overflow-x-auto scrollbar-hide shadow-sm">
                    <code className={`text-sm font-mono leading-relaxed ${theme === 'dark' ? 'text-foreground/60' : 'text-foreground/75'}`}>{codeBlock}</code>
                  </pre>
                );
              }

              // Blockquotes
              if (paragraph.startsWith('>')) {
                const quote = paragraph.replace(/^> ?/gm, '');
                return (
                  <blockquote key={index} className={`border-l-4 border-primary/50 pl-6 py-4 mb-8 italic rounded-r-lg ${theme === 'dark' ? 'text-gray-300 bg-primary/5' : 'text-foreground/90 bg-primary/5'}`}>
                    <div className={`text-lg font-normal leading-8 ${theme === 'dark' ? 'text-gray-300' : 'text-foreground/90'}`}>
                      {quote}
                    </div>
                  </blockquote>
                );
              }

              // Tables
              if (paragraph.includes('|') && paragraph.split('\n').length > 1) {
                const lines = paragraph.split('\n');
                const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
                const rows = lines.slice(2).map(line =>
                  line.split('|').map(cell => cell.trim()).filter(cell => cell)
                );

                return (
                  <div key={index} className="overflow-x-auto mb-8">
                    <table className="min-w-full border border-border rounded-lg">
                      <thead>
                        <tr className="bg-muted/30">
                          {headers.map((header, i) => (
                            <th key={i} className={`px-4 py-3 text-left font-semibold border-b border-border ${theme === 'dark' ? 'text-foreground/80' : 'text-foreground/90'}`}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, i) => (
                          <tr key={i} className="border-b border-border/50">
                            {row.map((cell, j) => (
                              <td key={j} className={`px-4 py-3 text-lg font-normal leading-7 ${theme === 'dark' ? 'text-gray-300' : 'text-foreground/85'}`}>
                                {cell.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g).map((part, k) => {
                                  // Bold text
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={k} className={`font-bold ${theme === 'dark' ? 'text-primary/70' : 'text-primary/80'}`}>{part.slice(2, -2)}</strong>;
                                  }
                                  // Inline code
                                  if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
                                    return (
                                      <code key={k} className={`bg-primary/10 px-2 py-1 rounded-md text-sm font-mono font-medium ${theme === 'dark' ? 'text-primary/70' : 'text-primary/85'}`}>
                                        {part.slice(1, -1)}
                                      </code>
                                    );
                                  }
                                  // Links
                                  if (part.match(/\[.*?\]\(.*?\)/)) {
                                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                    if (match) {
                                      const [, text, url] = match;
                                      return (
                                        <a key={k} href={url} target="_blank" rel="noopener noreferrer"
                                          className={`text-primary hover:text-primary/80 underline transition-colors ${theme === 'dark' ? 'text-primary/80 hover:text-primary/60' : 'text-primary hover:text-primary/80'}`}>
                                          {text}
                                        </a>
                                      );
                                    }
                                  }
                                  return part;
                                })}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // Images
              if (paragraph.match(/!\[.*?\]\(.*?\)/)) {
                const match = paragraph.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) {
                  const [, alt, src] = match;
                  return (
                    <div key={index} className="mb-8">
                      <ImageWithFallback
                        src={src}
                        alt={alt}
                        className="w-full rounded-lg border border-border shadow-sm"
                      />
                      {alt && (
                        <p className={`text-center text-sm mt-2 italic ${theme === 'dark' ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                          {alt}
                        </p>
                      )}
                    </div>
                  );
                }
              }

              // Italic/emphasis (entire paragraph)
              if (paragraph.startsWith('*') && paragraph.endsWith('*') && !paragraph.includes('**')) {
                return (
                  <p key={index} className={`italic text-center mb-8 mt-8 text-base font-medium ${theme === 'dark' ? 'text-primary/60' : 'text-primary/70'}`}>
                    {paragraph.replace(/^\*/, '').replace(/\*$/, '')}
                  </p>
                );
              }

              // Unordered lists
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={index} className="list-disc list-inside mb-6 space-y-3 pl-4">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className={`leading-8 text-lg font-normal ${theme === 'dark' ? 'text-gray-300' : 'text-foreground/85'}`}>
                        {item.replace(/^- /, '').split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g).map((part, j) => {
                          // Bold text
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className={`font-bold ${theme === 'dark' ? 'text-primary/70' : 'text-primary/80'}`}>{part.slice(2, -2)}</strong>;
                          }
                          // Inline code
                          if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
                            return (
                              <code key={j} className={`bg-primary/10 px-2 py-1 rounded-md text-sm font-mono font-medium ${theme === 'dark' ? 'text-primary/70' : 'text-primary/85'}`}>
                                {part.slice(1, -1)}
                              </code>
                            );
                          }
                          // Links
                          if (part.match(/\[.*?\]\(.*?\)/)) {
                            const match = part.match(/\[(.*?)\]\((.*?)\)/);
                            if (match) {
                              const [, text, url] = match;
                              return (
                                <a key={j} href={url} target="_blank" rel="noopener noreferrer"
                                  className={`text-primary hover:text-primary/80 underline transition-colors ${theme === 'dark' ? 'text-primary/80 hover:text-primary/60' : 'text-primary hover:text-primary/80'}`}>
                                  {text}
                                </a>
                              );
                            }
                          }
                          return part;
                        })}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Regular paragraphs with inline formatting (links, bold, inline code)
              return (
                <p key={index} className={`mb-6 leading-8 text-lg font-normal ${theme === 'dark' ? 'text-gray-300' : 'text-foreground/85'}`}>
                  {paragraph.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g).map((part, i) => {
                    // Bold text
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className={`font-bold ${theme === 'dark' ? 'text-primary/70' : 'text-primary/80'}`}>{part.slice(2, -2)}</strong>;
                    }
                    // Inline code
                    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
                      return (
                        <code key={i} className={`bg-primary/10 px-2 py-1 rounded-md text-sm font-mono font-medium ${theme === 'dark' ? 'text-primary/70' : 'text-primary/85'}`}>
                          {part.slice(1, -1)}
                        </code>
                      );
                    }
                    // Links
                    if (part.match(/\[.*?\]\(.*?\)/)) {
                      const match = part.match(/\[(.*?)\]\((.*?)\)/);
                      if (match) {
                        const [, text, url] = match;
                        return (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                            className={`text-primary hover:text-primary/80 underline transition-colors ${theme === 'dark' ? 'text-primary/80 hover:text-primary/60' : 'text-primary hover:text-primary/80'}`}>
                            {text}
                          </a>
                        );
                      }
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        </article>

        {/* Post Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => onPageChange('blog')}>
                ← More posts
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share this post
              </Button>
              {/* <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  Discuss on GitHub
                </a>
              </Button> */}
            </div>
          </div>
        </div>
      </section>
      {/* <p>{post.content}</p> */}

      {/* Share Modal */}
      {post && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title={post.title}
          url={`${window.location.origin}/blog/${post.id}`}
          description={post.excerpt}
        />
      )}
    </div>
  );
}