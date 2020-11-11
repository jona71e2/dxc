const form = {
  hasDoneForm: true,
  hasClickedBrochure: 0,
};

function decideCta() {
  // CTA BUTTONS TO OPEN FORM DIALOG
  const brochureCTA = document.querySelectorAll(".brochure-cta");
  brochureCTA.forEach((btn) => {
    btn.addEventListener("click", ctaClick);
  });

  function ctaClick() {
    if (JSON.parse(window.localStorage.getItem("form"))) {
      console.log("form is already filled out");
      window.location.href = "brochure.html";
    } else {
      console.log("open form dialog");
      openForm();
    }
  }
}

function storeFormStatus() {
  console.log("contact info submitted to database");
  window.localStorage.setItem("form", JSON.stringify(form));
}

function openForm() {
  document.querySelector("#contact-us").style.display = "flex";
  document.querySelector("#contact-us").classList.add("open-form");
  document.querySelector("#contact-us").addEventListener("animationend", removeFadeAni);
}

function removeFadeAni() {
  document.querySelector("#contact-us").removeEventListener("animationend", removeFadeAni);
  document.querySelector("#contact-us").classList.remove("open-form");
}

export { decideCta, storeFormStatus, form };
