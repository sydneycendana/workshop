import React from "react";
import { useModal } from "../../context/Modal";
import "../WelcomeModal/WelcomeModal.css";
import portfolio from "../../assets/portfolio.png";

function WelcomeModal() {
  const { closeModal } = useModal();
  const handleTakeMeToApp = () => {
    closeModal();
  };
  return (
    <div className="welcome-modal-container">
      <div className="welcome-modal-text-wrapper">
        <h1>Welcome to Workshop!</h1>
        <p>
          This application was born out of a personal challenge I encountered
          when I moved to a new city and started remote work. The task of
          finding suitable work and study spaces efficiently proved to be pretty
          difficult. I tried various options, and although Yelp provided some
          help, it wasn't customized to cater specifically to the need for
          conducive workspaces. Hence, I decided to develop this app to address
          this specific problem.
        </p>
        <h3>How to use:</h3>
        <p>
          Since I am based in Los Angeles, most of the data is around here.
          Search for a town you know in LA, such as "Hermosa Beach" to see some
          workshops populate.
        </p>
        <p>
          If you want to start building out workshops in an area closer to you,
          when logged in, search for a place you have been to in the top left
          corner. All you need to do is upload an image and this will create a
          new workshop.
        </p>
        <p>
          From there, feel free to create reviews, add images, upvote or
          downvote other reviews, etc! Please not that you can only edit or
          delete a workshop from the Demo User (admin) login.
        </p>
        <h3>Connect with me!</h3>
        <p>
          If you enjoyed this, please follow me on socials and check out my
          portfolio for other fun projects!{" "}
        </p>
        <div className="personal-links">
          <div className="social-icons">
            <a href="https://github.com/sydneycendana" target="_blank">
              <svg
                className="navbar-icon"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                height="32"
                viewBox="0 0 16 16"
                version="1.1"
                width="32"
                data-view-component="true"
              >
                <path
                  d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
                  fill="#808080"
                ></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/sydneycendana/"
              target="_blank"
            >
              <svg
                className="navbar-icon"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                data-supported-dps="24x24"
                fill="#808080"
                width="32"
                height="32"
                focusable="false"
              >
                <path
                  d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
                  fill="#808080"
                ></path>
              </svg>
            </a>
          </div>
          <div className="portfolio-link">
            <a href="https://www.sydneycendana.com/" target="_blank">
              <img
                className="portfolio-image"
                src={portfolio}
                alt="Portfolio"
              />
            </a>
          </div>
        </div>
        <button className="close-modal-button" onClick={handleTakeMeToApp}>
          Take me to the app!
        </button>
      </div>
    </div>
  );
}

export default WelcomeModal;
