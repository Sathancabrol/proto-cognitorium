-- ============================================================
-- COGNITORIUM — Cahier des Spécifications Techniques
-- Livrable 1 : Schéma Entité-Association + DDL SQLite
-- Version : 1.0 — 7 août 2026
-- Cible : SQLite 3.35+ (WAL mode, foreign keys ON)
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA encoding = 'UTF-8';

-- ------------------------------------------------------------
-- 1. UTILISATEURS & MÉTADONNÉES
-- ------------------------------------------------------------
CREATE TABLE users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT NOT NULL UNIQUE,
    display_name    TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),  -- ISO 8601
    onboarding_completed BOOLEAN NOT NULL DEFAULT 0,
    last_backup_at  TEXT,
    config_json     TEXT DEFAULT '{}'  -- surcharge locale des paramètres globaux
);

CREATE INDEX idx_users_username ON users(username);

-- ------------------------------------------------------------
-- 2. RÉFÉRENTIEL INTERNE DES COMPÉTENCES (Unicité globale)
-- ------------------------------------------------------------
CREATE TABLE competence (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL UNIQUE,  -- ex: "Python", "Gestion de projet"
    family          TEXT NOT NULL CHECK(family IN ('technique','transversal','langue')),
    rome_codes      TEXT,  -- JSON array ["M1805","M1403"] ou NULL si hors ROME
    description     TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_competence_family ON competence(family);
CREATE INDEX idx_competence_rome ON competence(rome_codes);  -- via json_extract dans les requêtes

-- ------------------------------------------------------------
-- 3. CONTEXTES DE COMPÉTENCE PAR UTILISATEUR
--    Une compétence unique peut exister dans N contextes
-- ------------------------------------------------------------
CREATE TABLE competence_context (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competence_id       INTEGER NOT NULL REFERENCES competence(id) ON DELETE CASCADE,
    contexte_nom        TEXT NOT NULL,  -- ex: "Dev web", "Data Analyst"
    statut              TEXT NOT NULL DEFAULT 'detectee'
                            CHECK(statut IN ('detectee','proposee','acceptee','validee','refusee','archivee')),
    derniere_pratique_date TEXT,  -- ISO 8601 date
    frequence           INTEGER DEFAULT 0,  -- occurrences / an
    niveau_historique   INTEGER DEFAULT 0 CHECK(niveau_historique BETWEEN 0 AND 100),
    niveau_actuel       INTEGER DEFAULT 0 CHECK(niveau_actuel BETWEEN 0 AND 100),
    confiance           REAL DEFAULT 0.2 CHECK(confiance BETWEEN 0.0 AND 1.0),
    potentiel_recup     INTEGER DEFAULT 0 CHECK(potentiel_recup BETWEEN 0 AND 100),
    -- Calculé : niveau_historique * exp(-lambda * delta_t)
    date_calcul_decay   TEXT,  -- dernière fois que le decay a été appliqué
    UNIQUE(user_id, competence_id, contexte_nom)
);

CREATE INDEX idx_ctx_user ON competence_context(user_id);
CREATE INDEX idx_ctx_comp  ON competence_context(competence_id);
CREATE INDEX idx_ctx_statut ON competence_context(statut);

-- ------------------------------------------------------------
-- 4. PREUVES (Sources de scoring)
-- ------------------------------------------------------------
CREATE TABLE preuve (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competence_context_id INTEGER NOT NULL REFERENCES competence_context(id) ON DELETE CASCADE,
    type                TEXT NOT NULL CHECK(type IN ('diplome','projet','exp','attest','auto')),
    niveau              INTEGER NOT NULL CHECK(niveau BETWEEN 0 AND 100),
    poids               REAL NOT NULL,  -- ex: 0.9 pour diplôme
    date_preuve         TEXT NOT NULL,  -- ISO 8601
    description         TEXT,
    document_path       TEXT,  -- chemin vers fichier justificatif local
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_preuve_ctx ON preuve(competence_context_id);
CREATE INDEX idx_preuve_user ON preuve(user_id);
CREATE INDEX idx_preuve_date ON preuve(date_preuve);

-- ------------------------------------------------------------
-- 5. PARCOURS & ÉVÉNEMENTS (Timeline)
-- ------------------------------------------------------------
CREATE TABLE parcours_event (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK(type IN ('formation','experience','certification','projet_personnel','volontariat')),
    titre           TEXT NOT NULL,
    organisation    TEXT,
    date_debut      TEXT NOT NULL,  -- ISO 8601
    date_fin        TEXT,           -- NULL si en cours
    description     TEXT,
    raw_text        TEXT,           -- texte brut pour extraction déterministe
    competences_extraites TEXT,     -- JSON array des IDs compétences détectées
    ordre_affichage INTEGER DEFAULT 0
);

CREATE INDEX idx_pe_user ON parcours_event(user_id);
CREATE INDEX idx_pe_dates ON parcours_event(date_debut, date_fin);

-- ------------------------------------------------------------
-- 6. FORMATIONS (enrichissement du parcours)
-- ------------------------------------------------------------
CREATE TABLE formation (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id        INTEGER UNIQUE REFERENCES parcours_event(id) ON DELETE CASCADE,
    niveau_rncp     TEXT,  -- ex: "RNCP6", "RNCP7"
    domaine         TEXT,
    credits_ects    INTEGER,
    certifiante     BOOLEAN DEFAULT 0
);

-- ------------------------------------------------------------
-- 7. PROJETS & OBJECTIFS (Career Navigator)
-- ------------------------------------------------------------
CREATE TABLE projet (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nom             TEXT NOT NULL,
    rome_cible      TEXT,  -- code ROME visé
    description     TEXT,
    statut          TEXT NOT NULL DEFAULT 'actif' CHECK(statut IN ('actif','pause','termine','abandonne')),
    date_creation   TEXT NOT NULL DEFAULT (datetime('now')),
    date_echeance   TEXT
);

CREATE INDEX idx_projet_user ON projet(user_id);

CREATE TABLE projet_etape (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id       INTEGER NOT NULL REFERENCES projet(id) ON DELETE CASCADE,
    ordre           INTEGER NOT NULL,
    titre           TEXT NOT NULL,
    description     TEXT,
    type_action     TEXT CHECK(type_action IN ('formation','certification','experience','recherche','reseau')),
    competence_cible_id INTEGER REFERENCES competence(id),
    date_prevue     TEXT,
    date_realisee   TEXT,
    statut          TEXT NOT NULL DEFAULT 'a_faire' CHECK(statut IN ('a_faire','en_cours','faite','bloquee'))
);

-- ------------------------------------------------------------
-- 8. RECOMMANDATIONS (Matching ROME)
-- ------------------------------------------------------------
CREATE TABLE recommandation (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    projet_id       INTEGER REFERENCES projet(id) ON DELETE SET NULL,
    rome_code       TEXT NOT NULL,
    rome_intitule   TEXT NOT NULL,
    score_matching  REAL NOT NULL CHECK(score_matching BETWEEN 0.0 AND 1.0),
    categorie       TEXT NOT NULL CHECK(categorie IN ('disponible','formation_rapide','formation_longue','eloigne')),
    raisonnement    TEXT NOT NULL,  -- texte explicite pour l'utilisateur
    competences_manquantes TEXT,  -- JSON array
    formations_suggerees TEXT,    -- JSON array
    date_calcul     TEXT NOT NULL DEFAULT (datetime('now')),
    vue             BOOLEAN DEFAULT 0  -- flag "déjà consultée"
);

CREATE INDEX idx_reco_user ON recommandation(user_id);
CREATE INDEX idx_reco_score ON recommandation(score_matching);

-- ------------------------------------------------------------
-- 9. BIAIS COGNITIFS (Likert 7 points)
-- ------------------------------------------------------------
CREATE TABLE biais_scores (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    confirmation    INTEGER NOT NULL CHECK(confirmation BETWEEN 1 AND 7),
    ancrage         INTEGER NOT NULL CHECK(ancrage BETWEEN 1 AND 7),
    exces_confiance INTEGER NOT NULL CHECK(exces_confiance BETWEEN 1 AND 7),
    statu_quo       INTEGER NOT NULL CHECK(statu_quo BETWEEN 1 AND 7),
    aversion_perte  INTEGER NOT NULL CHECK(aversion_perte BETWEEN 1 AND 7),
    effet_halo      INTEGER NOT NULL CHECK(effet_halo BETWEEN 1 AND 7),
    disponibilite   INTEGER NOT NULL CHECK(disponibilite BETWEEN 1 AND 7),
    retrospectif    INTEGER NOT NULL CHECK(retrospectif BETWEEN 1 AND 7),
    autorite        INTEGER NOT NULL CHECK(autorite BETWEEN 1 AND 7),
    omission        INTEGER NOT NULL CHECK(omission BETWEEN 1 AND 7),
    score_global    REAL,  -- moyenne normalisée 0-100 si besoin
    date_passation  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ------------------------------------------------------------
-- 10. IMPORTS ROME (Versionnage)
-- ------------------------------------------------------------
CREATE TABLE rome_import (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    version         TEXT NOT NULL,
    date_import     TEXT NOT NULL DEFAULT (datetime('now')),
    fichier_hash    TEXT NOT NULL,  -- SHA-256 du CSV source
    nb_fiches       INTEGER NOT NULL,
    actif           BOOLEAN NOT NULL DEFAULT 1  -- 1 = version courante utilisée
);

CREATE TABLE rome_fiche (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    import_id       INTEGER NOT NULL REFERENCES rome_import(id) ON DELETE CASCADE,
    code            TEXT NOT NULL,
    intitule        TEXT NOT NULL,
    competences_savoirs     TEXT,  -- texte brut concaténé
    competences_savoir_faire TEXT,
    competences_savoir_etre  TEXT,
    activites       TEXT,
    contextes       TEXT,
    acces           TEXT,
    passerelles     TEXT,
    UNIQUE(import_id, code)
);

CREATE INDEX idx_rome_fiche_code ON rome_fiche(code);
CREATE INDEX idx_rome_fiche_import ON rome_fiche(import_id);

-- ------------------------------------------------------------
-- 11. SAUVEGARDES (Métadonnées)
-- ------------------------------------------------------------
CREATE TABLE backups_meta (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fichier_nom     TEXT NOT NULL,
    fichier_chemin  TEXT NOT NULL,
    taille_octets   INTEGER,
    date_creation   TEXT NOT NULL DEFAULT (datetime('now')),
    type            TEXT NOT NULL CHECK(type IN ('auto','manuel')),
    hash_db         TEXT  -- SHA-256 de la base contenue dans le ZIP
);

CREATE INDEX idx_backup_user ON backups_meta(user_id);

-- ------------------------------------------------------------
-- 12. LOGS TECHNIQUES (Application-level, hors rotation fichiers)
-- ------------------------------------------------------------
CREATE TABLE app_logs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    niveau          TEXT NOT NULL CHECK(niveau IN ('DEBUG','INFO','WARNING','ERROR','CRITICAL')),
    module          TEXT NOT NULL,
    message         TEXT NOT NULL,
    context_json    TEXT DEFAULT '{}',
    timestamp       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_logs_ts ON app_logs(timestamp);
CREATE INDEX idx_logs_niveau ON app_logs(niveau);

-- ============================================================
-- TRIGGERS MÉTIER
-- ============================================================

-- Trigger : Quand toutes les preuves d'un contexte sont supprimées,
-- replafonner confiance à 0.2 et niveau_actuel à 40 max.
CREATE TRIGGER trg_preuve_delete_check
AFTER DELETE ON preuve
BEGIN
    UPDATE competence_context
    SET confiance = 0.2,
        niveau_actuel = MIN(niveau_actuel, 40),
        statut = CASE WHEN statut = 'validee' THEN 'acceptee' ELSE statut END
    WHERE id = OLD.competence_context_id
      AND (SELECT COUNT(*) FROM preuve WHERE competence_context_id = OLD.competence_context_id) = 0;
END;

-- Trigger : Quand une preuve est ajoutée, recaler le statut si besoin
CREATE TRIGGER trg_preuve_insert_check
AFTER INSERT ON preuve
BEGIN
    UPDATE competence_context
    SET statut = CASE WHEN statut IN ('detectee','proposee') THEN 'acceptee' ELSE statut END
    WHERE id = NEW.competence_context_id;
END;

-- Trigger : Auto-timestamp de modification implicite sur competence_context
-- (pas de colonne updated_at, mais on loggue via app_logs si besoin)

-- ============================================================
-- VUES UTILITAIRES
-- ============================================================

-- Vue : Profil complet utilisateur avec niveaux actuels et confiance
CREATE VIEW v_profil_competences AS
SELECT 
    u.id AS user_id,
    u.username,
    c.id AS competence_id,
    c.name AS competence_nom,
    c.family,
    cc.contexte_nom,
    cc.statut,
    cc.niveau_historique,
    cc.niveau_actuel,
    cc.confiance,
    cc.potentiel_recup,
    cc.derniere_pratique_date,
    cc.date_calcul_decay,
    COUNT(p.id) AS nb_preuves
FROM users u
JOIN competence_context cc ON u.id = cc.user_id
JOIN competence c ON cc.competence_id = c.id
LEFT JOIN preuve p ON cc.id = p.competence_context_id
WHERE cc.statut NOT IN ('refusee','archivee')
GROUP BY u.id, c.id, cc.contexte_nom;

-- Vue : Dernière version ROME active
CREATE VIEW v_rome_actif AS
SELECT * FROM rome_fiche
WHERE import_id = (SELECT id FROM rome_import WHERE actif = 1 ORDER BY date_import DESC LIMIT 1);
