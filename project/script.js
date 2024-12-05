document.addEventListener("DOMContentLoaded", () => {
    // Select all the images inside the .gallery class
    const images = document.querySelectorAll(".gallery img");

    // Create a new div element for the lightbox effect (where we’ll show the enlarged image)
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox"; // Give the lightbox div an ID
    document.body.appendChild(lightbox); // Add the lightbox div to the body of the page

    // Loop through all images in the gallery
    images.forEach(image => {
        // Add a click event listener to each image
        image.addEventListener("click", () => {
            // When an image is clicked, make the lightbox visible by adding the "active" class
            lightbox.classList.add("active");
            
            // Create a new image element to display the enlarged version of the clicked image
            const img = document.createElement("img");
            img.src = image.src; // Set the source of the new image to be the same as the clicked image

            // Remove any previous content from the lightbox (in case it's being used again)
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }

            // Add the new enlarged image to the lightbox
            lightbox.appendChild(img);
        });
    });

    // When the user clicks anywhere on the lightbox, close it by removing the "active" class
    lightbox.addEventListener("click", () => {
        lightbox.classList.remove("active");
    });
});

// When the document is ready, initialize the jQuery Datepicker
$(document).ready(function () {
    $("#date").datepicker({
        dateFormat: "mm/dd/yy", // Set the date format to month/day/year
        minDate: 0,             // Disable past dates (can't select dates before today)
        maxDate: "+1Y"          // Allow selecting dates up to 1 year from today
    });
});

// Initialize the jQuery Accordion widget for a section called #services-accordion
$(document).ready(function () {
    $("#services-accordion").accordion({
        collapsible: true,      // Allow the accordion sections to collapse
        active: false,          // Start with no section open
        heightStyle: "content"  // Set the height of the accordion to fit its content
    });
});

// Add hover effect on the navigation links
$(document).ready(function () {
    $("nav ul li a").hover(
        function () {
            // On hover, change the link color to orange and underline the text
            $(this).css({
                "color": "#ff6600",
                "text-decoration": "underline"
            });
        },
        function () {
            // On hover out, revert the link color to white and remove the underline
            $(this).css({
                "color": "white",
                "text-decoration": "none"
            });
        }
    );
});

// Translation functionality for multi-language support
$(document).ready(function () {
    // Function to capture the original text in the page before any translation
    function captureOriginalText() {
        $("*").contents().each(function () {
            if (this.nodeType === Node.TEXT_NODE && $.trim(this.nodeValue) !== "") {
                const parent = $(this).parent();
                if (!parent.attr("data-original")) {
                    parent.attr("data-original", parent.text().trim());
                }
            }
        });
    }

    // Function to restore the original text (used when switching back to English)
    function restoreOriginalText() {
        $("[data-original]").each(function () {
            const originalText = $(this).attr("data-original");
            $(this).text(originalText);
        });
    }

    // Clean the translation text by removing any unwanted characters (like asterisks)
    function cleanTranslation(text) {
        return text.replace(/\*+/g, '').trim();
    }

    // Function to translate the page content based on the selected language
    function translatePage(language) {
        if (language === "en") {
            restoreOriginalText(); // If the language is English, restore the original text
        } else {
            // For other languages, use Apertium API to get the translation
            $("[data-original]").each(function () {
                const originalText = $(this).attr("data-original");
                const element = $(this);

                // Make an API request to get the translated text
                $.ajax({
                    url: "https://apertium.org/apy/translate", // Apertium API URL
                    method: "GET",
                    data: {
                        q: originalText,  // Text to translate
                        langpair: `en|${language}`  // Language pair (English to selected language)
                    },
                    success: function (response) {
                        const translatedText = cleanTranslation(response.responseData.translatedText);
                        element.text(translatedText); // Replace the original text with the translated text
                    },
                    error: function () {
                        console.error("Translation failed for:", originalText); // Log an error if the translation fails
                    }
                });
            });
        }
    }

    // Capture the original text when the page loads
    captureOriginalText();

    // Add an event listener for the language dropdown (when the user selects a new language)
    $("#language").on("change", function () {
        const selectedLang = $(this).val(); // Get the selected language from the dropdown
        translatePage(selectedLang); // Call the translatePage function to update the text
    });
});
