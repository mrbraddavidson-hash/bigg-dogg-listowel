
    const selectedConcept = new URLSearchParams(location.search).get("concept");
    if (/^[1-5]$/.test(selectedConcept || "")) {
      document.body.classList.add("single-concept");
      document.querySelectorAll(".concept").forEach((concept) => {
        concept.hidden = concept.id !== `concept-${selectedConcept}`;
      });
    }
  