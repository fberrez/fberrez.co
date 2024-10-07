import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ArrowLeft, ExternalLink } from 'lucide-react';
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
              <div className="relative w-full h-48">
                <Image
                  src="/martinup-og.png"
                  alt="martinup.app dashboard"
                  width="1200"
                  height="630"
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
                <Link href="https://martinup.app" target="_blank">
                  <Button>
                    Visit martinup.app <ExternalLink className="ml-2 h-4 w-4" />
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
