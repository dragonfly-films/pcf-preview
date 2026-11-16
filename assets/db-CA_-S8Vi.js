import{r as e}from"./index-CLbfQ47Y.js";var t=e(),n={"/#join":{label:`Join the PCF Network`,lists:[`pcf-network`],marketing:`always`},"/programmes/phytothon#register":{label:`Phytothon EOI`,lists:[`phytothon-applicants`]},"/programmes/global-network#join-network":{label:`Global University Innovation Network`,lists:[`network-partners`]},"/collaborate#enquire":{label:`Collaborate with Us`,lists:[`industry-enquiries`,`industry-contacts`]},"/collaborate/feasibility#review":{label:`Feasibility Check`,lists:[`feasibility-leads`,`industry-contacts`]},"/collaborate/services#quote":{label:`Services quote`,lists:[`service-quotes`,`industry-contacts`]},"/collaborate/technology-transfer#license":{label:`Technology Transfer`,lists:[`licensing-enquiries`,`industry-contacts`]},"/collaborate/challenges#post-challenge":{label:`Post a challenge`,lists:[`challenge-posters`]},"/opportunities#interest":{label:`Opportunities`,lists:[`talent-pool`]},"/events/pcf-talks#register":{label:`PCF Talks`,lists:[`pcf-talks`]},"/blog#write":{label:`Write for us`,lists:[`blog-contributors`]},"/contact#contact":{label:`Contact`,lists:[],marketing:`if-join`}},r=[{key:`pcf-network`,name:`PCF Network — members`,kind:`Members`,source:`Join form (Home)`},{key:`phytothon-applicants`,name:`Phytothon applicants`,kind:`Applicants`,source:`Phytothon EOI form`},{key:`network-partners`,name:`Global Network partners`,kind:`Contacts`,source:`Global Network form`},{key:`industry-enquiries`,name:`Industry enquiries`,kind:`Contacts`,source:`Collaborate with Us form`},{key:`feasibility-leads`,name:`Feasibility leads`,kind:`Contacts`,source:`Feasibility Check`},{key:`service-quotes`,name:`Service quote requests`,kind:`Contacts`,source:`Services form`},{key:`licensing-enquiries`,name:`Licensing enquiries`,kind:`Contacts`,source:`Technology Transfer form`},{key:`industry-contacts`,name:`Industry contacts (all)`,kind:`Contacts`,source:`All four industry forms + imports`},{key:`challenge-posters`,name:`Challenge posters`,kind:`Contacts`,source:`Challenge Board form`},{key:`talent-pool`,name:`Talent pool (hiring only)`,kind:`Applicants`,source:`Opportunities form`,hiringOnly:!0},{key:`pcf-talks`,name:`PCF Talks registrants`,kind:`Registrants`,source:`PCF Talks form`},{key:`blog-contributors`,name:`Blog contributors`,kind:`Contacts`,source:`Write for us form`},{key:`professors`,name:`Professors & faculty`,kind:`Contacts`,source:`CSV import`}],i=null;function a(){if(i)return i;let e={}.PCF_DATA_DIR??(0,t.join)(process.cwd(),`data`);(0,t.mkdirSync)(e,{recursive:!0}),i=new t.DatabaseSync((0,t.join)(e,`pcf.db`)),i.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      pass_hash TEXT NOT NULL, totp_secret TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'Owner',
      created_at TEXT NOT NULL DEFAULT (datetime('now')), last_login TEXT);
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL, ip TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY, form_key TEXT NOT NULL, form_label TEXT NOT NULL, page TEXT,
      name TEXT, email TEXT, phone TEXT, organisation TEXT, topic TEXT, message TEXT, data TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New', owner TEXT, notes TEXT, ip TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, salutation TEXT, organisation TEXT,
      phone TEXT, category TEXT, marketing_consent INTEGER NOT NULL DEFAULT 0, consent_at TEXT, consent_source TEXT,
      unsubscribed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY, key TEXT NOT NULL UNIQUE, name TEXT NOT NULL, kind TEXT NOT NULL,
      source TEXT, hiring_only INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS list_members (
      list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
      contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
      source TEXT, added_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (list_id, contact_id));
    CREATE TABLE IF NOT EXISTS audit (
      id INTEGER PRIMARY KEY, user_id INTEGER, action TEXT NOT NULL, detail TEXT,
      at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE INDEX IF NOT EXISTS idx_sub_created ON submissions(created_at);
    -- The audit log can only be added to: the database refuses edits and deletions.
    CREATE TRIGGER IF NOT EXISTS audit_no_update BEFORE UPDATE ON audit BEGIN SELECT RAISE(ABORT, 'audit log is read-only'); END;
    CREATE TRIGGER IF NOT EXISTS audit_no_delete BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT, 'audit log is read-only'); END;
    CREATE TABLE IF NOT EXISTS invites (
      token_hash TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL,
      expires_at INTEGER NOT NULL, created_by INTEGER, used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS pageviews (
      id INTEGER PRIMARY KEY, ts INTEGER NOT NULL, day TEXT NOT NULL, path TEXT NOT NULL,
      source TEXT NOT NULL, ref_host TEXT, visitor TEXT NOT NULL, session TEXT NOT NULL,
      device TEXT, duration_ms INTEGER);
    CREATE INDEX IF NOT EXISTS idx_pv_ts ON pageviews(ts);
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_by TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')));
  `);let n=i.prepare(`INSERT OR IGNORE INTO lists (key, name, kind, source, hiring_only) VALUES (?, ?, ?, ?, ?)`);for(let e of r)n.run(e.key,e.name,e.kind,e.source,+!!e.hiringOnly);return i}var o=()=>({}).PCF_DATA_DIR??(0,t.join)(process.cwd(),`data`);function s(e,t,n=``){a().prepare(`INSERT INTO audit (user_id, action, detail) VALUES (?, ?, ?)`).run(e,t,n)}export{n as i,o as n,a as r,s as t};