import React from 'react';
import { ExternalLink, Github, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  progress: number;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  githubUrl?: string;
  demoUrl?: string;
  startDate: string;
  image?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: (projectId: string) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'planning':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'on-hold':
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div 
      className="bg-card rounded-xl border border-border p-6 card-hover cursor-pointer group"
      onClick={() => onClick?.(project.id)}
    >
      {/* Project Image */}
      {project.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(project.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short'
            })}
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={getStatusColor(project.status)}
        >
          {getStatusLabel(project.status)}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-card-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      {/* Tech Stack */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{project.techStack.length - 4}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex space-x-2">
          {project.githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.githubUrl, '_blank');
              }}
              className="h-8 px-2"
            >
              <Github className="w-4 h-4" />
            </Button>
          )}
          {project.demoUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.demoUrl, '_blank');
              }}
              className="h-8 px-2"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          View Details →
        </Button>
      </div>
    </div>
  );
}