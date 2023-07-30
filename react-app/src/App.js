import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Homepage from "./components/Homepage";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import WorkshopDetails from "./components/Workshops/WorkshopDetails";
import CreateWorkshopForm from "./components/Workshops/CreateWorkshop";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import { WorkshopProvider } from "./context/WorkshopContext";
import { ModalProvider, useModal } from "./context/Modal";
import WelcomeModal from "./components/WelcomeModal";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));

    const hasModalBeenShown = localStorage.getItem("modalShown");
    if (!hasModalBeenShown) {
      setModalContent(<WelcomeModal />);
      localStorage.setItem("modalShown", "true");
    }
  }, [dispatch, setModalContent]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <WorkshopProvider>
              <Homepage />
            </WorkshopProvider>
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path={"/workshops/:workshopId"}>
            <WorkshopDetails />
          </Route>
          <Route exact path={"/workshop"}>
            <CreateWorkshopForm />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
