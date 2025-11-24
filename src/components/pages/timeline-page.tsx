import React, { useState } from 'react';
import { Calendar, Code, Trophy, Users, ExternalLink, Briefcase } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'project' | 'achievement' | 'experience';
  title: string;
  description: string;
  tags: string[];
  links?: Array<{
    label: string;
    url: string;
  }>;
  image?: string;
}

interface TimelinePageProps {
  onPageChange: (page: string, params?: { [key: string]: string }) => void;
}

export function TimelinePage({ onPageChange }: TimelinePageProps) {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      date: '2024-12-20',
      type: 'project',
      title: 'Completed Developer Journal & Blog',
      description: 'Finished building my personal developer journal and blog platform with React, TypeScript, and Tailwind CSS. Features include dark/light theme switching, responsive design, and content management.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX'],
      links: [
        { label: 'Live Demo', url: 'https://devjournal.dev' },
        { label: 'GitHub', url: 'https://github.com/username/dev-journal' },
      ],
    },
    {
      id: '3',
      date: '2024-12-01',
      type: 'experience',
      title: 'Contributed to Open Source',
      description: 'Made my first significant contributions to open source projects including bug fixes and feature additions to popular React libraries.',
      tags: ['Open Source', 'Community', 'React', 'JavaScript'],
      links: [
        { label: 'Pull Requests', url: 'https://github.com/pulls' },
      ],
    },
    {
      id: '4',
      date: '2024-11-20',
      type: 'achievement',
      title: 'Reached 1000+ Lines of TypeScript',
      description: 'Major achievement in my TypeScript journey. Built multiple projects with strong typing and learned advanced TypeScript features.',
      tags: ['TypeScript', 'Achievement', 'Learning'],
    },
    {
      id: '5',
      date: '2024-11-01',
      type: 'project',
      title: 'Started Task Management Dashboard',
      description: 'Began development of a comprehensive task management application with real-time collaboration features using React, TypeScript, and Supabase.',
      tags: ['React', 'TypeScript', 'Supabase', 'Real-time'],
      links: [
        { label: 'Progress', url: '/projects' },
      ],
    },
    {
      id: '7',
      date: '2024-10-01',
      type: 'project',
      title: 'Built Personal Finance Tracker',
      description: 'Created a privacy-focused expense tracking application with advanced categorization and budgeting features using Next.js and PostgreSQL.',
      tags: ['Next.js', 'PostgreSQL', 'Finance', 'Privacy'],
      links: [
        { label: 'GitHub', url: 'https://github.com/username/finance-tracker' },
      ],
    },
    {
      id: '8',
      date: '2024-09-15',
      type: 'achievement',
      title: 'Completed 100 Days of Code',
      description: 'Successfully completed the 100 Days of Code challenge, building projects and learning new technologies consistently for 100 days.',
      tags: ['100DaysOfCode', 'Consistency', 'Learning', 'Challenge'],
    },
    {
      id: '9',
      date: '2024-08-20',
      type: 'project',
      title: 'Released Weather Forecast App',
      description: 'Built and deployed a beautiful weather application with animated backgrounds and detailed forecasts. First project with PWA features.',
      tags: ['React', 'PWA', 'API Integration', 'CSS Animations'],
      links: [
        { label: 'Live Demo', url: 'https://weather-app-demo.netlify.app' },
        { label: 'GitHub', url: 'https://github.com/username/weather-app' },
      ],
    },
    {
      id: '11',
      date: '2024-07-01',
      type: 'project',
      title: 'Launched Portfolio Website v3',
      description: 'Third iteration of my portfolio website with improved performance, accessibility, and modern design using Astro and React.',
      tags: ['Astro', 'React', 'Portfolio', 'Performance'],
      links: [
        { label: 'Live Site', url: 'https://myportfolio.dev' },
      ],
    },
    {
      id: '12',
      date: '2024-06-01',
      type: 'project',
      title: 'Built E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment processing, inventory management, and admin dashboard using Vue.js and Node.js.',
      tags: ['Vue.js', 'Node.js', 'E-commerce', 'Full-stack'],
      links: [
        { label: 'Demo', url: 'https://ecommerce-demo.netlify.app' },
      ],
    },
    {
      id: '14',
      date: '2024-04-01',
      type: 'experience',
      title: 'Started Developer Journey',
      description: 'Made the decision to transition into web development. Began with HTML, CSS, and JavaScript fundamentals.',
      tags: ['Career Change', 'HTML', 'CSS', 'JavaScript'],
    },
  ];

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'project':
        return Code;
      case 'achievement':
        return Trophy;
      case 'experience':
        return Briefcase;
      default:
        return Calendar;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'project':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'achievement':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'experience':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const years = Array.from(new Set(timelineEvents.map(event =>
    new Date(event.date).getFullYear().toString()
  ))).sort((a, b) => parseInt(b) - parseInt(a));

  const filteredEvents = timelineEvents.filter(event => {
    const yearMatch = selectedYear === 'all' || new Date(event.date).getFullYear().toString() === selectedYear;
    const typeMatch = selectedEventType === 'all' || event.type === selectedEventType;
    return yearMatch && typeMatch;
  });

  const eventCounts = timelineEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            My Developer Timeline
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A chronological journey through my development career. From first lines of code
            to major projects, achievements, and experiences.
          </p>
        </div>

        {/* Timeline Stats */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <div className="text-center p-4 bg-card rounded-lg border border-border flex-1 max-w-xs">
            <div className="text-2xl font-bold text-green-600">{eventCounts.project || 0}</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border border-border flex-1 max-w-xs">
            <div className="text-2xl font-bold text-orange-600">{eventCounts.experience || 0}</div>
            <div className="text-sm text-muted-foreground">Experiences</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border border-border flex-1 max-w-xs">
            <div className="text-2xl font-bold text-blue-600">{eventCounts.achievement || 0}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
        </div>

        {/* Year Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Button
            variant={selectedYear === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedYear('all')}
          >
            All Years
          </Button>
          {years.map(year => (
            <Button
              key={year}
              variant={selectedYear === year ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>

        {/* Event Type Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedEventType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedEventType('all')}
          >
            All Types
          </Button>
          <Button
            variant={selectedEventType === 'project' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedEventType('project')}
            className={selectedEventType === 'project' ? '' : 'border-green-200 hover:bg-green-50'}
          >
            Projects
          </Button>
          <Button
            variant={selectedEventType === 'experience' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedEventType('experience')}
            className={selectedEventType === 'experience' ? '' : ' border-orange-200 hover:bg-orange-50'}
          >
            Experiences
          </Button>
          <Button
            variant={selectedEventType === 'achievement' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedEventType('achievement')}
            className={selectedEventType === 'achievement' ? '' : 'border-blue-200 hover:bg-blue-50'}
          >
            Achievements
          </Button>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[800px] mx-auto px-6 lg:px-8 pb-16">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

          {/* Timeline Events */}
          <div className="space-y-8">
            {filteredEvents.map((event, index) => {
              const Icon = getEventIcon(event.type);
              return (
                <div key={event.id} className="relative flex items-start gap-6 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 rounded-full bg-card border-2 border-border flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Event Content */}
                  <Card className="flex-1 card-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-card-foreground mb-1 break-words">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="hidden sm:inline">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="sm:hidden">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                year: '2-digit',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 self-start">
                        <Badge
                          variant="outline"
                          className={getEventColor(event.type)}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {event.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Links */}
                      {event.links && event.links.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                          {event.links.map((link) => (
                            <Button
                              key={link.label}
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                {link.label}
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">
              No timeline events found for the selected year.
            </p>
            <Button onClick={() => {
              setSelectedYear('all');
              setSelectedEventType('all');
            }}>
              View All Events
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}