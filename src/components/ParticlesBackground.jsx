import React from "react";
import Particles from "react-tsparticles";

const ParticlesBackground = () => (
  <Particles
    options={{
      background: {
        color: {
          value: "#121212",
        },
      },
      particles: {
        color: {
          value: "#00BFFF",
        },
        links: {
          color: "#9B4DFF",
          distance: 150,
          enable: true,
        },
        move: {
          enable: true,
          speed: 1,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 50,
        },
        size: {
          value: 3,
        },
      },
    }}
  />
);

export default ParticlesBackground;