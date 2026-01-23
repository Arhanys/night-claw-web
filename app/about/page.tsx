import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-accent-secondary/5 to-accent/5 border-b border-border">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Story Behind NightClaw
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the journey from moderator frustration to creating the
            ultimate Discord moderation solution
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Origin Story Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-1 h-8 bg-accent rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-foreground">
              A Bot Made by a Moderator
            </h2>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                It all started in 2025 when I joined a moderation team for a
                large community Discord server. They already had a bot, but I
                found it pretty weird to use - the commands were in French only,
                some features were strange (like mute being in seconds only),
                and the bot wasn't very reliable.
              </p>

              <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent mb-6">
                <p className="text-foreground font-medium mb-2">The Problem</p>
                <p className="text-muted-foreground">
                  As a moderator, I wanted a bot that was easy to use, reliable,
                  and had all the features I needed to moderate effectively. The
                  existing solutions just weren't cutting it.
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                So, I decided to create my own bot:{" "}
                <span className="text-accent font-semibold">NightClaw</span>.
                The goal is to allow YOU and your moderation team to have a bot
                that is easy to use, reliable, and has all the features you need
                to moderate effectively.
              </p>
            </div>
          </div>
        </section>

        {/* About Developer Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-1 h-8 bg-accent-secondary rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-foreground">
              Meet the Developer
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                👋 Hi, I'm Ahranys
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Also known as Noah, I'm a 21-year-old web developer and Discord
                moderator. I've been crafting web applications for over 5 years
                and moderating Discord servers for over 3 years.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-md text-sm font-medium">
                  5+ Years Development
                </span>
                <span className="px-3 py-1 bg-accent-secondary/20 text-accent-secondary rounded-md text-sm font-medium">
                  3+ Years Moderation
                </span>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                🎯 My Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm passionate about creating tools that make life easier for
                people, and I believe NightClaw is one of those tools. I'm
                constantly working to improve the bot and add new features based
                on real moderation experience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Got suggestions or feedback? I'd love to hear from you!
              </p>
            </div>
          </div>
        </section>

        {/* Values & Philosophy Section */}
        <section className="mb-16">
          <div className="bg-linear-to-br from-muted/50 to-muted/20 rounded-lg p-8 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Why NightClaw Exists
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-background font-bold text-lg">🚀</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  Easy to Use
                </h4>
                <p className="text-muted-foreground text-sm">
                  Intuitive commands that make sense to moderators
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-background font-bold text-lg">⚡</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Reliable</h4>
                <p className="text-muted-foreground text-sm">
                  Built to work when you need it most
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-background font-bold text-lg">🛠️</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  Feature Complete
                </h4>
                <p className="text-muted-foreground text-sm">
                  Everything you need for effective moderation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Thank You for Using NightClaw! 🙏
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            I hope NightClaw helps you moderate your server effectively. Your
            feedback and support mean the world to me and help make NightClaw
            better for everyone.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg">Add to Server</Button>
            <Button variant="secondary" size="lg">
              Give Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
