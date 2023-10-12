import Globe from "react-globe.gl";
import { useEffect, useState, useMemo, useRef } from "react";
import "./App.css";
import data from "./data/ne_110m_admin_0_countries.geojson";
import * as d3 from "d3";
import map from "./images/map.jpg";
// eslint-disable-next-line
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import axios from "axios";
import "../src/styles/globe.css";
import "../src/styles/chat.css";
import arrowIcon from "./images/arrowIcon.png";
import infoIcon from "./images/infoIcon.png";
import planeIcon from "./images/planeIcon.png";
import profileIcon from "./images/profileIcon.png";
import helpIcon from "./images/helpIcon.png";
import aiIcon from "./images/aiIcon.png";
// eslint-disable-next-line
import Chat from "./components/Chat";

const World = () => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [selectedD, setSelectedD] = useState(null);
  const [wikiData, setWikiData] = useState(null); // New state to store Wikipedia data
  const [activeTab, setActiveTab] = useState("wikipedia"); // null, 'wikipedia', 'travel'
  const [tabs, setTabs] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const tabsList = [
    { icon: infoIcon, action: "wikipedia" },
    { icon: planeIcon, action: "travel" },
    { icon: profileIcon, action: "profile" }, // Modify this action based on what you need
    { icon: aiIcon, action: "ai" }, // Modify this action based on what you need
    { icon: helpIcon, action: "help" }, // Modify this action based on what you need
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch(data)
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  const getVal = (feat) =>
    feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  // eslint-disable-next-line
  const maxVal = useMemo(
    () => Math.max(...countries.features.map(getVal)),
    [countries]
  );

  const fetchWikiData = async (countryName) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`
      );
      setWikiData(response.data);
    } catch (error) {
      console.error("Failed to fetch Wikipedia data:", error);
    }
  };

  const handleCountryClick = (d) => {
    setSelectedD(d);
    const [[x0, y0], [x1, y1]] = d3.geoBounds(d);
    const x = (x0 + x1) / 2;
    const y = (y0 + y1) / 2;

    globeEl.current.pointOfView({ lat: y, lng: x, altitude: 0.8 }, 1000);
    fetchWikiData(d.properties.ADMIN);
    setTabs(true);
    setSelectedCountry(d.properties.ADMIN);
  };

  const fadeInOutTransition = {
    duration: 2,
    ease: "linear",
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.5 },
    },
  };

  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <Globe
        ref={globeEl}
        pointOfView={{
          latitude: 20,
          longitude: 0,
          altitude: 0.5,
        }}
        polygonCapTexture={map}
        globeImageUrl={map}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries.features.filter(
          (d) => d.properties.ISO_A2 !== "AQ"
        )}
        polygonAltitude={(d) => (d === hoverD ? 0.04 : 0.02)}
        polygonCapColor={(d) => {
          if (d === selectedD) return "rgba(0,0,0, 0)"; // <-- Blue for the selected country
          if (d === hoverD) return "rgba(0,0,0, 0)";
          // if (d === hoverD) return "rgba(0, 0, 255, 0.7)"; // Hover state (adjust as needed)
          return "rgba(0, 0, 0, .9)"; // Default color
        }}
        polygonSideColor={(d) => {
          if (d === selectedD) return "rgba(255,255,255, .4)";
          if (d === hoverD) return "rgba(255, 255, 255, 0.4)"; // <-- Blue for the selected country
          return "rgba(255, 255, 255, .4)"; // Default color
        }}
        polygonStrokeColor={() => "#fff"}
        polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
        GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
        Population: <i>${d.POP_EST}</i>
      `}
        onPolygonHover={setHoverD}
        polygonsTransitionDuration={50}
        onPolygonClick={(d) => {
          handleCountryClick(d);
        }}
        pointOfViewTransitionDuration={100} // Duration of the smooth zoom
      />

      <AnimatePresence>
        <motion.div
          style={{ height: tabs ? "85%" : "39px" }} // control height based on tabs state
          transition={fadeInOutTransition}
          className="popup-container"
        >
          <div className="nav-tabs">
            <button
              onClick={() => {
                setTabs(!tabs);
              }}
              className="popup-close-button"
            >
              <motion.img
                src={arrowIcon}
                alt="arrow"
                className="arrow"
                initial={{ rotate: 0 }}
                animate={{ rotate: tabs ? 180 : 0 }}
                exit={{ rotate: 0 }}
              />
            </button>
            {tabsList.map((tab, index) => (
              <li
                key={tab.action}
                onClick={() => {
                  setActiveTab(tab.action);
                  setSelectedIndex(index);
                }}
              >
                <img
                  src={tab.icon}
                  alt={tab.action}
                  style={{ filter: "invert(1)", width: "30px" }}
                />
                {index === selectedIndex ? (
                  <motion.div className="underline" layoutId="underline" />
                ) : null}
              </li>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "wikipedia" && wikiData && (
              <motion.div
                key={`wiki-${selectedD?.properties?.ADMIN}`} // Key added here
                className="wikipedia-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
              >
                <motion.h2
                  variants={contentVariants}
                  style={{ marginTop: 0 }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={selectedD?.properties?.ADMIN}
                >
                  {selectedD?.properties?.ADMIN || "No Country Selected"}
                </motion.h2>
                <img
                  src={wikiData.thumbnail.source}
                  alt={`${selectedD.properties.ADMIN} thumbnail`}
                />
                <p>{wikiData.extract}</p>
                <p>Population: {selectedD.properties.POP_EST}</p>
              </motion.div>
            )}

            {activeTab === "travel" && (
              <motion.div
                key={`travel-${selectedD?.properties?.ADMIN}`} // Key added here
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="travel-container"
              >
                <h2>Travel</h2>
                <button>Add Notes</button>
                <button>Add Photos</button>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key={`profile-${selectedD?.properties?.ADMIN}`} // Key added here
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="travel-container"
              >
                <h2>Profile</h2>
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div
                key={`ai-${selectedD?.properties?.ADMIN}`} // Key added here
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="ai-container"
              >
                {/* <h2>Ai</h2> */}
                <Chat
                  selectedCountry={selectedCountry}
                  inputText={inputText}
                  setInputText={setInputText}
                />
              </motion.div>
            )}

            {activeTab === "help" && (
              <motion.div
                key={`profile-${selectedD?.properties?.ADMIN}`} // Key added here
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="travel-container"
              >
                <h2>Help</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

function App() {
  return <World />;
}

export default App;
