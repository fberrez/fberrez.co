import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            fberrez.co
          </Link>
          <nav>
            <Button variant="link" asChild>
              <Link href="/">Home</Link>
            </Button>
          </nav>
        </header>

        <main className="py-12 space-y-20">
          <section>
            <Link
              href="/"
              className="flex items-center text-primary hover:underline mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-6">My Work</h1>
            <p className="text-xl mb-12">
              Here are some of the projects I&apos;ve worked on.
            </p>

            <Card className="mb-8 overflow-hidden">
              <div className="relative w-full h-[430px]">
                <Image
                  src="/minihabits-og.png"
                  alt="minihabits.co dashboard"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">minihabits.co</CardTitle>
                <CardDescription>
                  A Minimalist Habit Tracking Application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  minihabits is a clean, intuitive habit tracking application built with NestJS, 
                  MongoDB, and JWT. It focuses on simplicity and effectiveness to help users build 
                  and maintain daily habits.
                </p>
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Dark/Light mode support for comfortable viewing</li>
                  <li>Clean, modern UI with smooth animations</li>
                  <li>5-day habit tracking view for progress monitoring</li>
                  <li>Streak counting to maintain motivation</li>
                  <li>Persistent storage using AsyncStorage</li>
                  <li>Haptic feedback for enhanced interaction</li>
                  <li>Detailed habit view and analytics</li>
                </ul>
                <h3 className="font-semibold mb-2">Technical Highlights:</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Built with NestJS for robust backend architecture</li>
                  <li>MongoDB for flexible data storage</li>
                  <li>JWT implementation for secure authentication</li>
                  <li>Intuitive modal interface for habit creation</li>
                </ul>
                <Link href="https://www.minihabits.co?utm_source=fberrez.co" target="_blank">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Live
                  </Button>
                </Link>
                <Link href="https://github.com/fberrez/minihabits" target="_blank">
                  <Button variant="ghost" size="sm">
                    <Github className="mr-2 h-4 w-4" /> View on GitHub
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mb-8 overflow-hidden">
              <div className="relative w-full h-[430px]">
                <Image
                  src="/martinup-og.png"
                  alt="martinup.app dashboard"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">martinup.app</CardTitle>
                <CardDescription>
                  Premium Project Monitoring for Visionaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  MartinUp offers unparalleled insight and control for
                  discerning solopreneurs. It&apos;s a comprehensive project
                  monitoring solution designed to provide real-time insights and
                  performance analytics for web services and APIs.
                </p>
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    Lightning-Fast Monitoring with high-frequency project checks
                  </li>
                  <li>Robust Security with end-to-end encryption</li>
                  <li>
                    Comprehensive Analytics dashboard for actionable insights
                  </li>
                  <li>24/7 Availability ensuring constant vigilance</li>
                  <li>Customizable alert preferences</li>
                </ul>
                <h3 className="font-semibold mb-2">How It Works:</h3>
                <ol className="list-decimal pl-5 mb-4">
                  <li>Connect: Add project endpoints quickly and easily</li>
                  <li>
                    Monitor: Continuous checks at intervals as frequent as every
                    minute
                  </li>
                  <li>Alert: Instant notifications for detected issues</li>
                  <li>
                    Analyze: Gain deep insights from detailed performance
                    analytics
                  </li>
                </ol>
                <p className="mb-4">
                  MartinUp aims to make powerful project monitoring accessible
                  to solopreneurs and small teams.
                </p>
                <Link href="https://github.com/fberrez/martinup.app" target="_blank">
                  <Button variant="ghost" size="sm">
                    <Github className="mr-2 h-4 w-4" /> View on GitHub
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mb-8 overflow-hidden">
              <div className="relative w-full h-[430px]">
                <Image
                  src="/nodejobsdev-og.png"
                  alt="nodejobs.dev homepage"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">nodejobs.dev</CardTitle>
                <CardDescription>
                  Specialized Job Board for Node.js Ecosystem Developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  nodejobs.dev is a focused job board connecting talented developers with opportunities 
                  in the Node.js ecosystem, including Node.js, Bun, and Deno. The platform serves both 
                  frontend and backend developers working with JavaScript/TypeScript technologies.
                </p>
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Curated job listings for Node.js ecosystem developers</li>
                  <li>Support for multiple runtime environments (Node.js, Bun, Deno)</li>
                  <li>Frontend and backend position categories</li>
                  <li>Easy job posting and application process</li>
                  <li>Advanced search and filtering capabilities</li>
                </ul>
                <h3 className="font-semibold mb-2">Platform Benefits:</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li>Specialized focus on JavaScript/TypeScript technologies</li>
                  <li>High-quality, relevant job opportunities</li>
                  <li>Active community of Node.js ecosystem developers</li>
                  <li>Streamlined hiring process for employers</li>
                </ul>
                <Link href="https://github.com/fberrez/nodejobs.dev" target="_blank">
                  <Button variant="ghost" size="sm">
                    <Github className="mr-2 h-4 w-4" /> View on GitHub
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
