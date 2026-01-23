import { Button } from "@/components/ui/button";

interface CommandProps {
  name: string;
  parameters?: { name: string; type: "required" | "optional" }[];
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

export default function Guide() {
  const generalCommands: CommandProps[] = [
    {
      name: "help",
      description:
        "Shows this comprehensive command guide to help you get started with NightClaw!",
    },
    {
      name: "setup",
      parameters: [
        { name: "log_channel", type: "optional" },
        { name: "mod_role", type: "optional" },
        { name: "confess_channel", type: "optional" },
      ],
      description:
        "Configure your server with optional logging channel, moderator role, and confession channel for optimal bot performance.",
    },
    {
      name: "ticketsetup",
      description:
        "Creates an interactive ticket system embed with buttons in the current channel, allowing members to create support tickets.",
    },
    {
      name: "confesssetup",
      description:
        "Sets up an anonymous confession system with embed and buttons in the current channel for community engagement.",
    },
  ];

  const moderationCommands: CommandProps[] = [
    {
      name: "warn",
      parameters: [
        { name: "@user", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Issues a formal warning to the specified user with the given reason, tracked in their moderation history.",
    },
    {
      name: "kick",
      parameters: [
        { name: "@user", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Removes the user from the server temporarily. They can rejoin with a new invite link if available.",
    },
    {
      name: "mute",
      parameters: [
        { name: "@user", type: "required" },
        { name: "duration (minutes)", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Temporarily mutes the specified user for the given duration, preventing them from sending messages or speaking in voice channels.",
    },
    {
      name: "unmute",
      parameters: [{ name: "@user", type: "required" }],
      description:
        "Removes the mute from the specified user, restoring their ability to participate in the server.",
    },
    {
      name: "clear",
      parameters: [
        { name: "message_count", type: "required" },
        { name: "reason", type: "required" },
        { name: "@user", type: "optional" },
      ],
      description:
        "Bulk deletes the specified number of messages. If a user is mentioned, only their messages will be removed.",
    },
    {
      name: "ban",
      parameters: [
        { name: "@user", type: "required" },
        { name: "reason", type: "required" },
      ],
      description:
        "Permanently bans the specified user from the server, preventing them from rejoining unless unbanned.",
    },
    {
      name: "sanction",
      parameters: [{ name: "@user", type: "required" }],
      description:
        "Displays a comprehensive overview of all moderation actions taken against the specified user with detailed information.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-accent/5 to-accent-secondary/5 border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            NightClaw Commands Guide
          </h1>
          <p className="text-lg text-muted-foreground">
            Master your Discord server with NightClaw's powerful moderation and
            utility commands
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* General Commands Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-1 h-6 bg-accent-secondary rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-foreground">
              General Commands
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
              Moderation Commands
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
            Need More Help?
          </h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions or need further assistance, feel free to
            reach out directly to me on Discord ( ahranys#0758 )
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              <a href="#top">Back to the top ↑</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
