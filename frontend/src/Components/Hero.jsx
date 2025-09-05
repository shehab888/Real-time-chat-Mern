import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>Chat that feels instant and personal</h1>
        <p>
          Build communities, collaborate with teammates, or just keep in touch
          with friends—all in one beautifully simple place.
        </p>
        <div className="buttons">
          <Link to={"/chat"} className="btn btn-primary">
            Start chatting
          </Link>
          <Link to={"/Login"} className="btn btn-outline">
            Create account
          </Link>
        </div>
      </div>
      <div className="phone">
        <div className="chat-header">Design Crew</div>
        <div className="messages">
          <div className="bubble other">
            Hey team! Pushing the new landing page in 10 mins.
          </div>
          <div className="bubble you">Nice! I can QA the forms.</div>
          <div className="bubble other">I'll prep the release notes.</div>
          <div className="bubble you">
            Legend. Also added dark mode toggles 🌙
          </div>
          <div className="bubble other">Chef's kiss.</div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
