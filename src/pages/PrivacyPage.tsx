export default function PrivacyPage() {
  return (
    <div className="public-page">
      <h1>Privacy</h1>
      <p>
        This page explains, in plain English, exactly what data we store, where
        it goes, and what we can and can't see. No legalese.
      </p>

      <h2>What we store</h2>
      <p>
        Our server stores your account (a pseudonym, a hashed password, and a
        hashed email), couple pairing metadata (which two accounts are
        connected), and your shared document — as an encrypted blob we cannot
        read.
      </p>
      <p>
        That's it. We don't store your conversations on the server. Ever.
      </p>

      <h2>Where your conversations live</h2>
      <p>
        Your conversation history is stored in your browser's local storage
        (IndexedDB), encrypted with a key derived from the passphrase you and
        your partner agreed on. It never leaves your device in stored form.
      </p>
      <p>
        During an active chat session, your conversation is sent to the AI model
        for processing — but it transits through our server only to reach the
        AI. We don't log or persist it.
      </p>

      <h2>How encryption works</h2>
      <p>
        When you and your partner set up, you agree on a shared passphrase
        (outside the app — in person, by text, however you like). This
        passphrase is used to generate an encryption key using PBKDF2 with
        100,000 iterations. The passphrase is never sent to or stored on our
        server.
      </p>
      <p>
        Both your local conversation history and your shared document are
        encrypted with AES-256-GCM using this key. In practical terms: your
        conversations are encrypted on your device with your passphrase — we
        can't read them even if we wanted to.
      </p>

      <h2>What the server operator can see</h2>
      <p>
        If someone with database access looked at the data, they would see:
        pseudonyms, hashed emails, encrypted blobs (shared documents), and
        timestamps. They could not read any personal content. The encryption
        keys exist only in your browser's memory while you're using the app.
      </p>

      <h2>The AI model</h2>
      <p>
        This app uses Claude by Anthropic. Your conversations are sent to the
        Anthropic API for processing. Anthropic does not use API data for model
        training. Inputs and outputs are automatically deleted from Anthropic's
        servers within 30 days.
      </p>

      <h2>Data deletion</h2>
      <p>
        You can delete your conversation history (local), your shared document
        (server), or your entire account at any time from the Account page. No
        soft deletes — delete means delete. If both partners delete their
        accounts, the couple record is also removed.
      </p>
      <p>
        If you forget your shared passphrase, your encrypted data (conversations
        and shared document) is unrecoverable. This is by design — there's no
        backdoor.
      </p>

      <h2>What we don't do</h2>
      <ul>
        <li>No analytics or tracking scripts</li>
        <li>No advertising</li>
        <li>No selling or sharing data with third parties</li>
        <li>No logging of conversation content</li>
        <li>No cookies beyond what's needed for authentication</li>
      </ul>
    </div>
  );
}
