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
                        commandTwo: "/ticketpanel",
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
                ticketpanel: {
                    command: "ticketpanel",
                    description: "Publie un panel de tickets avec un bouton 'Ouvrir un ticket' dans le channel actuel, permettant aux membres de créer des channels de support privés avec l'équipe de modération.",
                },
                confessionsetup: {
                    command: "confessionsetup",
                    description: "Publie un panel de confession avec des boutons Anonyme et Public dans le channel actuel, permettant aux membres d'envoyer des confessions dans le channel configuré.",
                },
                banappealPanel: {
                    command: "banappeal-panel",
                    description: "Publie un panel d'appel de bannissement avec un bouton 'Faire appel' dans le channel actuel du serveur d'appel, permettant aux utilisateurs bannis de soumettre un appel.",
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
                slowmode: {
                    command: "slowmode",
                    badges: {
                        badgeOne: "secondes",
                        badgeTwo: "channel",
                    },
                    description: "Définit ou désactive le mode lent dans un channel. Utilisez 0 pour désactiver. Par défaut, s'applique au channel actuel si aucun channel n'est spécifié.",
                },
            },
            banAppealSetup: {
                title: "Configuration du serveur d'appel de bannissement",
                intro: "Le système d'appel de bannissement nécessite deux serveurs : votre serveur principal et un serveur d'appel séparé. Suivez les étapes ci-dessous pour configurer les deux.",
                step1: {
                    label: "Étape 1 — Sur le serveur principal",
                    content: "Exécutez /setup appeal_invite:<invitation du serveur d'appel> pour définir le lien envoyé aux utilisateurs bannis, et /setup main_invite:<invitation permanente> pour définir le lien envoyé lorsqu'un appel est accepté.",
                },
                step2: {
                    label: "Étape 2 — Sur le serveur d'appel",
                    content: "Exécutez /setup source_guild:<ID du serveur principal> pour lier le serveur d'appel à votre serveur principal.",
                },
                step3: {
                    label: "Étape 3 — Sur le serveur d'appel",
                    content: "Exécutez /banappeal-panel dans le channel souhaité pour publier le panel d'appel.",
                },
                howItWorksTitle: "Comment ça fonctionne",
                howItWorksContent: "Un utilisateur banni clique sur 'Faire appel', le bot vérifie son bannissement, et un channel privé d'appel est créé pour l'examen par le staff. Le staff peut accepter l'appel (l'utilisateur est débanni et reçoit l'invitation au serveur principal) ou le refuser avec une période de cooldown (3 jours, 1 semaine, 2 semaines ou 1 mois).",
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
                    content: "Aussi connue sous le nom de Noa, je suis une développeuse web de 21 ans et modératrice Discord. Je crée des applications web depuis plus de 5 ans et modère des serveurs Discord depuis plus de 3 ans.",
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