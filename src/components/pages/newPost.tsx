import React, { useState } from 'react';
import { ArrowLeft, Eye, Copy, Save, FileText, Bold, Code, List, Hash, Italic, RotateCcw, CornerDownLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface NewPostProps {
  onBack: () => void;
  onPageChange: (page: string, params?: { [key: string]: string }) => void;
}

export function NewPost({ onBack, onPageChange }: NewPostProps) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [category, setCategory] = useState<'learning' | 'project' | 'tutorial' | 'reflection'>('learning');

  // Convert content to single-line markdown with newline symbols
  const getMarkdownOutput = () => {
    return content.replace(/\n/g, '\\n');
  };

  // Insert syntax helpers
  const insertSyntax = (syntax: string, placeholder = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    let cursorOffset = 0;
    let newlinePrefix = '';
    let newlineSuffix = '';

    // Add newlines before and after if we're not at the start/end of content
    if (start > 0 && content.charAt(start - 1) !== '\n') {
      newlinePrefix = '\n\n';
    }
    if (end < content.length && content.charAt(end) !== '\n') {
      newlineSuffix = '\n\n';
    }

    switch (syntax) {
      case 'h1':
        newText = `${newlinePrefix}# ${selectedText || placeholder || 'Heading 1'}${newlineSuffix}`;
        cursorOffset = newlinePrefix.length + 2;
        break;
      case 'h2':
        newText = `${newlinePrefix}## ${selectedText || placeholder || 'Heading 2'}${newlineSuffix}`;
        cursorOffset = newlinePrefix.length + 3;
        break;
      case 'h3':
        newText = `${newlinePrefix}### ${selectedText || placeholder || 'Heading 3'}${newlineSuffix}`;
        cursorOffset = newlinePrefix.length + 4;
        break;
      case 'bold':
        newText = `**${selectedText || placeholder || 'bold text'}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        newText = `${newlinePrefix}*${selectedText || placeholder || 'italic text'}*${newlineSuffix}`;
        cursorOffset = newlinePrefix.length + 1;
        break;
      case 'code':
        newText = `\`${selectedText || placeholder || 'code'}\``;
        cursorOffset = 1;
        break;
      case 'codeblock':
        newText = `${newlinePrefix}\`\`\`\n${selectedText || placeholder || 'code block'}\n\`\`\`${newlineSuffix}`;
        cursorOffset = newlinePrefix.length + 4;
        break;
      case 'list':
        newText = `${newlinePrefix}- ${selectedText || placeholder || 'list item'}${newlineSuffix}`;
        cursorOffset = newlinePrefix.length + 2;
        break;
      case 'newline':
        newText = '\n\n';
        cursorOffset = 2;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Set cursor position
    setTimeout(() => {
      if (!selectedText && placeholder) {
        textarea.focus();
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + (placeholder?.length || 0));
      } else {
        textarea.focus();
        textarea.setSelectionRange(start + newText.length, start + newText.length);
      }
    }, 0);
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Copy markdown output
  const copyMarkdown = () => {
    const markdownOutput = getMarkdownOutput();
    navigator.clipboard.writeText(markdownOutput);
    // You could add a toast notification here
  };

  // Clear all content
  const clearContent = () => {
    if (window.confirm('Are you sure you want to clear all content?')) {
      setTitle('');
      setExcerpt('');
      setContent('');
      setTags([]);
      setCurrentTag('');
      setCategory('learning');
    }
  };

  // Render preview with the same logic as blog-post-view
  const renderPreview = () => {
    if (!content.trim()) {
      return <p className="text-muted-foreground italic">Start writing to see preview...</p>;
    }

    // Split by double newlines for paragraphs, but handle single newlines within lists
    const sections = content.split(/\n\n+/).filter(p => p.trim());
    
    return sections.map((section, index) => {
      const trimmed = section.trim();
      
      // Headings
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-foreground mb-6 mt-8 first:mt-0">
            {trimmed.substring(2)}
          </h1>
        );
      }
      
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-foreground mb-4 mt-6 first:mt-0">
            {trimmed.substring(3)}
          </h2>
        );
      }
      
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-foreground mb-3 mt-4 first:mt-0">
            {trimmed.substring(4)}
          </h3>
        );
      }

      // Code blocks
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const codeContent = lines.slice(1, -1).join('\n');
        return (
          <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto scrollbar-hide mb-4">
            <code className="text-sm font-mono">{codeContent}</code>
          </pre>
        );
      }

      // Italic centered text
      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.includes('**')) {
        return (
          <p key={index} className="text-center italic text-muted-foreground mb-4">
            {trimmed.slice(1, -1)}
          </p>
        );
      }

      // Lists - handle both single and double newline separated items
      if (trimmed.includes('\n-') || trimmed.startsWith('-')) {
        const listItems = trimmed.split('\n').filter(line => line.trim().startsWith('-'));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-foreground">
            {listItems.map((item, i) => {
              const content = item.trim().substring(1).trim();
              // Handle bold text in lists
              const processedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              const processedWithCode = processedContent.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>');
              
              return (
                <li key={i} dangerouslySetInnerHTML={{ __html: processedWithCode }} />
              );
            })}
          </ul>
        );
      }

      // Regular paragraphs with bold and inline code
      let processedParagraph = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedParagraph = processedParagraph.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>');
      
      return (
        <p key={index} className="mb-4 text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: processedParagraph }} />
      );
    });
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">New Blog Post</h1>
              <p className="text-muted-foreground">Create a new blog post using the DevJournal syntax</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearContent}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={copyMarkdown}>
              <Copy className="w-4 h-4 mr-2" />
              Copy MD
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Post Meta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Excerpt</label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the post..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-10 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:border-primary"
                  >
                    <option value="learning">Learning</option>
                    <option value="project">Project</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="reflection">Reflection</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button size="sm" onClick={addTag}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Syntax Helpers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Syntax Helpers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Button variant="outline" size="sm" onClick={() => insertSyntax('h1')}>
                    <Hash className="w-3 h-3 mr-1" />
                    H1
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertSyntax('h2')}>
                    <Hash className="w-3 h-3 mr-1" />
                    H2
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertSyntax('bold')}>
                    <Bold className="w-3 h-3 mr-1" />
                    Bold
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertSyntax('italic')}>
                    <Italic className="w-3 h-3 mr-1" />
                    Italic
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertSyntax('code')}>
                    <Code className="w-3 h-3 mr-1" />
                    Code
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertSyntax('list')}>
                    <List className="w-3 h-3 mr-1" />
                    List
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => insertSyntax('codeblock')} className="w-full mt-2">
                  <Code className="w-3 h-3 mr-2" />
                  Code Block
                </Button>
                <Button variant="outline" size="sm" onClick={() => insertSyntax('newline')} className="w-full mt-2">
                  <CornerDownLeft className="w-3 h-3 mr-2" />
                  New Line
                </Button>
              </CardContent>
            </Card>

            {/* Markdown Output */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Markdown Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded text-xs font-mono break-all max-h-32 overflow-y-auto scrollbar-hide">
                  {getMarkdownOutput() || 'Content will appear here...'}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This is the single-line format with \\n symbols for API submission
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Editor and Preview */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">
                  <FileText className="w-4 h-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing your blog post content here...

Use the syntax helpers or type manually:
# Main Heading
## Sub Heading
### Minor Heading

**bold text**
*italic centered text*
`inline code`

```
code block
```

- List item 1
- List item 2"
                      className="min-h-[500px] font-mono text-sm"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate max-w-none">
                      {renderPreview()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}