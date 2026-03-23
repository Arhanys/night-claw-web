import { features, title } from "process";

export default {
    // NAVIGATION BAR
    Nav: {
        fastSearch: "Search Documentation...",
        guide: "Guide",
        about: "About",
        logIn: "Log In",
    },
    // HOME PAGE
    home : {
        hero: {
            badgeTitle: "🎉 Now Available for Your Server!",
            title: "Meet",
            titleHighlight: " NightClaw",
            subtitle: "The most powerful and intuitive Discord moderation bot,",
            subtitleHighlight: " built for moderators, by moderators.",
            ctaPrimary: "🚀 Add to Discord",
            ctaSecondary: "📖 View Commands",
            bulletOne: "Active & Growing",
            bulletTwo: "New & Improved",
            bulletThree: "Built by Moderators",
        },
        cards: {
            title: "Why Choose NightClaw?",
            subtitle: "Experience moderation like never before with features designed by real moderators.",
            cardOne: {
                title: "Lightning Fast",
                description: "Instant responses to moderation commands. No delays, no waiting - just pure efficiency when you need it most.",
            },
            cardTwo: {
                title: "Advanced Moderation",
                description: "Comprehensive moderation tools including warns, mutes, kicks,bans, and detailed sanction tracking.",
            },
            cardThree: {
                title: "Intuitive Design",
                description: "Commands that make sense. No complex syntax or confusing parameters - just simple, effective moderation.",
            },
        },
        statSection: {
            statOne: {
                title: "2025",
                text: "Created with care",
            },
            statTwo: {
                title: "Fresh",
                text: "Modern Codebase",
            },
            statThree: {
                title: "Growing",
                text: "Community & Features",
            },
            statFour: {
                title: "Active",
                text: "Development & Support",
            },
        },
        commandExample: {
            title: "Simple Yet Powerful Commands",
            subtitle: "Every command is designed with real moderation scenarios in mind.",
            commandCard: {
                    titleOne: "Quick Actions",
                    commandFirstColumn: {
                        commandOne: "/warn",
                        commandOneDesc: "Issue warnings with reason",
                        commandTwo: "/mute",
                        commandTwoDesc: "Temporarily mute members",
                        commandThree: "/clear",
                        commandThreeDesc: "Bulk message cleanup",
                    },
                    titleTwo: "Server Setup",
                    commandSecondColumn: {
                        commandOne: "/setup",
                        commandOneDesc: "Configure bot settings",
                        commandTwo: "/ticketpanel",
                        commandTwoDesc: "Support ticket system",
                        commandThree: "/sanction",
                        commandThreeDesc: "View user history",
                    },
                    guideCta: "View All Commands →"
                },
            },
            footerSection: {
                title: "Ready to Transform Your Server?",
                subtitle: "Join us, trust NightClaw and experience moderation like never before.",
                ctaPrimary: "🎯 Add NightClaw Now",
                smallLines: "Free to use • No setup fees • 24/7 Support included",
            },
        },
        guide: {
            title: "NightClaw Commands Guide",
            subtitle: "Master your Discord server with NightClaw's powerful moderation and utility commands.",
            required: "required",
            optional: "optional",
            generalCommands: {
                title: "General Commands",
                help: {
                    command: "help",
                    description: "Shows this comprehensive command guide to help you get started with NightClaw!",
                },
                setup: {
                    command: "setup",
                    badges: {
                        badgeOne: "log_channel",
                        badgeTwo: "mod_role",
                        badgeThree: "confess_channel",
                    },
                    description: "Configure your server with optional logging channel, moderator role, and confession channel for optimal bot performance.",
                },
                ticketpanel: {
                    command: "ticketpanel",
                    description: "Posts a support ticket panel with an 'Open Ticket' button in the current channel, allowing members to create private support channels with the moderation team.",
                },
                confessionsetup: {
                    command: "confessionsetup",
                    description: "Posts a confession panel with Anonymous and Public buttons in the current channel, allowing members to submit confessions to the configured confession channel.",
                },
                banappealPanel: {
                    command: "banappeal-panel",
                    description: "Posts a ban appeal panel with an 'Appeal Ban' button in the current channel of the appeal server, allowing banned users to submit a ban appeal.",
                },
            },
            moderationCommands: {
                title: "Moderation Commands",
                warn: {
                    command: "warn",
                    badges: {
                        badgeOne: "@user",
                        badgeTwo: "reason",
                    },
                    description: "Issues a formal warning to the specified user with the given reason, tracked in their moderation history.",
                },
                kick: {
                    command: "kick",
                    badges: {
                        badgeOne: "@user",
                        badgeTwo: "reason",
                    },
                    description: "Removes the user from the server temporarily. They can rejoin with a new invite link if available.",
            },
                mute: {
                    command: "mute",
                    badges: {
                        badgeOne: "@user",
                        badgeTwo: "duration (minutes)",
                        badgeThree: "reason",
                    },
                    description: "Temporarily mutes the specified user for the given duration, preventing them from sending messages or speaking in voice channels.",
                },
                unmute: {
                    command: "unmute",
                    badges: {
                        badgeOne: "@user",
                    },
                    description: "Removes the mute from the specified user, restoring their ability to participate in the server.",
                },
                clear: {
                    command: "clear",
                    badges: {
                        badgeOne: "amount",
                        badgeTwo: "reason",
                        badgeThree: "@user",
                    },
                    description: "Bulk deletes the specified number of messages. If a user is mentioned, only their messages will be removed.",
                },
                ban: {
                    command: "ban",
                    badges: {
                        badgeOne: "@user",
                        badgeTwo: "reason",
                    },
                    description: "Permanently bans the specified user from the server, preventing them from rejoining unless unbanned.",
                },
                sanction: {
                    command: "sanction",
                    badges: {
                        badgeOne: "@user",
                    },
                    description: "Displays a comprehensive overview of all moderation actions taken against the specified user with detailed information.",
                },
                slowmode: {
                    command: "slowmode",
                    badges: {
                        badgeOne: "seconds",
                        badgeTwo: "channel",
                    },
                    description: "Sets or disables slowmode in a channel. Use 0 to disable. Defaults to the current channel if no channel is specified.",
                },
            },
            banAppealSetup: {
                title: "Ban Appeal Server Setup",
                intro: "The ban appeal system requires two servers: your main server and a separate appeal server. Follow the steps below to configure both.",
                step1: {
                    label: "Step 1 — On the main server",
                    content: "Run /setup appeal_invite:<appeal server invite> to set the invite link sent to banned users, and /setup main_invite:<permanent invite> to set the link sent when an appeal is accepted.",
                },
                step2: {
                    label: "Step 2 — On the appeal server",
                    content: "Run /setup source_guild:<main server ID> to link the appeal server to your main server.",
                },
                step3: {
                    label: "Step 3 — On the appeal server",
                    content: "Run /banappeal-panel in the desired channel to post the appeal panel.",
                },
                howItWorksTitle: "How it works",
                howItWorksContent: "A banned user clicks 'Appeal Ban', the bot verifies their ban, and a private appeal-{username} channel is created for staff review. Staff can accept the appeal (user is unbanned and receives the main server invite) or refuse it with a cooldown period (3 days, 1 week, 2 weeks, or 1 month).",
            },
            help: {
                title: "Need More Help?",
                text: "If you have any questions or need further assistance, feel free to reach out directly to me on Discord ( ahranys#0758 )",
                button: "Back to the top ↑"
            }
        },
        about: {
            title: "The Story Behind NightClaw",
            subtitle: "Discover the journey from moderator frustration to creating the ultimate Discord moderation solution",
            sectionOne: {
                title: "A Bot Made by a Moderator",
                content: {
                    paragraphOne: "It all started in 2025 when I joined a moderation team for a large community Discord server. They already had a bot, but I found it pretty weird to use - the commands were in French only, some features were strange (like mute being in seconds only), and the bot wasn't very reliable.",
                    problemBox: {
                        title: "The Problem",
                        content: "As a moderator, I wanted a bot that was easy to use, reliable, and had all the features I needed to moderate effectively. The existing solutions just weren't cutting it.",
                },
                    paragraphTwo: {
                        partOne: "So, I decided to create my own bot:",
                        highlight: "NightClaw",
                        partTwo: "The goal is to allow YOU and your moderation team to have a bot that is easy to use, reliable, and has all the features you need to moderate effectively.",
                    }
                },
            },
            sectionTwo: {
                title: "Meet the Developer",
                cardOne: {
                    title: "👋 Hi, I'm Ahranys",
                    content: "Also known as Noah, I'm a 21-year-old web developer and Discord moderator. I've been crafting web applications for over 5 years and moderating Discord servers for over 3 years.",
                    badgeOne: "5+ Years Development",
                    badgeTwo: "3+ Years Moderation",
                },
                cardTwo: {
                    title: "🎯 My Mission",
                    content: "I'm passionate about creating tools that make life easier for people, and I believe NightClaw is one of those tools. I'm constantly working to improve the bot and add new features based on real moderation experience.",
                    suggestion: "Got suggestions or feedback? I'd love to hear from you!",
                }
            },
            sectionThree: {
                title: "Why NightClaw Exists",
                reasonOne: {
                    title: "Easy to Use",
                    content: "Intuitive commands that make sense to moderators"
                },
                reasonTwo: {
                    title: "Reliable",
                    content: "Built to perform when you need it most"
            },
                reasonThree: {
                    title: "Feature Complete",
                    content: "Everything you need for effective moderation"
                }
            },
            footer: {
                title: "Thank You for Using NightClaw! 🙏",
                content: "I hope NightClaw helps you moderate your server effectively. Your feedback and support mean the world to me and help make NightClaw better for everyone.",
                ctaOne: "Add to Server",
                ctaTwo: "Give Feedback",
            }
        }
} as const;