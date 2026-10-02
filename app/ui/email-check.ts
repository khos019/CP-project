/* What can be known about an address before a confirmation email is sent to it.
 *
 * A signup to an address that does not exist costs more than one lost learner:
 * the confirmation bounces, and Supabase restricts sending for the whole
 * project once enough of them do (it warned about exactly that on 2026-10-02,
 * with eight email signups in total — two bounces is already a high rate).
 *
 * Nothing here can prove a mailbox exists. It catches the two things that can
 * be seen from the text alone: a provider's name typed wrong, and a throwaway
 * inbox that will be gone before the learner comes back. Signup only — an
 * account that already exists must still be able to sign in and reset.
 */

/* Misspelt → meant. Only domains that are not real mail providers themselves,
   so nobody with a genuine address is told they mistyped it. */
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmal.com": "gmail.com",
  "gamil.com": "gmail.com", "gnail.com": "gmail.com", "gmaill.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com", "gmail.comm": "gmail.com", "gmail.cmo": "gmail.com",
  "gmail.ocm": "gmail.com", "gmail.vom": "gmail.com", "gmail.xom": "gmail.com",
  "gmail.ru": "gmail.com", "gmail.uz": "gmail.com", "gmail.net": "gmail.com",
  "gmeil.com": "gmail.com", "gimail.com": "gmail.com", "gmali.com": "gmail.com",
  "mail.r": "mail.ru", "mail.ri": "mail.ru", "mial.ru": "mail.ru", "maiil.ru": "mail.ru",
  "yandex.r": "yandex.ru", "yandex.ry": "yandex.ru", "yandx.ru": "yandex.ru", "yadex.ru": "yandex.ru",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com", "yhoo.com": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com", "outloo.com": "outlook.com", "outlook.con": "outlook.com",
  "iclod.com": "icloud.com", "icloud.con": "icloud.com", "icoud.com": "icloud.com",
};

/* Throwaway inboxes. Not exhaustive and not meant to be — a new one appears
   every week. These are the common ones plus the two already seen here. */
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com",
  "10minutemail.com", "10minutemail.net", "temp-mail.org", "tempmail.com",
  "tempmail.net", "tempmailo.com", "tempmail.plus", "temp-mail.io", "tmpmail.org",
  "tmpmail.net", "yopmail.com", "yopmail.net", "throwawaymail.com", "trashmail.com",
  "getnada.com", "nada.email", "dispostable.com", "maildrop.cc", "mailnesia.com",
  "fakeinbox.com", "mintemail.com", "emailondeck.com", "mohmal.com", "moakt.com",
  "dropmail.me", "minuteinbox.com", "tempinbox.com", "burnermail.io", "spamgourmet.com",
  "mytemp.email", "tempr.email", "discard.email", "mailcatch.com", "inboxkitten.com",
  "1secmail.com", "1secmail.net", "1secmail.org", "pumpoly.com", "fanzher.com",
]);

export type EmailProblem =
  | { kind: "typo"; suggestion: string }
  | { kind: "disposable" }
  | { kind: "gmail" };

export function emailProblem(address: string): EmailProblem | null {
  const at = address.lastIndexOf("@");
  if (at < 1) return null;
  const local = address.slice(0, at);
  const domain = address.slice(at + 1).toLowerCase();

  const meant = TYPOS[domain];
  if (meant) return { kind: "typo", suggestion: `${local}@${meant}` };
  if (DISPOSABLE.has(domain)) return { kind: "disposable" };

  /* Gmail's own rule for a username: 6–30 letters, digits and dots, no dot at
     either end or twice in a row. Anything else was never a Gmail account.
     A +tag is the same mailbox, so it is not counted. */
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const name = local.split("+")[0];
    if (!/^[a-z0-9.]{6,30}$/i.test(name) || /^\.|\.$|\.\./.test(name)) return { kind: "gmail" };
  }
  return null;
}
