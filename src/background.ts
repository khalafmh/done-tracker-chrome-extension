import "chrome-types/index.d.ts"
import {getDoneItems, isBlank, normalizeUrl, setDoneItems, updateActionIcon, urlEquals} from "./utils";
import {DoneItemsType} from "./types/DoneItemsType";

chrome.action.onClicked.addListener(async (tab) => {
    const url = tab.url;
    if (url == null || isBlank(url)) return
    const doneItemsBefore = await getDoneItems()
    const doneItemsAfter: DoneItemsType =
        doneItemsBefore == null
            ? [normalizeUrl(url)]
            : doneItemsBefore.some(item => urlEquals(url, item))
                ? [...doneItemsBefore.filter(item => !urlEquals(url, item))]
                : doneItemsBefore.concat([normalizeUrl(url)])
    await setDoneItems(doneItemsAfter)
    await updateActionIcon(tab)
})

chrome.tabs.onActivated.addListener(async ({tabId}) => {
    const tab = await chrome.tabs.get(tabId)
    await updateActionIcon(tab)
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    await updateActionIcon(tab)
})
