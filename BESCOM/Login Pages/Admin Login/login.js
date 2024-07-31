import React from 'react';
import './style.css'; // Assuming you have the CSS styles in a file named style.css

function LoginPage() {
  return (
    <div>
      <nav style={{ margin: '50px' }}>
        Return to
        <a href="../../Home Page/index.html">Home</a>
      </nav>

      <div className="container" id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fab fa-github"></i></a>
              <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form>
            <h1>Admin Login</h1>
            <span>Enter your details</span>
            <input type="text" placeholder="Admin Id" />
            <input type="password" placeholder="Password" />
            <button>Sign In</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" id="login">Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <img src="bulb.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
