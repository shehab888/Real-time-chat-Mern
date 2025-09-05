import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function Header() {
  return (
    <header className="header">
      <div>
        <Link to={"/"} style={{ color: "white", fontSize: "18px" }}>
          <strong>SweetTalk</strong>
        </Link>
      </div>
      <nav>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>
    </header>
  );
}

export default Header;
