import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Layout(props) {
  const [isReadyForInstall, setIsReadyForInstall] = React.useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {

      event.preventDefault();
      console.log("👍", "beforeinstallprompt", event);

      window.deferredPrompt = event;
 
      setIsReadyForInstall(true);
    });
  }, []);

  async function downloadApp() {
    console.log("👍", "butInstall-clicked");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {

      console.log("oops, no prompt event guardado en window");
      return;
    }
 
    promptEvent.prompt();
 
    const result = await promptEvent.userChoice;
    console.log("👍", "userChoice", result);
   
    window.deferredPrompt = null;

    setIsReadyForInstall(false);
  }

  return (
    <div className="App">
      <header>
        <h1> PWA</h1>
        {isReadyForInstall && (
          <button onClick={downloadApp}> Descargar PWA </button>
        )}
      </header>

      {props.children}
    </div>
  );
}
