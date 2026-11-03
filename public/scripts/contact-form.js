// Regex patterning for validating email formatting
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Checks screen size
const screenMediaQuery = window.matchMedia("screen and (max-width: 450px)");

let isMailingListSelected = false;

// Runs validation code when submit button is pressed
document.getElementById("contact-form").onsubmit = () => {

    let isValid = true;

    clearErrors();

    // Validates First Name
    let fname = document.getElementById("firstname").value.trim();
    if (fname === "") {
        document.getElementById("err-fname").style.display = "inline";
        isValid = false;
    }

    // Validates Last Name
    let lname = document.getElementById("lastname").value.trim();
    if (lname === "") {
        document.getElementById("err-lname").style.display = "inline";
        isValid = false;
    }

    // Validates Optional LinkedIn URL
    let urlLinkedIn = document.getElementById("linkedin").value.trim();
    if (urlLinkedIn !== "" && !isValidUrl(urlLinkedIn)) {
        document.getElementById("err-url").style.display = "inline";
        isValid = false;
    }

    // Validates Optional Email Address
    let email = document.getElementById("email").value.trim();
    let mailingListSelected = document.getElementById("mail-list")
    if ((email !== "" || isMailingListSelected) && !emailRegex.test(email)) {
        document.getElementById("err-email").style.display = "inline";
        isValid = false;
    }

    // Validates How We Met
    let meetingSelected = document.getElementById("meeting").value;
    if (meetingSelected == "none") {
        document.getElementById("err-first-meeting").style.display = "inline";
        isValid = false;
    }

    // Validates Email Format: HTML or Text
    if (isMailingListSelected) {
        let emailFormatSelected = false;
        let emailFormatButtons = document.getElementsByName("format");
        for (let i = 0; i < emailFormatButtons.length; i++) {
            if (emailFormatButtons[i].checked) {
                emailFormatSelected = true;
            }
        }
        if (!emailFormatSelected) {
            document.getElementById("err-email-format").style.display = "inline";
            isValid = false;
        }
    }

    // Do not submit if form is invalid
    return isValid;
};

// Checks to see if other is selected and displays or hides the Other text box
document.getElementById("meeting").addEventListener("change", updateOther);

// Checks to see if screen is mobile or not and uses appropriate CSS tags
screenMediaQuery.addEventListener("change", updateOther);

// Updates the Other Text Field
updateOther();

document.getElementById("mail-list").addEventListener("change", function () {
    if (this.checked) {
        document.getElementById("eformat").style.display = "block";
        isMailingListSelected = true;
    } else {
        document.getElementById("eformat").style.display = "none";
        isMailingListSelected = false;
    }
});

// Clears error messages
function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

// Checks if entered url is in the correct format or not
// I had to do a lot of research for this one. There is definitely a simpler way of achieving this, but it is stricter and ensures a correct format
function isValidUrl(string) {
    try {
        // Uses native JavaScript URL interface to check for generic url formatting
        const url = new URL(string);

        // Checks to see if the domain is valid by checking if the correct protocol is used followed by linked in's domain
        const isValidDomain = url.protocol === "https:" && (url.hostname === "linkedin.com" || url.hostname === "www.linkedin.com");

        // Checks to see if the valid pathname for a linkedIn profile is correct using regex
        const isValidPath = /^\/in\/[^/]+\/?$/.test(url.pathname);

        return isValidDomain && isValidPath;
    } catch (_) {
        return false;
    }
}

// Used to update the other text field depending on screen size
function updateOther() {
    const otherText = document.getElementById("other-text");
    const isSelected = document.getElementById("meeting").value === "other";

    if (screenMediaQuery.matches) {
        // On mobile, ensures visibility is no longer used
        otherText.style.visibility = "";
        otherText.style.display = isSelected ? "block" : "none";
    } else {
        // On desktop, ensures display is block
        otherText.style.display = "block";
        otherText.style.visibility = isSelected ? "visible" : "hidden";
    }
}