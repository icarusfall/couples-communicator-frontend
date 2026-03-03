export default function EthicsPage() {
  return (
    <div className="public-page">
      <h1>Ethics</h1>
      <p>
        An AI communication tool for relationships comes with real
        responsibilities. Here's how we think about them.
      </p>

      <h2>What the bot does</h2>
      <ul>
        <li>
          Helps you articulate feelings that are hard to put into words
        </li>
        <li>
          Asks questions to help you reflect on relationship dynamics
        </li>
        <li>
          Helps you prepare what you want to share with your partner
        </li>
        <li>
          Gently challenges all-or-nothing thinking ("they never listen", "they
          always do this")
        </li>
        <li>
          Points you back toward your partner — the goal is always real
          communication, not staying in the bot conversation
        </li>
      </ul>

      <h2>What the bot doesn't do</h2>
      <ul>
        <li>Diagnose mental health conditions</li>
        <li>Provide therapy or clinical advice</li>
        <li>Tell you to stay in or leave a relationship</li>
        <li>Take sides or villainise your partner</li>
        <li>Encourage you to avoid difficult conversations in real life</li>
      </ul>

      <h2>Crisis handling</h2>
      <p>
        If you express thoughts of self-harm, suicidal ideation, or intent to
        harm others, the bot will take it seriously, respond with care, and
        provide relevant resources. It will not attempt to provide crisis
        counselling — that's beyond what an AI should do.
      </p>
      <div className="resource-box">
        <h3>Crisis resources</h3>
        <ul>
          <li>
            <strong>Samaritans:</strong> 116 123 (free, 24/7)
          </li>
          <li>
            <strong>Crisis Text Line:</strong> text SHOUT to 85258
          </li>
          <li>
            <strong>Emergency services:</strong> 999
          </li>
        </ul>
      </div>

      <h2>Domestic abuse detection</h2>
      <p>
        The bot is designed to recognise signs of coercive control and domestic
        abuse — things like monitoring behaviour, fear of a partner's reactions,
        financial control, or being told to use the app under duress.
      </p>
      <p>
        When the bot detects these patterns, it shifts away from communication
        coaching. It won't suggest you "communicate better" with an abusive
        partner or propose shared document updates. Instead, it acknowledges the
        situation and provides resources.
      </p>
      <div className="resource-box">
        <h3>Domestic abuse resources</h3>
        <ul>
          <li>
            <strong>National Domestic Abuse Helpline:</strong> 0808 2000 247
            (free, 24/7)
          </li>
          <li>
            <strong>Refuge:</strong>{" "}
            <a
              href="https://www.refuge.org.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              refuge.org.uk
            </a>
          </li>
          <li>
            <strong>Men's Advice Line:</strong> 0808 8010 327
          </li>
        </ul>
      </div>

      <h2>Anti-attachment design</h2>
      <p>
        It would be easy — and irresponsible — to build a bot that makes you
        feel understood and keeps you coming back. We've designed against that.
        The bot suggests ending sessions after 10-12 exchanges. It frames itself
        as temporary scaffolding, not a relationship. If you start to express
        attachment to the bot, it will gently redirect you toward your partner.
      </p>

      <h2>Asymmetric engagement</h2>
      <p>
        Sometimes one partner will be more engaged than the other. The bot won't
        guilt-trip you about your partner's participation or pathologise it. But
        if you've been using the app regularly with little engagement from your
        partner, the bot will be honest: this tool works best when both people
        are involved, and professional couples counselling might be worth
        considering.
      </p>

      <h2>Sexual topics</h2>
      <p>
        Sex is one of the most common sources of relationship difficulty. The bot
        will help you explore and communicate about your sex life with the same
        sensitivity it brings to any other difficult topic. The test is: "Is this
        helping the user communicate something to their partner?" If yes, it's in
        scope — regardless of how frank the content is. What the bot won't do is
        generate erotica, roleplay, or act as instruction.
      </p>
    </div>
  );
}
