import { Button } from "@/components/ui/button";
import { getI18n } from "@/locales/server";

export default async function About() {
  const t = await getI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="section-glow-secondary">
        <div className="container mx-auto px-6 pt-16 pb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("about.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Origin Story Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-1 h-8 bg-accent rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-foreground">
              {t("about.sectionOne.title")}
            </h2>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t("about.sectionOne.content.paragraphOne")}
              </p>

              <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent mb-6">
                <p className="text-foreground font-medium mb-2">
                  {t("about.sectionOne.content.problemBox.title")}
                </p>
                <p className="text-muted-foreground">
                  {t("about.sectionOne.content.problemBox.content")}
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {t("about.sectionOne.content.paragraphTwo.partOne")}
                <span className="text-accent font-semibold">
                  {t("about.sectionOne.content.paragraphTwo.highlight")}
                </span>
                .{t("about.sectionOne.content.paragraphTwo.partTwo")}
              </p>
            </div>
          </div>
        </section>

        {/* About Developer Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-1 h-8 bg-accent-secondary rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-foreground">
              {t("about.sectionTwo.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {t("about.sectionTwo.cardOne.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("about.sectionTwo.cardOne.content")}
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-md text-sm font-medium">
                  {t("about.sectionTwo.cardOne.badgeOne")}
                </span>
                <span className="px-3 py-1 bg-accent-secondary/20 text-accent-secondary rounded-md text-sm font-medium">
                  {t("about.sectionTwo.cardOne.badgeTwo")}
                </span>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {t("about.sectionTwo.cardTwo.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("about.sectionTwo.cardTwo.content")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.sectionTwo.cardTwo.suggestion")}
              </p>
            </div>
          </div>
        </section>

        {/* Values & Philosophy Section */}
        <section className="mb-16">
          <div className="bg-linear-to-br from-muted/50 to-muted/20 rounded-lg p-8 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              {t("about.sectionThree.title")}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-background font-bold text-lg">🚀</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {t("about.sectionThree.reasonOne.title")}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t("about.sectionThree.reasonOne.content")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-background font-bold text-lg">⚡</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {t("about.sectionThree.reasonTwo.title")}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t("about.sectionThree.reasonTwo.content")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-background font-bold text-lg">🛠️</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {t("about.sectionThree.reasonThree.title")}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t("about.sectionThree.reasonThree.content")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t("about.footer.title")}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t("about.footer.content")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg">{t("about.footer.ctaOne")}</Button>
            <Button variant="secondary" size="lg">
              {t("about.footer.ctaTwo")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
