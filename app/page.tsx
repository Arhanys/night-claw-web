import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-accent/10 via-accent-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                🎉 Now Available for Your Server!
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Meet <span className="text-accent">NightClaw</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              The most powerful and intuitive Discord moderation bot,
              <span className="text-accent-secondary font-semibold">
                {" "}
                built by moderators, for moderators
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                🚀 Add to Discord
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Link href="/guide#top">📖 View Commands</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Active & Growing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>New & Improved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-secondary rounded-full"></span>
                <span>Built by Moderators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose NightClaw?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience moderation like never before with features designed by
              real moderators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Instant responses to moderation commands. No delays, no waiting
                - just pure efficiency when you need it most.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Advanced Moderation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive moderation tools including warns, mutes, kicks,
                bans, and detailed sanction tracking.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Intuitive Design
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Commands that make sense. No complex syntax or confusing
                parameters - just simple, effective moderation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">2025</div>
              <div className="text-muted-foreground">Created with Care</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-secondary mb-2">
                Fresh
              </div>
              <div className="text-muted-foreground">Modern Codebase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">Growing</div>
              <div className="text-muted-foreground">Community</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-secondary mb-2">
                Active
              </div>
              <div className="text-muted-foreground">Development</div>
            </div>
          </div>
        </div>
      </section>

      {/* Commands Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple Yet Powerful Commands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every command is designed with real moderation scenarios in mind
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent">/warn</span>
                    <span className="text-muted-foreground">
                      Issue warnings with reason
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent">/mute</span>
                    <span className="text-muted-foreground">
                      Temporary mutes in minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent">/clear</span>
                    <span className="text-muted-foreground">
                      Bulk message cleanup
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Server Setup
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent-secondary">
                      /setup
                    </span>
                    <span className="text-muted-foreground">
                      Configure bot settings
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent-secondary">
                      /ticketsetup
                    </span>
                    <span className="text-muted-foreground">
                      Support ticket system
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent-secondary">
                      /sanction
                    </span>
                    <span className="text-muted-foreground">
                      View user history
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/guide">
                <Button variant="outline">View All Commands →</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-accent/5 to-accent-secondary/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Server?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of server owners who trust NightClaw to keep their
              communities safe and organized.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-4 shadow-lg">
                🎯 Add NightClaw Now
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Free to use • No setup fees • 24/7 Support included
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
