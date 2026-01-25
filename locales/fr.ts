export default {
    // NAVIGATION BAR
    Nav: {
        fastSearch: "Rechercher dans la documentation...",
        guide: "Guide",
        about: "À propos",
        logIn: "Se connecter",
    },
    // HOME PAGE
    home : {
        hero: {
            badgeTitle: "🎉 Disponible dès maintenant !",
            title: "Découvrez",
            titleHighlight: " NightClaw",
            subtitle: "Le bot de modération Discord le plus puissant et intuitif,",
            subtitleHighlight: " conçu par des modérateurs, pour des modérateurs.",
            ctaPrimary: "🚀 Ajouter à Discord",
            ctaSecondary: "📖 Voir les commandes",
            bulletOne: "Actif et en croissance",
            bulletTwo: "Frais et efficace",
            bulletThree: "Conçu par des modérateurs"
        },
        cards: {
            title: "Pourquoi choisir NightClaw ?",
            subtitle: "Découvrez une modération comme jamais auparavant avec des fonctionnalités conçues par de vrais modérateurs.",
            cardOne: {
                title: "Ultra rapide",
                description: "Réponses instantanées aux commandes de modération. Pas de délais, pas d'attente - juste une efficacité pure quand vous en avez le plus besoin.",
            },
            cardTwo: {
                title: "Modération avancée",
                description: "Outils de modération complets incluant avertissements, mutes, expulsions, bannissements et suivi détaillé des sanctions.",
            },
            cardThree: {
                title: "Conception intuitive",
                description: "Des commandes qui ont du sens. Pas de syntaxe complexe ni de paramètres déroutants - juste une modération simple et efficace.",
            },
        },
        statSection: {
            statOne: {
                title: "2025",
                text: "Créé avec soin",
            },
            statTwo: {
                title: "Frais",
                text: "Codebase moderne",
            },
            statThree: {
                title: "En croissance",
                text: "Communauté & fonctionnalités",
            },
            statFour: {
                title: "Actif",
                text: "Développement & Support",
            },
        },
        commandExample: {
            title: "Commandes Simples mais Puissantes",
            subtitle: "Chaque commande est conçue en tenant compte de scénarios de modération réels.",
            commandCard: {
                    titleOne: "Actions Rapides",
                    commandFirstColumn: {
                        commandOne: "/warn",
                        commandOneDesc: "Émettre des avertissements avec raison",
                        commandTwo: "/mute",
                        commandTwoDesc: "Mute temporairement les membres",
                        commandThree: "/clear",
                        commandThreeDesc: "Nettoyage en masse des messages",
                    },
                    titleTwo: "Configuration du serveur",
                    commandSecondColumn: {
                        commandOne: "/setup",
                        commandOneDesc: "Configurer les paramètres du bot",
                        commandTwo: "/ticketsetup",
                        commandTwoDesc: "Système de tickets de support",
                        commandThree: "/sanction",
                        commandThreeDesc: "Voir l'historique de l'utilisateur",
                    },
                    guideCta: "Voir toutes les commandes →"
                },
            },
            footerSection: {
                title: "Prêt à transformer votre serveur ?",
                subtitle: "Rejoignez-nous, faites confiance à NightClaw et découvrez une modération comme jamais auparavant.",
                ctaPrimary: "🎯 Ajouter NightClaw maintenant",
                smallLines: "Gratuit à utiliser • Pas de frais d'installation • Support 24/7 inclus",
            },
    },
    guide: {
            title: "Guide des Commandes",
            subtitle: "Maîtrisez votre serveur Discord avec les puissantes commandes de modération de NightClaw.",
            required: "requis",
            optional: "optionnel",
            generalCommands: {
                title: "Commandes Générales",
                help: {
                    command: "help",
                    description: "Affiche ce guide complet des commandes pour vous aider à démarrer avec NightClaw !",
                },
                setup: {
                    command: "setup",
                    badges: {
                        badgeOne: "log_channel",
                        badgeTwo: "mod_role",
                        badgeThree: "confess_channel",
                    },
                    description: "Configurez votre serveur avec un channel de logs, un rôle de modérateur et un canal de confession pour des performances optimales du bot.",
                },
                ticketsetup: {
                    command: "ticketsetup",
                    description: "Crée un système de tickets interactif avec des boutons dans le channel actuel, permettant aux membres de créer des tickets de support.",
                },
                confesssetup: {
                    command: "confesssetup",
                    description: "Configure un système de confession anonyme avec un embed et des boutons dans le channel actuel pour l'engagement de la communauté.",
                },
            },
            moderationCommands: {
                title: "Commandes de Modération",
                warn: {
                    command: "warn",
                    badges: {
                        badgeOne: "@membre",
                        badgeTwo: "raison",
                    },
                    description: "Ajoute un avertissement à l'utilisateur spécifié avec la raison donnée, sauvegardée dans leur historique de modération.",
                },
                kick: {
                    command: "kick",
                    badges: {
                        badgeOne: "@membre",
                        badgeTwo: "raison",
                    },
                    description: "Kick temporairement l'utilisateur du serveur. Il peut rejoindre à nouveau avec un nouveau lien d'invitation.",
            },
                mute: {
                    command: "mute",
                    badges: {
                        badgeOne: "@membre",
                        badgeTwo: "durée (minutes)",
                        badgeThree: "raison",
                    },
                    description: "Mute temporairement l'utilisateur spécifié pendant la durée donnée, l'empêchant d'envoyer des messages ou de parler dans les canaux vocaux.",
                },
                unmute: {
                    command: "unmute",
                    badges: {
                        badgeOne: "@membre",
                    },
                    description: "Retire le mute de l'utilisateur spécifié, restaurant sa capacité à participer au serveur.",
                },
                clear: {
                    command: "clear",
                    badges: {
                        badgeOne: "quantité",
                        badgeTwo: "raison",
                        badgeThree: "@membre",
                    },
                    description: "Supprime en masse le nombre spécifié de messages. Si un membre est mentionné, seuls ses messages seront supprimés.",
                },
                ban: {
                    command: "ban",
                    badges: {
                        badgeOne: "@membre",
                        badgeTwo: "raison",
                    },
                    description: "Bannit définitivement l'utilisateur spécifié du serveur, l'empêchant de rejoindre à nouveau sauf s'il est débanni.",
                },
                sanction: {
                    command: "sanction",
                    badges: {
                        badgeOne: "@membre",
                    },
                    description: "Affiche un aperçu complet de toutes les actions de modération prises contre l'utilisateur spécifié avec des informations détaillées.",
                },
            },
            help: {
                title: "Besoin de plus d'aide ?",
                text: "Si vous avez des questions ou besoin d'une assistance supplémentaire, n'hésitez pas à me contacter directement sur Discord ( ahranys#0758 )",
                button: "Retour en haut ↑"
            }
        },
        about: {
            title: "L'histoire derrière NightClaw",
            subtitle: "Découvrez le parcours depuis la frustration d'une modératrice jusqu'à la création de la solution ultime de modération Discord",
            sectionOne: {
                title: "Un bot créé par une modératrice",
                content: {
                    paragraphOne: "Tout a commencé en 2025 lorsque j'ai rejoint une équipe de modération pour un grand serveur communautaire Discord. Ils avaient déjà un bot, mais je le trouvais assez étrange à utiliser - les commandes étaient uniquement en français, certaines fonctionnalités étaient bizarres (comme le mute uniquement en secondes), et le bot n'était pas très fiable.",
                    problemBox: {
                        title: "Le Problème",
                        content: "En tant que modératrice, je voulais un bot facile à utiliser, fiable, et avec toutes les fonctionnalités dont j'avais besoin pour modérer efficacement. Les solutions existantes ne répondaient tout simplement pas à ces critères.",
                },
                    paragraphTwo: {
                        partOne: "J'ai donc décidé de créer mon propre bot :",
                        highlight: "NightClaw",
                        partTwo: "L'objectif est de permettre à VOUS et à votre équipe de modération d'avoir un bot facile à utiliser, fiable, et avec toutes les fonctionnalités dont vous avez besoin pour modérer efficacement.",
                    }
                },
            },
            sectionTwo: {
                title: "Rencontrez la Développeuse",
                cardOne: {
                    title: "👋 Salut, je suis Ahranys",
                    content: "Aussi connue sous le nom de Noah, je suis une développeuse web de 21 ans et modératrice Discord. Je crée des applications web depuis plus de 5 ans et modère des serveurs Discord depuis plus de 3 ans.",
                    badgeOne: "5+ ans de développement",
                    badgeTwo: "3+ ans de modération",
                },
                cardTwo: {
                    title: "🎯 Ma Mission",
                    content: "Je suis passionnée par la création d'outils qui facilitent la vie des gens, et je crois que NightClaw est l'un de ces outils. Je travaille constamment à améliorer le bot et à ajouter de nouvelles fonctionnalités basées sur une expérience réelle de modération.",
                    suggestion: "Des suggestions ou des retours ? J'ai hâte de vous lire !",
                }
            },
            sectionThree: {
                title: "Pourquoi NightClaw Existe",
                reasonOne: {
                    title: "Facile à Utiliser",
                    content: "Des commandes intuitives qui ont du sens pour les modérateurs"
                },
                reasonTwo: {
                    title: "Fiable",
                    content: "Conçu pour fonctionner quand vous en avez le plus besoin"
            },
                reasonThree: {
                    title: "Complet",
                    content: "Tout ce dont vous avez besoin pour une modération efficace"
                }
            },
            footer: {
                title: "Merci d'utiliser NightClaw ! 🙏",
                content: "J'espère que NightClaw vous aidera à modérer votre serveur efficacement. Vos retours et votre soutien comptent énormément pour moi et contribuent à améliorer NightClaw pour tout le monde.",
                ctaOne: "Ajouter au Serveur",
                ctaTwo: "Donner son avis",
            }
        }
} as const;