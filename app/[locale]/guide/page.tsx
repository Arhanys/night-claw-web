import { Button } from "@/components/ui/button";
import { getI18n } from "@/locales/server";

interface CommandProps {
  name: string;
  parameters?: { name: string; type: string }[];
  description: string;
}

function CommandListItem({ name, parameters = [], description }: CommandProps) {
  return (
    <li className="border-l-2 border-accent/30 pl-6 py-4 hover:border-accent transition-colors">
      <div className="mb-2">
        <h3
          id={name}
          className="text-lg font-semibold text-foreground inline-block"
        >
          /{name}
        </h3>
        {parameters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {parameters.map((param, index) => (
              <span
                key={index}
                className={
                  "px-2 py-1 rounded-md text-xs font-medium bg-accent text-background"
                }
              >
                {param.type}: {param.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="text-muted-foreground leading-relaxed ml-0">
        {description}
      </p>
    </li>
  );
}

export default async function Guide() {
  const t = await getI18n();

  const generalCommands: CommandProps[] = [
    {
      name: t("guide.generalCommands.help.command"),
      description: t("guide.generalCommands.help.description"),
    },
    {
      name: t("guide.generalCommands.setup.command"),
      parameters: [
        {
          name: t("guide.generalCommands.setup.badges.badgeOne"),
          type: t("guide.optional"),
        },
        {
          name: t("guide.generalCommands.setup.badges.badgeTwo"),
          type: t("guide.optional"),
        },
        {
          name: t("guide.generalCommands.setup.badges.badgeThree"),
          type: t("guide.optional"),
        },
      ],
      description: t("guide.generalCommands.setup.description"),
    },
    {
      name: t("guide.generalCommands.ticketsetup.command"),
      description: t("guide.generalCommands.ticketsetup.description"),
    },
    {
      name: t("guide.generalCommands.confesssetup.command"),
      description: t("guide.generalCommands.confesssetup.description"),
    },
  ];

  const moderationCommands: CommandProps[] = [
    {
      name: t("guide.moderationCommands.warn.command"),
      parameters: [
        {
          name: t("guide.moderationCommands.warn.badges.badgeOne"),
          type: t("guide.required"),
        },
        {
          name: t("guide.moderationCommands.warn.badges.badgeTwo"),
          type: t("guide.required"),
        },
      ],
      description: t("guide.moderationCommands.warn.description"),
    },
    {
      name: t("guide.moderationCommands.kick.command"),
      parameters: [
        {
          name: t("guide.moderationCommands.kick.badges.badgeOne"),
          type: t("guide.required"),
        },
        {
          name: t("guide.moderationCommands.kick.badges.badgeTwo"),
          type: t("guide.required"),
        },
      ],
      description: t("guide.moderationCommands.kick.description"),
    },
    {
      name: t("guide.moderationCommands.mute.command"),
      parameters: [
        {
          name: t("guide.moderationCommands.mute.badges.badgeOne"),
          type: t("guide.required"),
        },
        {
          name: t("guide.moderationCommands.mute.badges.badgeTwo"),
          type: t("guide.required"),
        },
        {
          name: t("guide.moderationCommands.mute.badges.badgeThree"),
          type: t("guide.required"),
        },
      ],
      description: t("guide.moderationCommands.mute.description"),
    },
    {
      name: t("guide.moderationCommands.unmute.command"),
      parameters: [
        {
          name: t("guide.moderationCommands.unmute.badges.badgeOne"),
          type: t("guide.required"),
        },
      ],
      description: t("guide.moderationCommands.unmute.description"),
    },
    {
      name: t("guide.moderationCommands.clear.command"),
      parameters: [
        {
          name: t("guide.moderationCommands.clear.badges.badgeOne"),
          type: t("guide.required"),
        },
        {
          name: t("guide.moderationCommands.clear.badges.badgeTwo"),
          type: t("guide.required"),
        },
        {
          name: t("guide.moderationCommands.clear.badges.badgeThree"),
          type: t("guide.optional"),
        },
      ],
      description: t("guide.moderationCommands.clear.description"),
    },
    {
      name: t("guide.moderationCommands.ban.command"),
      parameters: [
        {
          name: t("guide.moderationCommands.ban.badges.badgeOne"),
          type: t("guide.required"),
        },
        {
          name: t("guide.moderationCommands.ban.badges.badgeTwo"),
          type: t("guide.required"),
        },
      ],
      description: t("guide.moderationCommands.ban.description"),
    },
    {
      name: t("guide.moderationCommands.sanction.command"),
      parameters: [
        {
          name: t("guide.moderationCommands.sanction.badges.badgeOne"),
          type: t("guide.required"),
        },
      ],
      description: t("guide.moderationCommands.sanction.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-accent/5 to-accent-secondary/5 border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("guide.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("guide.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* General Commands Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-1 h-6 bg-accent-secondary rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("guide.generalCommands.title")}
            </h2>
          </div>
          <ul className="space-y-2">
            {generalCommands.map((command, index) => (
              <CommandListItem key={index} {...command} />
            ))}
          </ul>
        </section>

        {/* Moderation Commands Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-1 h-6 bg-accent-secondary rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("guide.moderationCommands.title")}
            </h2>
          </div>
          <ul className="space-y-2">
            {moderationCommands.map((command, index) => (
              <CommandListItem key={index} {...command} />
            ))}
          </ul>
        </section>

        {/* Footer */}
        <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t("guide.help.title")}
          </h3>
          <p className="text-muted-foreground mb-4">{t("guide.help.text")}</p>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              <a href="#top">{t("guide.help.button")}</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
