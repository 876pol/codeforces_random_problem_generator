const items = [];

function showTags() {
    document.getElementById("addTag").onclick =
        function () {
            document.getElementById("addTag").style.display = "none";
            document.getElementById("select").style.display = "block";
        };
}

function HTMLToElement(html) {
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    return temp.content.firstChild;
}

function createHTML(element) {
    return `
        <div class="roundbox item">
            <div class="roundbox-lt">&nbsp;</div>
            <div class="roundbox-rt">&nbsp;</div>
            <span data-name="` + element.value + `" title="` + element.title + `">
            <span>` + element.value + `</span>
            <img src="/res/close-10x10.png" id="`+ element.value + `">
            </span>
            <div class="roundbox-lb">&nbsp;</div>
            <div class="roundbox-rb">&nbsp;</div>
        </div>`;
}

function select() {
    document.getElementById("select").onchange =
        function () {
            const selected = document.getElementById("select");
            if (selected.value && !items.includes(selected.value)) {
                const element = HTMLToElement(createHTML(selected));
                const value = selected.value;
                items.push(value);
                document.getElementById("box").insertAdjacentElement("beforeend", element);
                document.getElementById(value).addEventListener("click",
                    function removeItem() {
                        const index = items.indexOf(value);
                        const box = document.getElementById("box");
                        if (index >= 0) items.splice(index, 1);
                        box.removeChild(element);
                    }
                );
            }
        };
}

function submit() {
    document.getElementById("submit").onclick =
        function () {
            var min = document.getElementById("minDiff").value;
            var max = document.getElementById("maxDiff").value;
            if (min == "") min = 0;
            if (max == "") max = 10000;
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    const problems = JSON.parse(request.responseText)["result"]["problems"];
                    const inRange = [];
                    for (let i = 0, t = Object.keys(problems).length; i < t; i++) {
                        if (min <= problems[i]["rating"] && problems[i]["rating"] <= max && !problems[i]["tags"].includes("*special")) {
                            inRange.push(i);
                        }
                    }
                    if (inRange.length == 0) {
                        alert("No problem found");
                        return;
                    }
                    const problem = problems[inRange[Math.floor(Math.random() * inRange.length)]];
                    window.open("https://codeforces.com/problemset/problem/" + problem["contestId"] + "/" + problem["index"], "_blank");
                }
            }
            request.open("GET", "https://codeforces.com/api/problemset.problems?tags=" + items.join(";"));
            request.send(null);
        };
}

showTags();
select();
submit();