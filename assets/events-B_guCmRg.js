import{a as e,n as t,u as n}from"./index-DjJqxjmZ.js";import{getDb as r}from"./db-DiPZrIpr.js";import{sendOne as i}from"./email-BlQrtI5E.js";var a=e(),o=n(t(),1),s=[{name:`Early Bird`,price:0,until:``},{name:`Normal`,price:0,until:``},{name:`Rush`,price:0,until:``}],c={received:{subject:`Registration received — {{event}}`,body:`Dear {{name}},

Thank you for registering for {{event}} on {{date}} at {{venue}}.

We have received your payment details ({{tier}}, ₹{{amount}}, transaction reference {{txn}}). Your confirmation email will reach you within 24 hours, after your payment has been verified.

Your registration reference is {{ref}}.

With regards,
Centre of Excellence on Plant Cell Fermentation Technology`},confirmed:{subject:`You're registered — {{event}}`,body:`Dear {{name}},

Your registration for {{event}} is confirmed.

Date: {{date}}
Venue: {{venue}}
Registration: {{tier}}

Please bring the QR code below (on your phone or printed). It is your entry pass.

We look forward to seeing you.

With regards,
Centre of Excellence on Plant Cell Fermentation Technology`},rejected:{subject:`About your registration — {{event}}`,body:`Dear {{name}},

We could not verify the payment for your registration to {{event}} (transaction reference {{txn}}).

Please check the reference and register again, or reply to this email with your payment details so that we can help.

With regards,
Centre of Excellence on Plant Cell Fermentation Technology`}},l=()=>new Date(Date.now()+198e5).toISOString().slice(0,10),u=e=>{try{return JSON.parse(e.tiers)}catch{return[]}},d=e=>{try{return{...c,...JSON.parse(e.emails)}}catch{return c}};function f(e){let t=u(e).filter(e=>e.price>0);if(!e.paid||!t.length)return null;let n=l();return t.find(e=>!e.until||e.until>=n)??null}var p=e=>r().prepare(`SELECT * FROM events WHERE slug = ?`).get(e),m=e=>r().prepare(`SELECT * FROM events WHERE id = ?`).get(e);function h(e){return r().prepare(`SELECT COUNT(*) n FROM registrations WHERE event_id = ? AND status IN ('Pending','Confirmed')`).get(e).n}var g=(e,t)=>e.replace(/\{\{\s*(\w+)\s*\}\}/g,(e,n)=>t[n]??``);function _(e,t){return{name:t.name,event:e.title,date:e.date_text,venue:e.venue,tier:t.tier,amount:String(t.amount),txn:t.txn_ref??``,ref:t.ref}}async function v(e,t,n,r){let a=d(t)[e],s=_(t,n),c=e===`confirmed`?{png:await o.default.toBuffer(`PCFE:${n.entry_token}`,{width:440,margin:1}),ref:n.ref}:void 0;return i({kind:`event`,to:n.email,subject:g(a.subject,s),body:g(a.body,s),by:r,...c?{qr:c}:{}})}var y=e=>`E${e}-${(0,a.randomBytes)(3).toString(`hex`).toUpperCase()}`,b=()=>(0,a.randomBytes)(18).toString(`base64url`),x=e=>r().prepare(`SELECT * FROM registrations WHERE id = ?`).get(e);export{c as DEFAULT_EMAILS,s as DEFAULT_TIERS,f as currentTier,d as emailsOf,m as eventById,p as eventBySlug,y as newRef,b as newToken,x as regById,h as seatsTaken,v as sendEventMail,u as tiersOf};