function Hero() {
  return (
    <section class="hero">
      <div>
        <h1>Chat that feels instant and personal</h1>
        <p>
          Build communities, collaborate with teammates, or just keep in touch
          with friends—all in one beautifully simple place.
        </p>
        <div class="buttons">
          <button class="btn btn-primary">Start chatting</button>
          <button class="btn btn-outline">Download app</button>
        </div>
      </div>
      <div class="phone">
        <div class="chat-header">Design Crew</div>
        <div class="messages">
          <div class="bubble other">
            Hey team! Pushing the new landing page in 10 mins.
          </div>
          <div class="bubble you">Nice! I can QA the forms.</div>
          <div class="bubble other">I'll prep the release notes.</div>
          <div class="bubble you">Legend. Also added dark mode toggles 🌙</div>
          <div class="bubble other">Chef's kiss.</div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
