import React from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  image?: string;
  category: 'learning' | 'project' | 'tutorial' | 'reflection';
}

interface BlogCardProps {
  post: BlogPost;
  onClick?: (postId: string) => void;
  featured?: boolean;
}

export function BlogCard({ post, onClick, featured = false }: BlogCardProps) {
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

  const getReadingTime = (postId: string): number => {
    if (!postId) return 0;
    const key = `reading_time_${postId}`;
    const stored = localStorage.getItem(key);
    if (stored === null) return 0;
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <article 
      className={`bg-card rounded-xl border border-border overflow-hidden card-hover cursor-pointer group ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
      onClick={() => onClick?.(post.id)}
    >
      {/* Featured Image */}
      {post.image && (
        <div className={`overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
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
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className={`text-muted-foreground mb-4 ${
          featured ? 'text-base' : 'text-sm'
        } ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, featured ? 5 : 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {post.tags.length > (featured ? 5 : 3) && (
            <Badge variant="secondary" className="text-xs">
              +{post.tags.length - (featured ? 5 : 3)}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(post.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors text-sm font-medium">
            Read more
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </article>
  );
}