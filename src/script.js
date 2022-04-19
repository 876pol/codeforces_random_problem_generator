function createHTML(tag) {
    // Returns an html element given a problem tag.
    html = `
        <div class="roundbox item">
            <div class="roundbox-lt">&nbsp;</div>
            <div class="roundbox-rt">&nbsp;</div>
            <span data-name="` + tag.value + `" title="` + tag.title + `">
            <span>` + tag.value + `</span>
            <img src="/res/close-10x10.png" id="`+ tag.value + `">
            </span>
            <div class="roundbox-lb">&nbsp;</div>
            <div class="roundbox-rb">&nbsp;</div>
        </div>`;

    // Creates an element and adds the HTML to it.
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    return temp.content.firstChild;
}

// A list of tags that are currently selected.
const tags = [];

// Displays the tag selector after the user presses the "Add tag" button.
document.getElementById("addTag").onclick =
    () => {
        // Hides the "Add tag" button and displays the drop-down selector.
        document.getElementById("addTag").style.display = "none";
        document.getElementById("select").style.display = "block";
    };

// Displays tags after the user selects them.
document.getElementById("select").onchange =
    () => {
        // Gets the currently selected entry in the drop-down selector.
        const selected = document.getElementById("select");

        // Checks if the current tag is valid and isn't already selected, if not, return.
        if (!selected.value || tags.includes(selected.value)) return;

        // Adds the HTML element.
        const element = createHTML(selected);
        document.getElementById("box").insertAdjacentElement("beforeend", element);

        // Adds the selected tag into the list of tags.
        const value = selected.value;
        tags.push(value);

        // Removes the tag when the "x" button is pressed.
        document.getElementById(value).addEventListener("click",
            () => {
                // Removes tag from the list of tags.
                const index = tags.indexOf(value);
                if (index >= 0) tags.splice(index, 1);

                // Removes element from HTML.
                const box = document.getElementById("box");
                box.removeChild(element);
            }
        );
    };

// Opens a new page that contains a Codeforces problem based on the difficulty and tags chosen.
document.getElementById("submit").onclick =
    () => {
        // Pulls the minimum and maximum difficulty that the user chose.
        var min = document.getElementById("minDiff").value.trim();
        var max = document.getElementById("maxDiff").value.trim();

        // If the user left the fields blank, set the minimum and maximum to default values.
        min = (min == "") ? 0 : parseInt(min);
        max = (max == "") ? 10000 : parseInt(max);

        // If the user inputted non-numbers, throw an error.
        if (isNaN(min) || isNaN(max)) {
            alert("Problem ratings must be integers.");
            return;
        }

        // Creates a request to get a list of all Codeforces problems through the Codeforces API.
        var request = new XMLHttpRequest();
        request.onreadystatechange =
            () => {
                // Return if the request is invalid.
                if (request.readyState != 4 || request.status != 200) return;

                // Holds the list of problems.
                const problems = JSON.parse(request.responseText)["result"]["problems"];

                // Holds a list of problems fit the search criteria.
                const valid = problems.filter(problem => {
                    return min <= problem["rating"] && problem["rating"] <= max &&
                        !problem["tags"].includes("*special");
                })

                // Throws an error if there are no valid problems.
                if (valid.length == 0) {
                    alert("No problem found.");
                    return;
                }

                // Selects a random problem.
                const problem = valid[Math.floor(Math.random() * valid.length)];

                // Open the problem in another window.
                window.open("https://codeforces.com/problemset/problem/" + problem["contestId"] + "/" + problem["index"], "_blank");
            }
        request.open("GET", "https://codeforces.com/api/problemset.problems?tags=" + tags.join(";"));
        request.send(null);
    };