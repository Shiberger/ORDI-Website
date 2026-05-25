// ORDI App entry — router

function ScreenRouter() {
  const { screen, transitionKey } = useApp();
  const { name, params } = screen;

  let El = null;
  switch (name) {
    case "home": El = <HomeScreen/>; break;
    case "shop": El = <ShopScreen/>; break;
    case "product": El = <ProductScreen id={params.id}/>; break;
    case "cart": El = <CartScreen/>; break;
    case "checkout": El = <CheckoutScreen/>; break;
    case "about": El = <AboutScreen/>; break;
    case "journal": El = <JournalScreen/>; break;
    case "account": El = <AccountScreen/>; break;
    case "membership": El = <MembershipScreen/>; break;
    default: El = <HomeScreen/>;
  }

  return (
    <div className="ordi-transition" key={transitionKey} data-screen-label={`Screen · ${name}`}>
      {El}
    </div>
  );
}

function ORDIApp() {
  const { lang, setLang } = useApp();

  // Tweaks panel wiring
  const tweakDefaults = /*EDITMODE-BEGIN*/{
    "language": "en",
    "density": "comfortable",
    "showOrigin": true,
    "texture": "subtle"
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = window.useTweaks(tweakDefaults);

  React.useEffect(() => {
    if (tweaks.language !== lang) setLang(tweaks.language);
  }, [tweaks.language]);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-density", tweaks.density);
    document.documentElement.setAttribute("data-show-origin", String(tweaks.showOrigin));
    document.documentElement.setAttribute("data-texture", tweaks.texture);
  }, [tweaks.density, tweaks.showOrigin, tweaks.texture]);

  return (
    <React.Fragment>
      <Nav/>
      <ScreenRouter/>
      <Footer/>
      <CartDrawer/>
      <window.TweaksPanel title="ORDI · Tweaks">
        <window.TweakSection label="Language"/>
        <window.TweakRadio
          label="Display"
          value={tweaks.language}
          onChange={v => setTweak("language", v)}
          options={[
            { value: "en", label: "EN" },
            { value: "th", label: "ไทย" }
          ]}
        />
        <window.TweakSection label="Layout"/>
        <window.TweakRadio
          label="Density"
          value={tweaks.density}
          onChange={v => setTweak("density", v)}
          options={[
            { value: "airy", label: "Airy" },
            { value: "comfortable", label: "Default" },
            { value: "compact", label: "Compact" }
          ]}
        />
        <window.TweakToggle
          label="Show origin tags"
          value={tweaks.showOrigin}
          onChange={v => setTweak("showOrigin", v)}
        />
        <window.TweakSection label="Texture"/>
        <window.TweakRadio
          label="Halftone"
          value={tweaks.texture}
          onChange={v => setTweak("texture", v)}
          options={[
            { value: "off", label: "Off" },
            { value: "subtle", label: "Subtle" },
            { value: "poster", label: "Poster" }
          ]}
        />
      </window.TweaksPanel>
    </React.Fragment>
  );
}

function Root() {
  return (
    <AppProvider>
      <ORDIApp/>
    </AppProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root/>);
