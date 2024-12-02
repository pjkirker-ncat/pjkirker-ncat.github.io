document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".gallery img");
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    document.body.appendChild(lightbox);

    images.forEach(image => {
        image.addEventListener("click", () => {
            lightbox.classList.add("active");
            const img = document.createElement("img");
            img.src = image.src;
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            lightbox.appendChild(img);
        });
    });

    lightbox.addEventListener("click", () => {
        lightbox.classList.remove("active");
    });
});
$(document).ready(function () {
    $("#date").datepicker({
        dateFormat: "mm/dd/yy",
        minDate: 0,          
        maxDate: "+1Y"          
    });
});
$(document).ready(function () {
    $("#services-accordion").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content"
    });
});
$(document).ready(function () {
    $("nav ul li a").hover(
        function () {
            $(this).css({
                "color": "#ff6600",
                "text-decoration": "underline"
            });
        },
        function () {
            $(this).css({
                "color": "white",
                "text-decoration": "none"
            });
        }
    );
});
$(document).ready(function () {
    // Function to capture original text and store it in `data-original` attributes
    function captureOriginalText() {
        $("*").contents().each(function () {
            if (this.nodeType === Node.TEXT_NODE && $.trim(this.nodeValue) !== "") {
                const parent = $(this).parent();
                // Add a `data-original` attribute to the parent if not already set
                if (!parent.attr("data-original")) {
                    parent.attr("data-original", parent.text().trim());
                }
            }
        });
    }

    // Function to restore all original text from `data-original` attributes
    function restoreOriginalText() {
        $("[data-original]").each(function () {
            const originalText = $(this).attr("data-original");
            $(this).text(originalText); // Restore original text
        });
    }

    // Function to translate all visible text nodes
    function translatePage(language) {
        if (language === "en") {
            // Restore the original English text
            restoreOriginalText();
        } else {
            // Translate visible text nodes
            $("[data-original]").each(function () {
                const originalText = $(this).attr("data-original");
                const element = $(this);

                // Send text to the MyMemory API for translation
                $.ajax({
                    url: "https://api.mymemory.translated.net/get",
                    method: "GET",
                    data: {
                        q: originalText,
                        langpair: `en|${language}`
                    },
                    success: function (response) {
                        const translatedText = response.responseData.translatedText;
                        element.text(translatedText); // Update text with translation
                    },
                    error: function () {
                        console.error("Translation failed for:", originalText);
                    }
                });
            });
        }
    }

    // Capture original text on page load
    captureOriginalText();

    // Event listener for language selection
    $("#language").on("change", function () {
        const selectedLang = $(this).val(); // Get the selected language
        translatePage(selectedLang); // Translate or restore text
    });
});
