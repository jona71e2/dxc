import * as config from "/modules/config.js";
import * as local from "/modules/local-storage.js";
import * as rest from "/modules/rest.js";

//console.log(local);
//console.log(config);
//console.log(rest);
local.decideCta();

const form = document.querySelector("form");
const stage1 = document.querySelector("#stage1");
const stage2 = document.querySelector("#stage2");
const stage3 = document.querySelector("#stage3");
const formComplete = document.querySelector(".complete-container");
const nextStageBtn = document.querySelectorAll(".next");
const prevStageBtn = document.querySelectorAll(".back");

const checkboxInput = document.querySelector(".checkbox-input");

// SUPPRESS BUILT-IN VALIDATION
form.setAttribute("novalidate", true);
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// ADD VALIDATION METHOD TO ALL INPUT FIELDS
const contactInput = document.querySelectorAll(".contact-input");
contactInput.forEach((input) => {
  input.addEventListener("blur", (e) => {
    inputValidate(e);
  });

  input.addEventListener("input", (e) => {
    inputValidate(e);
  });
});

// ADD EVENTLISTENERS TO NEXT/BACK BUTTONS
prevStageBtn.forEach((btn) => btn.addEventListener("click", prevStage));
nextStageBtn.forEach((btn) => btn.addEventListener("click", nextStage));

