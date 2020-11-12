const form = {
  hasDoneForm: true,
  times_visited: 0,
  first_name: "",
  last_name: "",
  email: "",
  company: "",
  country: "",
  job_title: "",
  message: "",
};

function decideCta() {
  // CTA BUTTONS TO OPEN FORM DIALOG
  const brochureCTA = document.querySelectorAll(".brochure-cta");
  brochureCTA.forEach((btn) => {
    btn.addEventListener("click", ctaClick);
  });

  function ctaClick() {
    if (JSON.parse(window.localStorage.getItem("form"))) {
      goToBrochure();
    } else {
      openForm();
    }
  }
}

function storeFormStatus() {
  console.log("contact info submitted to database");
  window.localStorage.setItem("form", JSON.stringify(form));
}

function openForm() {
  console.log("open form dialog");
  document.querySelector("#contact-us").style.display = "flex";
  document.querySelector("#contact-us").classList.add("open-form");
  document.querySelector("#contact-us").addEventListener("animationend", removeFadeAni);
}

function removeFadeAni() {
  document.querySelector("#contact-us").removeEventListener("animationend", removeFadeAni);
  document.querySelector("#contact-us").classList.remove("open-form");
}

function goToBrochure() {
  console.log("form is already filled out");
  updateCount();
  window.location.href = "brochure.html";
}

function updateCount() {
  const storageData = JSON.parse(window.localStorage.getItem("form"));
  storageData.times_visited++;
  window.localStorage.setItem("form", JSON.stringify(storageData));
}

function getContactInfo(info) {
  form.first_name = info.first_name;
  form.last_name = info.last_name;
  form.email = info.email;
  form.company = info.company;
  form.country = info.country;
  form.job_title = info.job_title;
  form.message = info.message;
}

export { decideCta, storeFormStatus, getContactInfo, form };
