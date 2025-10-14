import React from 'react';
import { Skeleton } from './skeleton';

interface SkeletonBlogCardProps {
  featured?: boolean;
}

export function SkeletonBlogCard({ featured = false }: SkeletonBlogCardProps) {
  return (
    <article className={`bg-card rounded-xl border border-border overflow-hidden ${
      featured ? 'md:col-span-2 lg:col-span-2' : ''
    }`}>
      {/* Featured Image Skeleton */}
      {featured && (
        <div className={`overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
          <Skeleton className="w-full h-full" />
        </div>
      )}

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between mb-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className={`mb-3 ${featured ? 'h-8' : 'h-6'}`} />
        {featured && <Skeleton className="h-8 w-3/4 mb-3" />}

        {/* Excerpt Skeleton */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          {!featured && <Skeleton className="h-4 w-4/6" />}
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </article>
  );
}
