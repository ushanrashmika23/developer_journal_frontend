import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Github, ExternalLink, Play, Code, Users, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Card, CardContent } from '../ui/card';
import { Project } from '../project-card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Skeleton } from '../ui/skeleton';
import { API_ENDPOINTS } from '../../config/api';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
  onPageChange: (page: string, params?: {[key: string]: string}) => void;
}

interface ApiProject {
  _id: string;
  title: string;
  description: string[];
  progress: number;
  status: string;
  startDate: string;
  githubUrl?: string;
  demoUrl?: string;
  longDescription: string[];
  techStack: string[];
  features: string[];
  challenges: string[];
  lessons: string[];
  screenShots?: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function ProjectView({ projectId, onBack, onPageChange }: ProjectViewProps) {
  const [project, setProject] = useState<(Project & {
    longDescription: string;
    features: string[];
    challenges: string[];
    lessons: string[];
    screenshots?: string[];
  }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.PROJECT_BY_ID(projectId));
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const result = await response.json();
        if (result.code === 200 && result.status === 'success') {
          const apiProject = result.data;
          // Transform API data to match component interface
          const transformedProject: Project & {
            longDescription: string;
            features: string[];
            challenges: string[];
            lessons: string[];
            screenshots?: string[];
          } = {
            id: apiProject._id,
            title: apiProject.title,
            description: Array.isArray(apiProject.description) ? apiProject.description.join(' ') : apiProject.description,
            techStack: apiProject.techStack,
            progress: apiProject.progress,
            status: apiProject.status.toLowerCase().replace(' ', '-') as Project['status'],
            startDate: apiProject.startDate,
            githubUrl: apiProject.githubUrl,
            demoUrl: apiProject.demoUrl,
            image: apiProject.screenShots?.[0], // Use first screenshot as main image
            longDescription: Array.isArray(apiProject.longDescription) ? apiProject.longDescription.join('\n\n') : apiProject.longDescription,
            features: apiProject.features,
            challenges: apiProject.challenges,
            lessons: apiProject.lessons,
            screenshots: apiProject.screenShots,
          };
          setProject(transformedProject);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

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
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 -ml-3 hover:translate-x-[-2px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        {loading ? (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load project</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : project ? (
          <>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(project.status)}
                  >
                    {getStatusLabel(project.status)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    Started {new Date(project.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                  {project.title}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  {project.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {project.demoUrl && (
                    <Button size="lg" asChild>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="w-5 h-5 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" size="lg" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">Project Progress</h3>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
              </div>

              {/* Project Image */}
              {project.image && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Technology Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm py-2 px-4">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Project Description */}
            <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">About This Project</h2>
              <div className="prose prose-lg max-w-none">
                {project.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-foreground mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Screenshots</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.screenshots.map((screenshot, index) => (
                    <div key={index} className="rounded-lg overflow-hidden border border-border">
                      <ImageWithFallback
                        src={screenshot}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="w-full h-48 md:h-64 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Features, Challenges, and Lessons */}
            <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Features */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Star className="w-5 h-5 text-primary mr-2" />
                      <h3 className="text-lg font-semibold text-card-foreground">Key Features</h3>
                    </div>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Challenges */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Code className="w-5 h-5 text-primary mr-2" />
                      <h3 className="text-lg font-semibold text-card-foreground">Challenges</h3>
                    </div>
                    <ul className="space-y-2">
                      {project.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Lessons */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Users className="w-5 h-5 text-primary mr-2" />
                      <h3 className="text-lg font-semibold text-card-foreground">Lessons Learned</h3>
                    </div>
                    <ul className="space-y-2">
                      {project.lessons.map((lesson, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Project Footer */}
            <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
              <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Interested in This Project?
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Feel free to explore the code, try the live demo, or reach out if you have any questions 
                    about the implementation or would like to collaborate on similar projects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {project.demoUrl && (
                      <Button size="lg" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Try Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" size="lg" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-5 h-5 mr-2" />
                          View on GitHub
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="lg" onClick={() => onPageChange('projects')}>
                      More Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        ) : null}
      </section>
    </div>
  );
}