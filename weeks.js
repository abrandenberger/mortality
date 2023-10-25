window.container = document.getElementById("weeks");
window.currentDate = new Date();
// window.weeksLifespan = 4693; // 90 years
window.weeksLifespan = 4171; // 80 years
window.dateInput = document.getElementById("dob");

const calculateWeeksAlive = (birthDate) => {
  if (birthDate.toString().length > 1) {
    return parseInt(
      (window.currentDate - birthDate) / (1000 * 60 * 60 * 24 * 7).toFixed()
    );
  }
};

const generateWeeks = (birthDate) => {
  // const title = document.getElementById("title");
  // title.className += " active";
  const dobInputGroup = document.getElementById("dobInputGroup");
  dobInputGroup.className += " active";

  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }

  const weeksAlive = calculateWeeksAlive(birthDate);

  if (weeksAlive) {
    sundaysLeft = document.getElementById("sundays-left-count");
    sundaysLeft.innerHTML = `${window.weeksLifespan - weeksAlive}`;
    // window.container.appendChild(sundaysLeft);
  }

  let lastYearSet = null;
  for (i = 0; i < window.weeksLifespan; i++) {
    const weekBlock = document.createElement("li");
    weekBlock.className = "week";

    if (weeksAlive && i <= weeksAlive) {
      weekBlock.className += " active";
    }

    const birth = moment(birthDate);
    if (i == 0) {
      weekBlock.dataset.weekOfYear = birth.week();
    } else {
      const allWeeks = document.getElementsByClassName("week");
      weekBlock.dataset.weekOfYear =
        parseInt(allWeeks[allWeeks.length - 1].dataset.weekOfYear) + 1;
    }

    if (lastYearSet) {
      var weeksInYear = moment(lastYearSet, "YYYY").weeksInYear();
    } else {
      var weeksInYear = birth.weeksInYear();
    }

    if (weekBlock.dataset.weekOfYear > weeksInYear) {
      weekBlock.dataset.weekOfYear = 1;
      weekBlock.className += " newYear";
      weekBlock.dataset.year = birth.add(i + 1, "weeks")._d.getFullYear();
      lastYearSet = weekBlock.dataset.year;
    }

    window.container.appendChild(weekBlock);
    if (
      weekBlock.dataset.weekOfYear == 1 &&
      weekBlock.className.includes("active")
    ) {
      weekBlock.innerHTML = `<div class="yearToolTip" id="yearToolTip"><span>${weekBlock.dataset.year}</span></div>`;
    }
  }
  // endOfLifeYears = document.createTextNode("90 years");
  // window.container.appendChild(endOfLifeYears);
};

const setDate = (e) => {
  const birthDate = new Date(e.target.value);

  localStorage.setItem("birthDate", birthDate);
  generateWeeks(birthDate);
};

if (typeof browser === "undefined") {
  dateInput.onchange = setDate;
} else {
  dateInput.onchange = (e) => {
    window.setTimeout(setDate(e), 0);
  };
}

window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("body").style.opacity = 1;
});

// deal with saved birthdate
const savedBirthdate = localStorage.getItem("birthDate");
if (savedBirthdate) {
  const birthDate = new Date(savedBirthdate);
  dateInput.value = birthDate.toISOString().slice(0, 10);
  generateWeeks(birthDate);
} else {
  generateWeeks(new Date());
}

// deal with editing the name
const editableName = document.getElementById("editable-name");
editableName.addEventListener("click", () => {
  editableName.contentEditable = "true";
  editableName.focus();
});
function saveName() {
  // save to local storage when click out / enter
  const editedName = editableName.textContent.trim();
  localStorage.setItem("userName", editedName);
  editableName.blur(); // Remove focus to save the name and make it non-editable
}
editableName.addEventListener("blur", saveName);
editableName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent line break
    saveName();
  }
});
const savedName = localStorage.getItem("userName");
if (savedName) {
  editableName.textContent = savedName;
}

// deal with editing the years
const editableYears = document.getElementById("editable-years");
editableYears.addEventListener("click", () => {
  // Make the years editable when clicked
  editableYears.contentEditable = "true";
  editableYears.focus();
});
function saveYears() {
  const editedYears = parseInt(editableYears.textContent.trim());
  if (editedYears > 40 && editedYears < 120) {
    localStorage.setItem("userYears", editedYears);
    editableYears.blur();
    window.weeksLifespan = Math.round(editedYears * 52.143); // Update weeksLifespan based on edited years
    // Re-generate weeks with the new lifespan
    regenerateWeeks();
  }
}
function regenerateWeeks() {
  if (savedBirthdate) {
    const birthDate = new Date(savedBirthdate);
    generateWeeks(birthDate);
  } else {
    generateWeeks(new Date());
  }
}
editableYears.addEventListener("blur", saveYears);
editableYears.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent line break
    saveYears();
  }
});
const savedYears = localStorage.getItem("userYears");
if (savedYears) {
  editableYears.textContent = savedYears;
  window.weeksLifespan = Math.round(savedYears * 52.143);
  regenerateWeeks();
}
