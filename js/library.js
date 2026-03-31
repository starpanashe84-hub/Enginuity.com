/* ═══════════════════════════════════════════════════════════════
   ENGINUITY — library.js
   Dynamic content rendering and interaction for the Archives
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Generic Mock Data Base ──────────────────────────────── */
  const libraryData = {
    mechanical: {
      name: "Mechanical",
      notes: [
        { title: "Thermodynamics I", desc: "Laws of thermo, heat engines, entropy.", tag: "Core" },
        { title: "Fluid Mechanics", desc: "Statics, dynamics, Navier-Stokes intro.", tag: "Core" },
        { title: "Solid Mechs", desc: "Stress, strain, Mohr's circle analysis.", tag: "Applied" }
      ],
      papers: [
        { title: "Thermo Past Paper - 2024", desc: "Winter semester final evaluation.", tag: "PDF" },
        { title: "Fluids Past Paper - 2023", desc: "Autumn mid-term and final.", tag: "PDF" }
      ],
      flashcards: [
        { topic: "Thermodynamics", q: "What is the 1st Law of Thermodynamics?", a: "Energy cannot be created or destroyed, only transformed." },
        { topic: "Thermodynamics", q: "What is the 2nd Law of Thermodynamics?", a: "Total entropy of an isolated system can never decrease over time." },
        { topic: "Thermodynamics", q: "What is the 3rd Law of Thermodynamics?", a: "Entropy of a perfect crystal at absolute zero is exactly zero." },
        { topic: "Fluid Mechanics", q: "Define Bernoulli's Principle.", a: "For an inviscid flow, an increase in fluid speed occurs simultaneously with a decrease in pressure." },
        { topic: "Fluid Mechanics", q: "What is the Reynolds Number?", a: "A dimensionless quantity used to predict fluid flow patterns (laminar vs turbulent)." },
        { topic: "Fluid Mechanics", q: "At what Reynolds number is pipe flow considered turbulent?", a: "Typically greater than 4000." },
        { topic: "Solid Mechanics", q: "What is Hooke's Law?", a: "Strain in a solid is proportional to the applied stress within the elastic limit." },
        { topic: "Solid Mechanics", q: "Define Young's Modulus.", a: "A measure of the stiffness of a solid material, calculated as Stress / Strain." },
        { topic: "Solid Mechanics", q: "What is Poisson's ratio?", a: "The negative ratio of transverse to axial strain." },
        { topic: "Solid Mechanics", q: "Describe Mohr's Circle.", a: "A 2D graphical representation of the transformation law for the Cauchy stress tensor." },
        { topic: "Dynamics", q: "State Newton's First Law.", a: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon." },
        { topic: "Dynamics", q: "State Newton's Second Law.", a: "Force equals mass times acceleration (F=ma)." },
        { topic: "Dynamics", q: "State Newton's Third Law.", a: "For every action, there is an equal and opposite reaction." },
        { topic: "Thermodynamics", q: "What is an Isentropic Process?", a: "An idealized thermodynamic process that is both adiabatic and reversible." },
        { topic: "Thermodynamics", q: "What is Enthalpy?", a: "A thermodynamic quantity equivalent to the total heat content of a system." },
        { topic: "Solid Mechanics", q: "Define Yield Strength.", a: "The stress at which a material begins to deform plastically." },
        { topic: "Solid Mechanics", q: "What is Ultimate Tensile Strength?", a: "The maximum stress a material can withstand while being stretched or pulled." },
        { topic: "Fluid Mechanics", q: "What is dynamic viscosity?", a: "A measure of fluid's resistance to flow when a shear stress is applied." },
        { topic: "Dynamics", q: "Define angular momentum.", a: "The rotational equivalent of linear momentum (L = Iω)." },
        { topic: "Manufacturing", q: "What is CNC?", a: "Computer Numerical Control - automated control of machining tools." }
      ],
      questions: [
        { title: "Rankine Cycle Problems", desc: "15 calculations on steam turbines.", tag: "Set A" },
        { title: "Pipe Flow Friction", desc: "Moody chart & Darcy-Weisbach.", tag: "Set B" }
      ]
    },
    civil: {
      name: "Civil",
      notes: [
        { title: "Structural Analysis", desc: "Determinate structures, trusses, frames.", tag: "Core" },
        { title: "Soil Mechanics", desc: "Phase relationships, consolidation, shear.", tag: "Geotech" }
      ],
      papers: [
        { title: "Structures Final - 2024", desc: "Spring semester.", tag: "PDF" },
        { title: "Soil Mechs Midterm - 2023", desc: "Fall semester assessment.", tag: "PDF" }
      ],
      flashcards: [
        { topic: "Structures", q: "What is a statically determinate structure?", a: "A structure whose support reactions can be found using only equations of equilibrium." },
        { topic: "Structures", q: "What is a Truss?", a: "An assembly of members such that the framework behaves as a single object, usually bearing only axial forces." },
        { topic: "Structures", q: "Define Bending Moment.", a: "The reaction induced in a structural element when an external force or moment is applied to bend it." },
        { topic: "Structures", q: "What is Shear Force?", a: "The internal force in a body that is coplanar with a cross section." },
        { topic: "Geotech", q: "Define Porosity.", a: "The ratio of the volume of voids to the total volume of the soil mass." },
        { topic: "Geotech", q: "What is the Void Ratio?", a: "The ratio of the volume of voids to the volume of solids." },
        { topic: "Geotech", q: "What is Soil Consolidation?", a: "The process by which soils decrease in volume when subjected to stress." },
        { topic: "Geotech", q: "Define Atterberg Limits.", a: "A basic measure of the critical water contents of a fine-grained soil." },
        { topic: "Concrete", q: "What is Portland Cement?", a: "The most common type of cement in general usage around the world." },
        { topic: "Concrete", q: "Why do we add steel to concrete?", a: "Concrete has high compressive strength but extremely low tensile strength." },
        { topic: "Concrete", q: "What is the point of a slump test?", a: "To measure the workability and consistency of fresh concrete." },
        { topic: "Hydrology", q: "What is Darcy's Law?", a: "An equation that describes the flow of a fluid through a porous medium." },
        { topic: "Hydrology", q: "Define Catchment Area.", a: "The area of land where all surface water converges to a single point at a lower elevation." },
        { topic: "Transportation", q: "What is Sight Distance?", a: "The length of the roadway a driver can see ahead at any particular time." },
        { topic: "Transportation", q: "Define Superelevation.", a: "The banking of the roadway on a horizontal curve to counteract centrifugal force." },
        { topic: "Surveying", q: "What is a Theodolite?", a: "A precision optical instrument for measuring angles between visible points in horizontal and vertical planes." },
        { topic: "Surveying", q: "What does GPS stand for?", a: "Global Positioning System." },
        { topic: "Materials", q: "What is Creep in concrete?", a: "The time-dependent deformation under a constant load." },
        { topic: "Structures", q: "What is a Euler buckling load?", a: "The critical load at which a slender column will suddenly bend or bow." },
        { topic: "Geotech", q: "What is liquefaction?", a: "When saturated soil substantially loses strength and stiffness in response to applied stress, usually an earthquake." }
      ],
      questions: [
        { title: "Truss Method of Joints", desc: "10 diagram-based problems.", tag: "Set A" }
      ]
    },
    software: {
      name: "Software",
      notes: [
        { title: "Data Structures", desc: "Trees, graphs, hash maps.", tag: "Core" },
        { title: "Operating Systems", desc: "Processes, threads, memory management.", tag: "Systems" }
      ],
      papers: [
        { title: "Algorithms - 2024", desc: "Dynamic programming and greedy algos.", tag: "Online" }
      ],
      flashcards: [
        { topic: "Data Structures", q: "What is a Hash Table?", a: "A data structure that implements an associative array abstract data type using a hash function." },
        { topic: "Data Structures", q: "What is the time complexity of Binary Search?", a: "O(log n) in the worst and average cases." },
        { topic: "Data Structures", q: "Define a Linked List.", a: "A linear collection of data elements whose order is not given by their physical placement in memory." },
        { topic: "Data Structures", q: "What is a Stack?", a: "A LIFO (Last In First Out) data structure." },
        { topic: "OS", q: "What is a Deadlock?", a: "A situation where a set of processes are blocked because each process is holding a resource and waiting for another." },
        { topic: "OS", q: "What is Virtual Memory?", a: "A memory management technique that provides an idealized abstraction of the storage resources." },
        { topic: "OS", q: "Explain Context Switching.", a: "The process of storing the state of a process or thread so that it can be restored and resume execution later." },
        { topic: "Algorithms", q: "What is Dynamic Programming?", a: "A method for solving a complex problem by breaking it down into a collection of simpler subproblems." },
        { topic: "Algorithms", q: "Explain QuickSort.", a: "A divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around it." },
        { topic: "Algorithms", q: "What is greedy algorithm?", a: "An algorithm that makes the locally optimal choice at each stage." },
        { topic: "Algorithms", q: "What is Dijkstra's algorithm used for?", a: "Finding the shortest paths between nodes in a graph." },
        { topic: "Networking", q: "What is the OSI model?", a: "A conceptual framework used to comprehend and standardize the functions of a telecommunication system." },
        { topic: "Networking", q: "Difference between TCP and UDP?", a: "TCP is connection-oriented and reliable; UDP is connectionless and faster but unreliable." },
        { topic: "Databases", q: "What is ACID?", a: "Atomicity, Consistency, Isolation, Durability. Properties ensuring reliable database transactions." },
        { topic: "Databases", q: "Define Normalization.", a: "The process of structuring a database to reduce data redundancy and improve data integrity." },
        { topic: "Design", q: "What is the Singleton Pattern?", a: "A software design pattern that restricts the instantiation of a class to a singular instance." },
        { topic: "Design", q: "What is MVC?", a: "Model-View-Controller, an architectural pattern that separates an application into three logical components." },
        { topic: "Web", q: "What does REST stand for?", a: "Representational State Transfer." },
        { topic: "Web", q: "What is DOM?", a: "Document Object Model, an API for HTML and XML documents." },
        { topic: "Security", q: "What is Cross-Site Scripting (XSS)?", a: "A vulnerability where an attacker injects malicious executable scripts into the code of a trusted website." }
      ],
      questions: [
        { title: "Leetcode Arrays Grinded", desc: "Top 50 array manipulation questions.", tag: "Code" }
      ]
    },
    aerospace: {
      name: "Aerospace",
      notes: [
        { title: "Aerodynamics", desc: "Airfoil theory, lift, drag, boundary layers.", tag: "Fluids" },
        { title: "Propulsion", desc: "Jet engines, thrust equations, rockets.", tag: "Systems" }
      ],
      papers: [
        { title: "Propulsion Final - 2024", desc: "Focus on gas turbines.", tag: "PDF" }
      ],
      flashcards: [
        { topic: "Aerodynamics", q: "What causes aerodynamic stall?", a: "Separation of boundary layer from the airfoil surface due to high angle of attack." },
        { topic: "Aerodynamics", q: "What is the Coanda effect?", a: "The tendency of a fluid jet to stay attached to a convex surface." },
        { topic: "Aerodynamics", q: "Define Drag Coefficient.", a: "A dimensionless quantity used to quantify the drag or resistance of an object in a fluid environment." },
        { topic: "Aerodynamics", q: "What is Mach Number?", a: "The ratio of flow velocity past a boundary to the local speed of sound." },
        { topic: "Propulsion", q: "What is Specific Impulse (Isp)?", a: "A measure of how effectively a rocket uses propellant or a jet engine uses fuel." },
        { topic: "Propulsion", q: "Explain the Brayton Cycle.", a: "The thermodynamic cycle that describes the operation of a gas turbine engine." },
        { topic: "Propulsion", q: "What is an Afterburner?", a: "An additional combustion component used on some jet engines to provide an increase in thrust." },
        { topic: "Propulsion", q: "Difference between Turbofan and Turbojet?", a: "A turbofan bypasses a portion of the air around the core, a turbojet sends all air through the core." },
        { topic: "Mechanics", q: "What are the six degrees of freedom?", a: "Forward/back, up/down, left/right, pitch, yaw, roll." },
        { topic: "Orbital", q: "What is Kepler's First Law?", a: "The orbit of a planet is an ellipse with the Sun at one of the two foci." },
        { topic: "Orbital", q: "Define Escape Velocity.", a: "The minimum speed needed for a free, non-propelled object to escape the gravitational influence of a massive body." },
        { topic: "Structures", q: "What is a Monocoque?", a: "A structural system where loads are supported by an object's external skin, similar to an egg shell." },
        { topic: "Structures", q: "Why use Titanium in aerospace?", a: "High strength-to-weight ratio and excellent corrosion and heat resistance." },
        { topic: "Flight Control", q: "What do Ailerons control?", a: "Roll (rotation about the longitudinal axis)." },
        { topic: "Flight Control", q: "What does the Elevator control?", a: "Pitch (rotation about the lateral axis)." },
        { topic: "Flight Control", q: "What does the Rudder control?", a: "Yaw (rotation about the vertical axis)." },
        { topic: "Thermodynamics", q: "What is stagnation temperature?", a: "The temperature at a stagnation point in a fluid flow." },
        { topic: "Avionics", q: "What is a Pitot tube used for?", a: "Measuring fluid flow velocity, specifically an aircraft's airspeed." },
        { topic: "Orbital", q: "What is a Geosynchronous orbit?", a: "An orbit around Earth with an orbital period matching the Earth's sidereal rotation period." },
        { topic: "Aerodynamics", q: "What is an oblique shock?", a: "A shock wave that is inclined with respect to the incident upstream flow direction." }
      ],
      questions: [
        { title: "Lift Coefficient Calcs", desc: "12 practical airfoil problems.", tag: "Set A" }
      ]
    },
    electrical: {
      name: "Electrical",
      notes: [
        { title: "Circuit Theory", desc: "KCL, KVL, Thevenin, AC analysis.", tag: "Core" },
        { title: "Control Systems", desc: "Root locus, Bode plots, PID tuning.", tag: "Systems" }
      ],
      papers: [
        { title: "Circuits Midterm - 2024", desc: "DC and first-order transient circuits.", tag: "PDF" }
      ],
      flashcards: [
        { topic: "Circuits", q: "State Kirchhoff's Current Law (KCL).", a: "The algebraic sum of all currents entering and exiting a node must equal zero." },
        { topic: "Circuits", q: "State Kirchhoff's Voltage Law (KVL).", a: "The directed sum of the potential differences around any closed loop is zero." },
        { topic: "Circuits", q: "What is Ohm's Law?", a: "V = I * R (Voltage equals Current times Resistance)." },
        { topic: "Circuits", q: "Explain Thevenin's Theorem.", a: "Any linear circuit can be simplified to an equivalent circuit with a single voltage source and series resistance." },
        { topic: "Control", q: "What does PID stand for?", a: "Proportional, Integral, Derivative." },
        { topic: "Control", q: "What is the purpose of the 'I' in PID?", a: "It eliminates steady-state error by accumulating past errors." },
        { topic: "Control", q: "What is a Bode Plot?", a: "A graph of the frequency response of a system, plotting magnitude and phase." },
        { topic: "Signals", q: "What is the Fourier Transform?", a: "A mathematical transform that decomposes functions depending on space or time into functions depending on spatial or temporal frequency." },
        { topic: "Signals", q: "What is the Nyquist-Shannon sampling theorem?", a: "To accurately reconstruct a signal, it must be sampled at least twice the maximum frequency." },
        { topic: "Electronics", q: "What is a Diode?", a: "A two-terminal electronic component that primarily conducts current in one direction." },
        { topic: "Electronics", q: "What is an Operational Amplifier (Op-Amp)?", a: "A DC-coupled high-gain electronic voltage amplifier with a differential input." },
        { topic: "Electronics", q: "Difference between NPN and PNP transistors?", a: "In NPN, current flows from collector to emitter. In PNP, from emitter to collector." },
        { topic: "Power", q: "What is Apparent Power?", a: "The combination of reactive power and true power, measured in Volt-Amperes (VA)." },
        { topic: "Power", q: "What is the Power Factor?", a: "The ratio of real power absorbed by the load to the apparent power flowing in the circuit." },
        { topic: "Power", q: "Difference between AC and DC?", a: "AC periodically reverses direction, DC flows only in one direction." },
        { topic: "Electromagnetics", q: "What is Faraday's Law of Induction?", a: "A change in magnetic environment of a coil of wire will induce a voltage in the coil." },
        { topic: "Electromagnetics", q: "Define Capacitance.", a: "The ratio of the change in electric charge to the corresponding change in its electric potential." },
        { topic: "Electromagnetics", q: "What is Inductance?", a: "The tendency of an electrical conductor to oppose a change in the electric current flowing through it." },
        { topic: "Digital", q: "What is a multiplexer?", a: "A device that selects between several analog or digital input signals and forwards the selected input." },
        { topic: "Digital", q: "What is a Flip-Flop?", a: "A circuit that has two stable states and can be used to store state information." }
      ],
      questions: [
        { title: "Op-Amp Configurations", desc: "Inverting, non-inverting, differential.", tag: "Set A" }
      ]
    }
  };

  /* ── 2. DOM Elements & State ──────────────────────────────── */
  const filterContainer = document.getElementById('disciplineFilters');
  const contentContainer = document.getElementById('libraryContent');
  
  if (!filterContainer || !contentContainer) return; /* Only run on library page */

  let currentDiscipline = 'mechanical'; /* Default load */

  /* ── 3. Initialization ────────────────────────────────────── */
  function initLibrary() {
    renderFilters();
    renderContent(currentDiscipline);
  }

  /* ── 4. Render Filters ────────────────────────────────────── */
  function renderFilters() {
    filterContainer.innerHTML = '';
    
    Object.keys(libraryData).forEach(key => {
      const btn = document.createElement('button');
      btn.className = `filter-btn ${key === currentDiscipline ? 'active' : ''}`;
      btn.textContent = `${libraryData[key].name}_`;
      btn.dataset.target = key;
      
      btn.addEventListener('click', () => {
        if (currentDiscipline === key) return;
        currentDiscipline = key;
        
        // Update active class
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Trigger content transition
        transitionContent(key);
      });
      
      filterContainer.appendChild(btn);
    });
  }

  /* ── 5. Render Content Sections ───────────────────────────── */
  function renderContent(disciplineKey) {
    const data = libraryData[disciplineKey];
    if (!data) return;

    let html = '';

    // A. Flashcards (The WOW Factor)
    if (data.flashcards && data.flashcards.length > 0) {
      html += `
        <section class="lib-section fade-in">
          <h2 class="lib-section-title">Active_Recall / Flashcards</h2>
          <div class="flashcard-grid">
            ${data.flashcards.map(fc => `
              <div class="flashcard" onclick="this.classList.toggle('flipped')">
                <div class="fc-face fc-front">
                  <span class="fc-topic">${fc.topic}</span>
                  <div class="fc-question">${fc.q}</div>
                  <span class="fc-hint">Click_to_Decrypt</span>
                </div>
                <div class="fc-face fc-back">
                  <div class="fc-answer">${fc.a}</div>
                  <span class="fc-hint">Click_to_Revert</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    // B. Course Notes Grid
    if (data.notes && data.notes.length > 0) {
      html += `
        <section class="lib-section fade-in">
          <h2 class="lib-section-title">Module_Nodes / Notes</h2>
          <div class="resource-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); display:grid; gap: var(--gap-lg);">
            ${data.notes.map(note => `
              <div class="resource-card">
                <span class="rc-type">[${note.tag}]</span>
                <h3 class="rc-title">${note.title}</h3>
                <p class="rc-desc">${note.desc}</p>
                <button class="btn-primary rc-action" style="padding: 10px 18px;">Access Node</button>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    // C. Past Papers Grid
    if (data.papers && data.papers.length > 0) {
      html += `
        <section class="lib-section fade-in">
          <h2 class="lib-section-title">Archive_Logs / Papers</h2>
          <div class="resource-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); display:grid; gap: var(--gap-lg);">
             ${data.papers.map(paper => `
              <div class="resource-card">
                <span class="rc-type">[${paper.tag}]</span>
                <h3 class="rc-title">${paper.title}</h3>
                <p class="rc-desc">${paper.desc}</p>
                <button class="btn-outline rc-action" style="padding: 10px 18px;">Download Log</button>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }
    
    // D. Topical Questions Grid
    if (data.questions && data.questions.length > 0) {
      html += `
        <section class="lib-section fade-in">
          <h2 class="lib-section-title">Simulations / Questions</h2>
          <div class="resource-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); display:grid; gap: var(--gap-lg);">
             ${data.questions.map(q => `
              <div class="resource-card">
                <span class="rc-type">[${q.tag}]</span>
                <h3 class="rc-title">${q.title}</h3>
                <p class="rc-desc">${q.desc}</p>
                <button class="btn-ghost rc-action" style="border: 1px solid var(--glass-border); padding: 10px 18px;">Initiate Sim</button>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    contentContainer.innerHTML = html;
  }

  function transitionContent(disciplineKey) {
    // Fade out current content
    const sections = contentContainer.querySelectorAll('.lib-section');
    sections.forEach(sec => {
      sec.classList.remove('fade-in');
      sec.classList.add('fade-out');
    });

    // Wait for fade out, then render and fade in new content
    setTimeout(() => {
      renderContent(disciplineKey);
    }, 200); // sync with css transition var(--dur-mid)
  }

  /* ── 6. Run Init ──────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', initLibrary);

})();
