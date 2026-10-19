// Regex patterning for validating email formatting
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let isMailingListSelected = false;

// Runs validation code when submit button is pressed
document.getElementById("contact-form").onsubmit = () => {

    let isValid = true;

    clearErrors();

    // Validates First Name
    let fname = document.getElementById("first-name").value.trim();
    if (fname === "") {
        document.getElementById("err-fname").style.display = "inline";
        isValid = false;
    }

    // Validates Last Name
    let lname = document.getElementById("last-name").value.trim();
    if (lname === "") {
        document.getElementById("err-lname").style.display = "inline";
        isValid = false;
    }

    // Validates Optional LinkedIn URL
    let urlLinkedIn = document.getElementById("linkedin-url").value.trim();
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
    let meetingSelected = document.getElementById("first-meeting").value;
    if (meetingSelected == "none") {
        document.getElementById("err-first-meeting").style.display = "inline";
        isValid = false;
    }

    // Validates Email Format: HTML or Text
    if (isMailingListSelected) {
        let emailFormatSelected = false;
        let emailFormatButtons = document.getElementsByName("email-format");
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
document.getElementById("first-meeting").addEventListener("change", function () {
    if (this.value == "other") {
        document.getElementById("other-text").style.visibility = "visible";
    } else {
        document.getElementById("other-text").style.visibility = "hidden";
    }
});

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