chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

   chrome.storage.sync.get("enabled", ({enabled}) => {
      if (enabled && changeInfo.url) {
         chrome.storage.sync.get("sites", ({sites}) => {
            let bannedSites = JSON.parse(sites);
            const siteIsBanned = bannedSites.some((site) => {
               return changeInfo.url.includes(site);
            })
            if (siteIsBanned) {
               chrome.tabs.update(tabId, {url: 'blocked.html'});
            }
         })
      }
   })
})
