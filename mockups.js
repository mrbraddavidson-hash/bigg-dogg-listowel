
    const params = new URLSearchParams(location.search);
    const selectedConcept = params.get("concept");
    const selectedSet = params.get("set");
    if (/^(?:[1-9]|10)$/.test(selectedConcept || "")) {
      document.body.classList.add("single-concept");
      document.querySelectorAll(".concept").forEach((concept) => {
        concept.hidden = concept.id !== `concept-${selectedConcept}`;
      });
    } else if (selectedSet === "new" || selectedSet === "original" || selectedSet === "more") {
      document.body.classList.add(`${selectedSet}-set`);
      document.querySelectorAll(".concept").forEach((concept) => {
        const number = Number(concept.id.replace("concept-", ""));
        concept.hidden = selectedSet === "new"
          ? number < 6 || number > 10
          : selectedSet === "original"
            ? number > 5
            : number < 11;
      });
    }
