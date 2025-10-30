import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Search, Plus } from 'lucide-react';
import { ProjectCard, Project } from '../project-card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { API_ENDPOINTS } from '../../config/api';

interface ProjectsPageProps {
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
  techStack: string[];
  firstScreenShot?: string;
}

export function ProjectsPage({ onPageChange }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [techFilter, setTechFilter] = useState<string>('all');

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.PROJECTS_META_LIST);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const result = await response.json();
        if (result.code === 200 && result.status === 'success') {
          // Transform API data to match Project interface
          const transformedProjects: Project[] = result.data.map((project: ApiProject) => ({
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
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get all unique technologies for filter
  const allTechnologies = useMemo(() => {
    if (loading || projects.length === 0) return [];
    const techs = new Set<string>();
    projects.forEach(project => {
      project.techStack.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, [projects, loading]);

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      const matchesTech = techFilter === 'all' || project.techStack.includes(techFilter);

      return matchesSearch && matchesStatus && matchesTech;
    });
  }, [projects, searchQuery, statusFilter, techFilter]);

  const projectCounts = useMemo(() => {
    return {
      total: projects.length,
      completed: projects.filter(p => p.status === 'completed').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      planning: projects.filter(p => p.status === 'planning').length,
      onHold: projects.filter(p => p.status === 'on-hold').length,
    };
  }, [projects]);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            My Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of projects I've built while learning and exploring different technologies. 
            From web applications to data visualizations, here's my development journey.
          </p>
        </div>

        {/* Project Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="text-center p-4 bg-card rounded-lg border border-border">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-foreground">{projectCounts.total}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-green-600">{projectCounts.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-blue-600">{projectCounts.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-yellow-600">{projectCounts.planning}</div>
              <div className="text-sm text-muted-foreground">Planning</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-gray-600">{projectCounts.onHold}</div>
              <div className="text-sm text-muted-foreground">On Hold</div>
            </div>
          </div>
        )}
      </section>

      {/* Filters and Search */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Filters</span>
            </div>
            <Button variant="outline" size="sm" className="lg:ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>

            {/* Technology Filter */}
            {loading ? (
              <div className="relative">
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Select value={techFilter} onValueChange={setTechFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {allTechnologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="px-3 py-1">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {techFilter !== 'all' && (
              <Badge variant="secondary" className="px-3 py-1">
                Tech: {techFilter}
                <button
                  onClick={() => setTechFilter('all')}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl border border-border p-6">
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load projects</h3>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={(projectId) => onPageChange('project-view', { id: projectId })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTechFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}