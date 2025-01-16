'use client';
import { Button } from '@/components/ui/button';
import { Github, Mail, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <main className="space-y-8">
          <section className="space-y-4">
            <h1 className="text-4xl font-bold">Flo Berrez</h1>
            <p className="text-xl text-muted-foreground">
              Software Engineer focused on building reliable and scalable systems.
            </p>
          </section>

          <section className="space-y-2 text-muted-foreground">
            <p>
              Currently working on distributed systems and web apps.
            </p>
            <p>
              Based in France 🇫🇷
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">STACK</h2>
            <div className="flex flex-wrap gap-2">
              {[
                'TypeScript',
                'React',
                'Next.js',
                'Tailwind CSS',
                'NestJS',
                'Docker',
                'MongoDB',
                'PostgreSQL',
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section className="flex space-x-4">
            <Link href="https://github.com/fberrez" target="_blank">
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="ghost" size="sm">
                <Briefcase className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </Link>
            <Link href="https://tally.so/r/3yEEzX" target="_blank">
              <Button variant="ghost" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
