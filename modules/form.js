import * as config from "/modules/config.js";
console.log(config);

const form = document.querySelector("form");
const stage1 = document.querySelector("#stage1");
const stage2 = document.querySelector("#stage2");
const stage3 = document.querySelector("#stage3");
const formComplete = document.querySelector(".complete-container");
const nextStageBtn = document.querySelectorAll(".next");
const prevStageBtn = document.querySelectorAll(".back");

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
});

// ADD EVENTLISTENERS TO NEXT/BACK BUTTONS
prevStageBtn.forEach((btn) => btn.addEventListener("click", prevStage));
nextStageBtn.forEach((btn) => btn.addEventListener("click", nextStage));

// DECIDE STAGE TO GO TO
function nextStage() {
  //e.preventDefault();

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
    form.reportValidity();

    // contactInput.forEach((input) => {
    //   // inputValidate(input);
    //   console.log(input, input.validity);
    //   input.addEventListener("input", (e) => {
    //     console.log(e.target.value);
    //   });
    // });
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
  // form.submit();
  showCompleteScreen();
  form.disabled = true;
  form.classList.add("hide");

  const contactData = {
    first_name: form.elements.first_name.value,
    last_name: form.elements.last_name.value,
    email: form.elements.email.value,
    company: form.elements.company.value,
    country: form.elements.country.value,
    job_title: form.elements.job_title.value,
    message: form.elements.message.value,
  };

  post(contactData);
  form.reset();
}

// SHOW FORM COMPLETE
function showCompleteScreen() {
  formComplete.classList.remove("hide");
  document.querySelector(".form-progress").classList.add("hide");
  document.querySelector(".form-actions").classList.add("hide");
  prevStageBtn.forEach((btn) => (btn.disabled = true));
  nextStageBtn.forEach((btn) => btn.removeEventListener("click", nextStage));

  document.querySelector(".form-heading h1").textContent = `Tak, ${form.elements.first_name.value}!`;
  document.querySelector(".info-paragraph").textContent =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum culpa blanditiis veniam enim eveniet labore, dolor ad delectus reprehenderit qui ipsum inventore aspernatur unde sunt consectetur soluta cumque quidem harum.";
  document.querySelector(".help-text").classList.add("hide");
}

// ADD VALIDATION TO CHECKBOX
checkboxValidate();
function checkboxValidate() {
  const checkboxInput = document.querySelector(".checkbox-input");
  checkboxInput.addEventListener("change", (e) => {
    console.log(e.target.value);
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
        e.target.parentNode.parentNode.appendChild(errMsg);
      }
    }
  });
}

// VALIDATE ALL INPUT FIELDS
function inputValidate(e) {
  console.log(e.target.value);
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
  document.querySelector("#contact-us").addEventListener("animationend", () => {
    document.querySelector("#contact-us").style.display = "none";
  });
}

// POST DATA TO DATABASE
function post(data) {
  const postData = JSON.stringify(data);
  fetch(config.endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": config.key,
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((res) => res.json())
    .then(console.log("post to database complete!"));
}
