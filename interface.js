onLoad();


/* event listener for blocking new sites */
document.getElementById('block-button').addEventListener('click', () => {
    addSiteToBlockList();
});

/* event listener for toggling blocking */
document.getElementById('toggle-button').addEventListener('click', () => {
    chrome.storage.sync.get("enabled", ({enabled}) => {
        if (enabled) {
            disable();
        } else {
            enable();
        }
    })
})

/* event listener for "ENTER" on url-input */
document.getElementById('url-input').addEventListener('keyup', (e) => {
  // Number 13 is the "Enter" key on the keyboard
    if (e.code === "Enter") {
        addSiteToBlockList();
    }
});

function addSiteToBlockList() {
    let newSite = document.getElementById('url-input').value;
    if (!newSite) return;
    chrome.storage.sync.get("sites", ({sites}) => {
            let allSites = JSON.parse(sites);
            allSites.push(newSite.toLowerCase());
            chrome.storage.sync.set({sites: JSON.stringify(allSites)}, () => {
                loadList();
                clearInput();
            });
        }
    )
}

function loadList() {
    /* Get sites and render as DOM elements */
    chrome.storage.sync.get("sites", ({sites}) => {
        document.getElementById('blocked-list').innerHTML = '';
        let allSites = JSON.parse(sites);
        allSites.forEach((site) => {
            let item = document.createElement('div');
            item.classList.add('blocked-item');
            let url = document.createElement('span');
            url.innerText = site;
            url.classList.add('blocked-url');
            item.appendChild(url);
            let removeButton = document.createElement('button');
            removeButton.innerText = "Remove";
            removeButton.addEventListener('click', () => {
                let newSites = allSites.filter((s) => s !== site);
                chrome.storage.sync.set({sites: JSON.stringify(newSites)}, () => {
                    loadList();
                });
            });
            removeButton.classList.add('remove-button');
            item.appendChild(removeButton);
            document.getElementById('blocked-list').appendChild(item);
        });
    })
}

function onLoad() {
    /* Check and pre-set sites default state if needed */
    chrome.storage.sync.get("sites", ({sites}) => {
        if (sites === undefined) {
            chrome.storage.sync.set({sites: "[]"}, () => {
                loadList();
            });
        } else {
            loadList();
        }
    });

    /* Get enabled status from chrome storage */
    chrome.storage.sync.get("enabled", ({enabled}) => {
        if (enabled === undefined || enabled) {
            enable();
        } else {
            disable();
        }
    })
}

function clearInput() {
    document.getElementById('url-input').value = "";
}

function enable() {
    chrome.storage.sync.set({enabled: true}, () => {
        let button = document.getElementById('toggle-button');
        button.innerHTML = "Enabled";
        button.classList.remove('toggle-button-off');
        button.classList.add('toggle-button-on');
    });
}

function disable() {
    chrome.storage.sync.set({enabled: false}, () => {
        let button = document.getElementById('toggle-button');
        button.innerHTML = "Disabled";
        button.classList.remove('toggle-button-on');
        button.classList.add('toggle-button-off');
    });
}