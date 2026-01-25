import { Button } from "@/components/ui/button";
import { getI18n } from "@/locales/server";
import Link from "next/link";

export default async function Home() {
  const t = await getI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-accent/10 via-accent-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                {t("home.hero.badgeTitle")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              {t("home.hero.title")}
              <span className="text-accent">
                {t("home.hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("home.hero.subtitle")}
              <span className="text-accent-secondary font-semibold">
                {t("home.hero.subtitleHighlight")}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                {t("home.hero.ctaPrimary")}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Link href="/guide#top">{t("home.hero.ctaSecondary")}</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{t("home.hero.bulletOne")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>{t("home.hero.bulletTwo")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-secondary rounded-full"></span>
                <span>{t("home.hero.bulletThree")}</span>
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
              {t("home.cards.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.cards.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {t("home.cards.cardOne.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.cards.cardOne.description")}
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {t("home.cards.cardTwo.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.cards.cardTwo.description")}
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {t("home.cards.cardThree.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.cards.cardThree.description")}
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
              <div className="text-3xl font-bold text-accent mb-2">
                {t("home.statSection.statOne.title")}
              </div>
              <div className="text-muted-foreground">
                {t("home.statSection.statOne.text")}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-secondary mb-2">
                {t("home.statSection.statTwo.title")}
              </div>
              <div className="text-muted-foreground">
                {t("home.statSection.statTwo.text")}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">
                {t("home.statSection.statThree.title")}
              </div>
              <div className="text-muted-foreground">
                {t("home.statSection.statThree.text")}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-secondary mb-2">
                {t("home.statSection.statFour.title")}
              </div>
              <div className="text-muted-foreground">
                {t("home.statSection.statFour.text")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commands Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t("home.commandExample.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.commandExample.subtitle")}
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t("home.commandExample.commandCard.titleOne")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent">
                      {t(
                        "home.commandExample.commandCard.commandFirstColumn.commandOne",
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "home.commandExample.commandCard.commandFirstColumn.commandOneDesc",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent">
                      {t(
                        "home.commandExample.commandCard.commandFirstColumn.commandTwo",
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "home.commandExample.commandCard.commandFirstColumn.commandTwoDesc",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent">
                      {t(
                        "home.commandExample.commandCard.commandFirstColumn.commandThree",
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "home.commandExample.commandCard.commandFirstColumn.commandThreeDesc",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t("home.commandExample.commandCard.titleTwo")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent-secondary">
                      {t(
                        "home.commandExample.commandCard.commandSecondColumn.commandOne",
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "home.commandExample.commandCard.commandSecondColumn.commandOneDesc",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent-secondary">
                      {t(
                        "home.commandExample.commandCard.commandSecondColumn.commandTwo",
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "home.commandExample.commandCard.commandSecondColumn.commandTwoDesc",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-accent-secondary">
                      {t(
                        "home.commandExample.commandCard.commandSecondColumn.commandThree",
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "home.commandExample.commandCard.commandSecondColumn.commandThreeDesc",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/guide">
                <Button variant="outline">
                  {t("home.commandExample.commandCard.guideCta")}
                </Button>
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
              {t("home.footerSection.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("home.footerSection.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-4 shadow-lg">
                {t("home.footerSection.ctaPrimary")}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("home.footerSection.smallLines")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
