'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Calendar,
  Rocket,
  Zap,
  Package,
  Code,
  User,
  Send,
  Globe,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 flex justify-between items-center">
          <div className="text-2xl font-bold">fberrez.co</div>
          <nav>
            <Link href="/portfolio">
              <Button variant="link">My work</Button>
            </Link>
            <Link href="https://tally.so/r/3yEEzX" target="_blank">
              <Button variant="link">Talk with me</Button>
            </Link>
          </nav>
        </header>

        <main className="py-12 space-y-20">
          <section className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Transform Your Idea into Reality
            </h1>
            <p className="text-xl mb-6">
              I specialize in turning innovative concepts into market-ready
              MVPs. Efficient, cost-effective, and seamless development process.
            </p>
            <Link href="https://tally.so/r/3yEEzX" target="_blank">
              <Button size="lg">
                <Rocket className="mr-2 h-4 w-4" /> Launch Your Project
              </Button>
            </Link>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">
              Why choose me?
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: Zap,
                  title: 'Rapid development',
                  description: "I'll have your MVP ready in 2-4 weeks.",
                },
                {
                  icon: Package,
                  title: 'Complete package',
                  description:
                    'I provide both web application and landing page.',
                },
                {
                  icon: Code,
                  title: 'Modern technology',
                  description:
                    'I use the latest technologies for speed and scalability.',
                },
                {
                  icon: User,
                  title: 'Experienced developer',
                  description:
                    'I have years of experience building successful startups.',
                },
                {
                  icon: Globe,
                  title: 'Multilingual communication',
                  description: 'I speak both English and French fluently.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <feature.icon className="mr-4 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">
              My process - it&apos;s simple!
            </h2>
            <div className="space-y-8">
              {[
                {
                  title: 'Specification',
                  description:
                    'I discuss your idea with you and create a detailed specification.',
                },
                {
                  title: 'Development',
                  description:
                    'You can watch your MVP take shape with regular updates from me.',
                },
                {
                  title: 'Launch',
                  description:
                    "I deploy your product and provide training to ensure you're confident in running it.",
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-lg font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">Pricing</h2>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="mr-2 h-6 w-6" /> MVP Package
                  </CardTitle>
                  <CardDescription>$3,899 (1 spot left)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5">
                    <li>Web application and landing page</li>
                    <li>Essential integrations</li>
                    <li>SEO optimization</li>
                    <li>Setup and deployment</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="mr-2 h-6 w-6" /> Landing Page
                  </CardTitle>
                  <CardDescription>$699 (2 spots left)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5">
                    <li>Tailored professional copy</li>
                    <li>Custom design</li>
                    <li>Mobile-responsive</li>
                    <li>Setup and deployment</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">About me</h2>
            <div className="bg-secondary p-6 rounded-lg flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                <Image
                  src="/flo.jpg"
                  alt="Flo"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-center sm:text-left">
                  Flo
                </h3>
                <p>
                  Hey, I&apos;m Flo. With years of experience leading
                  engineering teams in startups and corporations, I&apos;ve seen
                  first-hand what makes products succeed. I&apos;ve built
                  several successful MVPs myself, and now I want to help you
                  bring your ideas to life quickly and efficiently. You have the
                  vision; I have the technical expertise to make it happen.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              🚀 Let&apos;s Turn Your Idea into Reality
            </h2>
            <Link href="https://cal.com/fberrez/30min" target="_blank">
              <Button size="lg">
                <Calendar className="mr-2 h-4 w-4" /> Book a Call With Me
              </Button>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
