import{l as e,r as t}from"./index-BDL4MAxI.js";import{getDb as n,r}from"./db-DwtQ98qD.js";import{sendOne as i}from"./email-BsMuO19T.js";var a=r(),o=e(t(),1),s=e=>e.format===`online`,c=e=>e.format===`online`||e.format===`hybrid`,l=[{name:`Early Bird`,price:0,until:``},{name:`Normal`,price:0,until:``},{name:`Rush`,price:0,until:``}],u={received:{subject:`Registration received — {{event}}`,body:`Dear {{name}},

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
Centre of Excellence on Plant Cell Fermentation Technology`}},d=`Dear {{name}},

Your registration for {{event}} is confirmed.

Date and time: {{date}}
Registration: {{tier}}

Join the webinar here: {{link}}

This link is for you only — please don't share it.

We look forward to seeing you online.

With regards,
Centre of Excellence on Plant Cell Fermentation Technology`,f=()=>new Date(Date.now()+198e5).toISOString().slice(0,10),p=e=>{try{return JSON.parse(e.tiers)}catch{return[]}},m=e=>{try{return{...u,...JSON.parse(e.emails)}}catch{return u}};function h(e){let t=p(e).filter(e=>e.price>0);if(!e.paid||!t.length)return null;let n=f();return t.find(e=>!e.until||e.until>=n)??null}var g=e=>n().prepare(`SELECT * FROM events WHERE slug = ?`).get(e),_=e=>n().prepare(`SELECT * FROM events WHERE id = ?`).get(e);function v(e){return n().prepare(`SELECT COUNT(*) n FROM registrations WHERE event_id = ? AND status IN ('Pending','Confirmed')`).get(e).n}var y=(e,t)=>e.replace(/\{\{\s*(\w+)\s*\}\}/g,(e,n)=>t[n]??``);function b(e,t){return{name:t.name,event:e.title,date:e.date_text,venue:s(e)?`Online`:e.venue,tier:t.tier,amount:String(t.amount),txn:t.txn_ref??``,ref:t.ref,link:e.join_link??``}}async function x(e,t,n,r){let a={...m(t)[e]};e===`confirmed`&&s(t)&&a.body===u.confirmed.body&&(a.body=d),e===`confirmed`&&c(t)&&t.join_link&&!/\{\{\s*link\s*\}\}/.test(a.body)&&(a.body+=`

Join online: {{link}}`);let l=b(t,n),f=e===`confirmed`&&!s(t)?{png:await o.default.toBuffer(`PCFE:${n.entry_token}`,{width:440,margin:1}),ref:n.ref}:void 0;return i({kind:`event`,to:n.email,subject:y(a.subject,l),body:y(a.body,l),by:r,...f?{qr:f}:{}})}async function S(e,t,n,r,a){let o=0,s=0;for(let c of t){let t=b(e,c);(await i({kind:`event`,to:c.email,subject:y(n,t),body:y(r,t),by:a})).ok?o++:s++,await new Promise(e=>setTimeout(e,300))}return{ok:o,bad:s}}var C=e=>`E${e}-${(0,a.randomBytes)(3).toString(`hex`).toUpperCase()}`,w=()=>(0,a.randomBytes)(18).toString(`base64url`),T=e=>n().prepare(`SELECT * FROM registrations WHERE id = ?`).get(e);export{u as DEFAULT_EMAILS,l as DEFAULT_TIERS,d as ONLINE_CONFIRMED_BODY,h as currentTier,m as emailsOf,_ as eventById,g as eventBySlug,c as hasLink,s as isOnline,S as messageRegistrants,C as newRef,w as newToken,T as regById,v as seatsTaken,x as sendEventMail,p as tiersOf};