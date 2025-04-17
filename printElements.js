async function printElements(options) {
  let outprint = document.createElement("div");
  outprint.setAttribute("class", "outprint");
  document.querySelector("body").append(outprint);

  const targets = options.targets;
  const tags = options.tags.toString();
  const willNotPrint = options.willNotPrint.replace(".", "");
  const baseImg = options.baseImg || "/assets/";
  const excludeUrl = options.excludeUrl || [""]; 
  let promises = [];
  let html = [];

   for (const target of targets) {
    const response = await fetch(target);
    const string = await response.text();
    html.push(new DOMParser().parseFromString(string, "text/html"));
  }

  const getBaseUrl = () => {
    let url = window.location.href;

    excludeUrl.forEach(excludeUrl => {
      if (url.includes(excludeUrl)) {
        url = url.replace(excludeUrl, "");
      }
    })

    // Extracts the directory path where the website is hosted
    let path = url.substring(0, url.lastIndexOf("/"));
    return path + "/"; // Return the base URL
  };

  Promise.all(promises)
    .then(() => {
      let elem = [];
      html.forEach((page) => {
        page
          .querySelector("main")
          .querySelectorAll(tags)
          .forEach((item) => {
            // Creates a copy of all relevant elements
            elem.push(item.cloneNode(true));
          });

        // Removes the included tags that contain the class that excludes from printing (defined in JSON and assigned in variable willNotPrint).
        elem = elem.filter((item) => !item.classList.contains(willNotPrint));

        // Rebuilds the URLs of images with the 'print' class using the current URL and the root folder where they are stored.
        elem.forEach((item) => {
          if (
            item.tagName.toLowerCase() === "img" &&
            item.classList.contains("print")
          ) {
            let img = item;
            let baseUrl = getBaseUrl().replace(/\/$/, "");
            let imagePath = img.src;
            let mediaPath = imagePath.split(baseImg).pop();

            img.src = baseUrl + baseImg + mediaPath;
          }
        });

        // Append the new nodes to outprint
        elem.forEach((item) => {
          document.querySelector(".outprint").append(item);
        });
      });
    })
    .then(() => {
      setTimeout(() => {
        // Opens the print window to print the current document.
        window.print(document.querySelector(".outprint"));
      }, 125);
    })
    .then(() => {
      // Removes and erases the data inside the current outprint.
      setTimeout(() => {
        outprint.remove();
        outprint.innerHTML = "";
      }, 250);
    });
}
