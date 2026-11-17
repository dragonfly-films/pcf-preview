const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./mailing-LbbTZ1jc.js","./index-CE7H2mqP.js","./styles-DXdjcURD.css","./sanitize-html-Boatus3L.js","./email-B-MK7kcb.js"])))=>i.map(i=>d[i]);
import{a as e,t}from"./index-CE7H2mqP.js";var n=e(((e,t)=>{t.exports={}})),r=n(),i={"/#join":{label:`Join the PCF Network`,lists:[`pcf-network`],marketing:`always`},"/programmes/phytothon#register":{label:`Phytothon EOI`,lists:[`phytothon-applicants`]},"/programmes/global-network#join-network":{label:`Global University Innovation Network`,lists:[`network-partners`]},"/collaborate#enquire":{label:`Collaborate with Us`,lists:[`industry-enquiries`,`industry-contacts`]},"/collaborate/feasibility#review":{label:`Feasibility Check`,lists:[`feasibility-leads`,`industry-contacts`]},"/collaborate/services#quote":{label:`Services quote`,lists:[`service-quotes`,`industry-contacts`]},"/collaborate/technology-transfer#license":{label:`Technology Transfer`,lists:[`licensing-enquiries`,`industry-contacts`]},"/collaborate/challenges#post-challenge":{label:`Post a challenge`,lists:[`challenge-posters`]},"/opportunities#interest":{label:`Opportunities`,lists:[`talent-pool`]},"/events/pcf-talks#register":{label:`PCF Talks`,lists:[`pcf-talks`]},"/blog#write":{label:`Write for us`,lists:[`blog-contributors`]},"/contact#contact":{label:`Contact`,lists:[],marketing:`if-join`}},a=[{key:`pcf-network`,name:`PCF Network — members`,kind:`Members`,source:`Join form (Home)`},{key:`phytothon-applicants`,name:`Phytothon applicants`,kind:`Applicants`,source:`Phytothon EOI form`},{key:`network-partners`,name:`Global Network partners`,kind:`Contacts`,source:`Global Network form`},{key:`industry-enquiries`,name:`Industry enquiries`,kind:`Contacts`,source:`Collaborate with Us form`},{key:`feasibility-leads`,name:`Feasibility leads`,kind:`Contacts`,source:`Feasibility Check`},{key:`service-quotes`,name:`Service quote requests`,kind:`Contacts`,source:`Services form`},{key:`licensing-enquiries`,name:`Licensing enquiries`,kind:`Contacts`,source:`Technology Transfer form`},{key:`industry-contacts`,name:`Industry contacts (all)`,kind:`Contacts`,source:`All four industry forms + imports`},{key:`challenge-posters`,name:`Challenge posters`,kind:`Contacts`,source:`Challenge Board form`},{key:`talent-pool`,name:`Talent pool (hiring only)`,kind:`Applicants`,source:`Opportunities form`,hiringOnly:!0},{key:`pcf-talks`,name:`PCF Talks registrants`,kind:`Registrants`,source:`PCF Talks form`},{key:`blog-contributors`,name:`Blog contributors`,kind:`Contacts`,source:`Write for us form`}],o=null;function s(){if(o)return o;let e={}.PCF_DATA_DIR??(0,r.join)(process.cwd(),`data`);(0,r.mkdirSync)(e,{recursive:!0}),o=new r.DatabaseSync((0,r.join)(e,`pcf.db`)),o.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
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
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, subject TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '',
      list_key TEXT, status TEXT NOT NULL DEFAULT 'Draft', created_by INTEGER,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')), sent_by INTEGER, sent_at TEXT,
      recipients INTEGER, delivered INTEGER, failed INTEGER, from_addr TEXT, reply_to TEXT, ip TEXT);
    -- A sent campaign is a permanent record: it can't be changed or deleted.
    CREATE TRIGGER IF NOT EXISTS campaign_sent_locked BEFORE UPDATE ON campaigns WHEN OLD.status = 'Sent'
      BEGIN SELECT RAISE(ABORT, 'sent campaigns are read-only'); END;
    CREATE TRIGGER IF NOT EXISTS campaign_no_delete BEFORE DELETE ON campaigns WHEN OLD.status <> 'Draft'
      BEGIN SELECT RAISE(ABORT, 'only drafts can be deleted'); END;
    -- Every email the system sends, one row per recipient. Add-only, like the audit log.
    CREATE TABLE IF NOT EXISTS send_log (
      id INTEGER PRIMARY KEY, kind TEXT NOT NULL, campaign_id INTEGER, submission_id INTEGER, to_email TEXT NOT NULL,
      subject TEXT, status TEXT NOT NULL, error TEXT, by_user INTEGER, at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE INDEX IF NOT EXISTS idx_send_campaign ON send_log(campaign_id);
    CREATE TRIGGER IF NOT EXISTS send_log_no_update BEFORE UPDATE ON send_log BEGIN SELECT RAISE(ABORT, 'send log is read-only'); END;
    CREATE TRIGGER IF NOT EXISTS send_log_no_delete BEFORE DELETE ON send_log BEGIN SELECT RAISE(ABORT, 'send log is read-only'); END;
    CREATE TABLE IF NOT EXISTS member_codes (
      email TEXT PRIMARY KEY, code_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, tries INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS member_sessions (
      token_hash TEXT PRIMARY KEY, contact_id INTEGER NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS member_logins (
      id INTEGER PRIMARY KEY, contact_id INTEGER NOT NULL, ip TEXT, at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS member_views (
      id INTEGER PRIMARY KEY, contact_id INTEGER NOT NULL, path TEXT NOT NULL, at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE INDEX IF NOT EXISTS idx_member_views_at ON member_views(at);
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, date_text TEXT NOT NULL DEFAULT '',
      event_date TEXT, venue TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '',
      open INTEGER NOT NULL DEFAULT 0, paid INTEGER NOT NULL DEFAULT 0, tiers TEXT NOT NULL DEFAULT '[]',
      upi_id TEXT NOT NULL DEFAULT '', upi_name TEXT NOT NULL DEFAULT '', capacity INTEGER NOT NULL DEFAULT 0,
      emails TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY, event_id INTEGER NOT NULL REFERENCES events(id), ref TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, organisation TEXT, designation TEXT, category TEXT, city TEXT,
      tier TEXT NOT NULL DEFAULT 'Free', amount INTEGER NOT NULL DEFAULT 0, txn_ref TEXT,
      status TEXT NOT NULL DEFAULT 'Pending', free_reason TEXT, code_id INTEGER, entry_token TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')), decided_at TEXT, decided_by INTEGER, note TEXT,
      checked_in_at TEXT, checked_in_by INTEGER);
    CREATE INDEX IF NOT EXISTS idx_reg_event ON registrations(event_id);
    CREATE TABLE IF NOT EXISTS comp_codes (
      id INTEGER PRIMARY KEY, event_id INTEGER NOT NULL REFERENCES events(id), code TEXT NOT NULL, label TEXT NOT NULL DEFAULT '',
      max_uses INTEGER NOT NULL DEFAULT 1, used INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1,
      created_by INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(event_id, code));
    -- Every scan at the door, add-only.
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY, event_id INTEGER, registration_id INTEGER, result TEXT NOT NULL, detail TEXT,
      by_user INTEGER, at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TRIGGER IF NOT EXISTS checkins_no_update BEFORE UPDATE ON checkins BEGIN SELECT RAISE(ABORT, 'scan log is read-only'); END;
    CREATE TRIGGER IF NOT EXISTS checkins_no_delete BEFORE DELETE ON checkins BEGIN SELECT RAISE(ABORT, 'scan log is read-only'); END;
    CREATE TABLE IF NOT EXISTS invites (
      token_hash TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL,
      expires_at INTEGER NOT NULL, created_by INTEGER, used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS game_events (
      id INTEGER PRIMARY KEY, ts INTEGER NOT NULL, game TEXT NOT NULL, type TEXT NOT NULL, play TEXT NOT NULL,
      stars INTEGER, score INTEGER, rank TEXT, outcome TEXT, product INTEGER, day TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_game_ts ON game_events(ts);
    -- One rating per play, so a visitor can't stuff the box.
    CREATE UNIQUE INDEX IF NOT EXISTS idx_game_rating_once ON game_events(play) WHERE type = 'rating';
    CREATE TABLE IF NOT EXISTS pageviews (
      id INTEGER PRIMARY KEY, ts INTEGER NOT NULL, day TEXT NOT NULL, path TEXT NOT NULL,
      source TEXT NOT NULL, ref_host TEXT, visitor TEXT NOT NULL, session TEXT NOT NULL,
      device TEXT, duration_ms INTEGER);
    CREATE INDEX IF NOT EXISTS idx_pv_ts ON pageviews(ts);
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_by TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')));
  `);let n=o.prepare(`INSERT OR IGNORE INTO lists (key, name, kind, source, hiring_only) VALUES (?, ?, ?, ?, ?)`);for(let e of a)n.run(e.key,e.name,e.kind,e.source,+!!e.hiringOnly);return o.prepare(`PRAGMA table_info(events)`).all().some(e=>e.name===`list_key`)||o.exec(`ALTER TABLE events ADD COLUMN list_key TEXT`),setTimeout(()=>void t(()=>import(`./mailing-LbbTZ1jc.js`).then(e=>e.startScheduler()),__vite__mapDeps([0,1,2,3,4]),import.meta.url).catch(()=>void 0),3e3),o}var c=()=>({}).PCF_DATA_DIR??(0,r.join)(process.cwd(),`data`);function l(e,t,n=``){s().prepare(`INSERT INTO audit (user_id, action, detail) VALUES (?, ?, ?)`).run(e,t,n)}export{l as audit,c as dataDir,s as getDb,a as n,n as r,i as t};