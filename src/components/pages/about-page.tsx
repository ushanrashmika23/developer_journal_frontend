import React, { useState } from 'react';
import { MapPin, Mail, Calendar, ExternalLink, Github, Linkedin, Twitter, Bell, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { API_ENDPOINTS } from '../../config/api';
import DevImg from '../img/developer_profile.png';

interface AboutPageProps {
  onPageChange: (page: string, params?: { [key: string]: string }) => void;
}

export function AboutPage({ onPageChange }: AboutPageProps) {
  const skills = [
    { name: 'JavaScript', level: 90, category: 'Frontend' },
    { name: 'TypeScript', level: 85, category: 'Frontend' },
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Next.js', level: 80, category: 'Frontend' },
    { name: 'Angular', level: 70, category: 'Frontend' },
    { name: 'CSS/SCSS', level: 85, category: 'Frontend' },
    { name: 'Tailwind CSS', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 75, category: 'Backend' },
    { name: 'Express.js', level: 70, category: 'Backend' },
    { name: 'PostgreSQL', level: 75, category: 'Backend' },
    { name: 'MongoDB', level: 70, category: 'Backend' },
    { name: 'Supabase', level: 80, category: 'Backend' },
    { name: 'Git', level: 85, category: 'Tools' },
    { name: 'Docker', level: 60, category: 'Tools' },
    { name: 'Figma', level: 75, category: 'Design' },
    { name: 'UI/UX Design', level: 70, category: 'Design' },
  ];

  const experiences = [
    {
      title: 'Freelance Web Developer',
      company: 'Self-employed',
      period: '2023 - Present',
      description: 'Building modern web applications for clients using React, TypeScript, and various backend technologies. Focus on performance, accessibility, and user experience.',
      technologies: ['React', 'TypeScript', 'Next.js', 'Supabase'],
    },
    // {
    //   title: 'Full Stack Developer Master Diploma',
    //   company: 'Devloper Stacks',
    //   period: '2024',
    //   description: 'Intensive 6-month program covering full-stack web development, from frontend frameworks to backend services and database design.',
    //   technologies: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    // },
    {
      title: 'Self-taught Developer',
      company: 'Personal Learning',
      period: 'present',
      description: 'Dedicated self-study period learning web development fundamentals through online courses, documentation, and building personal projects.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Git'],
    },
  ];

  const interests = [
    'Open Source Contribution',
    'UI/UX Design',
    'Web Performance',
    'Accessibility',
    'Machine Learning',
    'Mobile Development',
    'DevOps & CI/CD',
    'Technical Writing',
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/ushanrashmika23' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/in/ushanrashmika23' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/ushanrashmika23' },
    { icon: Mail, label: 'Email', url: 'mailto:ushanrashmika23@gmail.com' },
  ];

  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async () => {
    if (!newsletterName.trim() || !newsletterEmail.trim()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(API_ENDPOINTS.SUBSCRIBERS_NEW, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newsletterName.trim(),
          email: newsletterEmail.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setSubmitStatus('success');
        setNewsletterName('');
        setNewsletterEmail('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillCategories = Array.from(new Set(skills.map(skill => skill.category)));

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Hey, I'm Ushan Rashmika
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A passionate web developer who loves building beautiful, functional, and user-friendly
              applications. I specialize in React, TypeScript, and modern web technologies.
            </p>
            <p className="text-base text-muted-foreground mb-8">
              When I'm not coding, you'll find me exploring new technologies, contributing to open source,
              or sharing my learning journey through this blog. I believe in building in public and
              continuous learning.
            </p>

            <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Colombo, Sri Lanka
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Available for work
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.label}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={DevImg}
                alt="Ushan Rashmika - Developer"
                className="w-60 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Skills & Technologies</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
            <Card key={category} className="p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">{category}</h3>
              <div className="space-y-4">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-card-foreground">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Experience & Journey</h2>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index} className="p-6 card-hover">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <Badge variant="outline" className="text-sm w-fit">
                    {exp.period}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Interests Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Current Interests</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {interests.map((interest) => (
            <Card key={interest} className="p-4 text-center card-hover">
              <CardContent className="p-0">
                <p className="text-sm font-medium text-card-foreground">{interest}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-0">
            {/* <Bell className="w-12 h-12 text-primary mx-auto mb-4" /> */}
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Join the Journey
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Stay updated with my latest projects, insights, and thoughts on web development.
              Get exclusive content and behind-the-scenes looks at what I'm building.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  className="flex-1 bg-background/80 border-border/50 focus:border-primary/50"
                />
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-background/80 border-border/50 focus:border-primary/50"
                />
              </div>
              <Button 
                size="lg" 
                className={`w-full sm:w-auto transition-all duration-300 ${
                  submitStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
                onClick={handleNewsletterSubmit}
                disabled={isSubmitting || submitStatus === 'success'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Joined!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <Bell className="w-5 h-5 mr-2" />
                    Try Again
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5 mr-2" />
                    Join the Journey
                  </>
                )}
              </Button>
              {submitStatus === 'error' && (
                <p className="text-sm text-red-500 mt-2 animate-pulse">
                  Please check your details and try again.
                </p>
              )}
              {submitStatus === 'success' && (
                <p className="text-sm text-green-600 mt-2 animate-bounce">
                  Welcome aboard! Check your email for confirmation.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}