// DECIDE STAGE TO GO TO
function nextStage() {
  if (form.checkValidity()) {
    prevStageBtn.forEach((btn) => (btn.disabled = false));
    if (stage2.classList.contains("hide") && stage3.classList.contains("hide")) {
      showStage2();
    } else if (stage3.classList.contains("hide")) {
      showStage3();
    } else if (formComplete.classList.contains("hide")) {
      submitForm();
    }
  } else {
    // following code about events was taken from Stack Overflow
    if (!stage3.classList.contains("hide")) {
      const checkboxEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      if (!checkboxInput.parentNode.parentNode.querySelector("p")) {
        checkboxInput.dispatchEvent(checkboxEvent);
        console.log(checkboxInput.value);
      }
    } else {
      contactInput.forEach((input) => {
        const inputEvent = new Event("blur", {
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(inputEvent);
      });
    }
  }
}

// DECIDE STAGE TO REVERT TO
function prevStage() {
  document.querySelectorAll(".dot").forEach((dot) => dot.addEventListener("animationend", reverseDot));
  prevStageBtn.forEach((btn) => btn.removeEventListener("click", prevStage));
  nextStageBtn.forEach((btn) => btn.removeEventListener("click", nextStage));
  document.querySelector(".next").textContent = "Næste";

  if (!stage2.classList.contains("hide")) {
    document.querySelector(".dot:nth-child(2)").classList.add("not-checked");
    prevStageBtn.forEach((btn) => (btn.disabled = true));
    showStage1();
  } else if (!stage3.classList.contains("hide")) {
    document.querySelector(".dot:nth-child(3)").classList.add("not-checked");
    showStage2();
  }
}

// REVERSE DOT STATUS
function reverseDot() {
  this.classList.remove("not-checked");
  this.classList.remove("checked");
  document.querySelectorAll(".dot").forEach((dot) => dot.removeEventListener("animationend", reverseDot));
  prevStageBtn.forEach((btn) => btn.addEventListener("click", prevStage));
  nextStageBtn.forEach((btn) => btn.addEventListener("click", nextStage));
}

// SHOW STAGE 1
function showStage1() {
  document.querySelectorAll("fieldset").forEach((stage) => {
    stage.classList.add("hide");
    stage.disabled = true;
  });
  stage1.classList.remove("hide");
  stage1.disabled = false;
  document.querySelector(".form-progress p").textContent = "1/3";
}

// SHOW STAGE 2
function showStage2() {
  document.querySelectorAll("fieldset").forEach((stage) => {
    stage.classList.add("hide");
    stage.disabled = true;
  });
  stage2.classList.remove("hide");
  stage2.disabled = false;
  document.querySelector(".form-progress p").textContent = "2/3";
  document.querySelector(".dot:nth-child(2)").classList.add("checked");
}

// SHOW STAGE 3
function showStage3() {
  document.querySelectorAll("fieldset").forEach((stage) => {
    stage.classList.add("hide");
    stage.disabled = true;
  });
  stage3.classList.remove("hide");
  stage3.disabled = false;
  document.querySelector(".form-progress p").textContent = "3/3";
  document.querySelector(".dot:nth-child(3)").classList.add("checked");
  document.querySelector(".next").textContent = "Indsend";
}

// SUBMIT FORM DATA
function submitForm() {
  const contactData = {
    first_name: form.elements.first_name.value,
    last_name: form.elements.last_name.value,
    email: form.elements.email.value,
    company: form.elements.company.value,
    country: form.elements.country.value,
    job_title: form.elements.job_title.value,
    message: form.elements.message.value,
  };

  local.getContactInfo(contactData);
  rest.post(contactData); // POST DATA TO DATABASE

  form.disabled = true;
  form.classList.add("hide");
  showCompleteScreen(contactData);
  // form.submit();
  form.reset();
}

// SHOW FORM COMPLETE
function showCompleteScreen(contactData) {
  formComplete.classList.remove("hide");
  document.querySelector(".form-progress").classList.add("hide");
  document.querySelector(".form-actions").classList.add("hide");
  prevStageBtn.forEach((btn) => (btn.disabled = true));
  nextStageBtn.forEach((btn) => btn.removeEventListener("click", nextStage));

  document.querySelector(".form-heading h1").textContent = `Tak, ${form.elements.first_name.value}!`;
  document.querySelector(
    ".info-paragraph"
  ).textContent = `Mange tak for henvendelsen. Vi er glade for du vil høre mere om, hvordan vi kan hjælpe dig. Du vil høre fra os snarest på mail: ${contactData.email}`;
  document.querySelector(".help-text").classList.add("hide");
}

// ADD VALIDATION TO CHECKBOX
checkboxValidate();
function checkboxValidate() {
  checkboxInput.addEventListener("change", (e) => {
    //console.log(e.target.value);
    if (e.target.checkValidity()) {
      e.target.classList.remove("invalid");
      e.target.classList.add("valid");

      if (e.target.parentNode.parentNode.querySelector("p")) {
        e.target.parentNode.parentNode.querySelector("p").remove();
      }
    } else {
      e.target.classList.remove("valid");
      e.target.classList.add("invalid");

      if (!e.target.parentNode.querySelector("p")) {
        const errMsg = document.createElement("p");
        errMsg.textContent = "Accepter venligst vores e-mail-politik";
        errMsg.classList.add("error");
        errMsg.classList.add("error-fade");
        e.target.parentNode.parentNode.appendChild(errMsg);
      }
    }
  });
}

// VALIDATE ALL INPUT FIELDS
function inputValidate(e) {
  //console.log(e.target.value);
  if (e.target.checkValidity()) {
    e.target.classList.remove("invalid");
    e.target.classList.add("valid");

    if (e.target.parentNode.querySelector("p")) {
      e.target.parentNode.querySelector("p").remove();
    }
  } else {
    e.target.classList.remove("valid");
    e.target.classList.add("invalid");

    if (!e.target.parentNode.querySelector("p")) {
      const errMsg = document.createElement("p");
      errMsg.textContent = "Udfyld venligst dette felt";
      errMsg.classList.add("error");
      errMsg.classList.add("error-fade");
      if (e.target.type === "email") {
        errMsg.textContent = "Indtast venligst en gyldig email-adresse";
      }

      if (e.target.type === "select-one") {
        errMsg.textContent = "Vælg venligst et land";
      }
      e.target.parentNode.appendChild(errMsg);
    }
  }
}

// ADD EVENTLISTENERS TO ALL CLOSE-BUTTONS
document.querySelectorAll(".close").forEach((close) => {
  close.setAttribute("novalidate", true);
  close.addEventListener("click", closeForm);
});

// CLOSE FORM
function closeForm() {
  document.querySelector("#contact-us").classList.add("hide-form");
  document.querySelector("#contact-us").addEventListener("animationend", removeFadeAni);

  function removeFadeAni() {
    document.querySelector("#contact-us").style.display = "none";
    document.querySelector("#contact-us").classList.remove("hide-form");
    document.querySelector("#contact-us").removeEventListener("animationend", removeFadeAni);
  }
}
