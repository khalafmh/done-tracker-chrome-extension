import Tab = chrome.tabs.Tab;
import {Constants} from "./constants";
import {DoneItemsType} from "./types/DoneItemsType";
import path from "path-browserify";

export function timeoutLoop(millis: number, callback: () => void) {
    setTimeout(() => {
        callback()
        timeoutLoop(millis, callback)
    }, millis)
}

export async function getDoneItems(): Promise<DoneItemsType | undefined> {
    return (await chrome.storage.local.get(Constants.DONE_ITEMS_STORAGE_KEY))[Constants.DONE_ITEMS_STORAGE_KEY]
}

export async function setDoneItems(newItems: DoneItemsType) {
    await chrome.storage.local.set({[Constants.DONE_ITEMS_STORAGE_KEY]: newItems})
}

export async function updateActionIcon(tab: Tab) {
    if (!tab.active) return
    const url = tab.url
    const completedUrls = await getDoneItems()
    if (url != null && !isBlank(url) && completedUrls?.some(item => urlEquals(url, item))) {
        await chrome.action.setIcon(Constants.CHECKED_ICON)
    } else {
        await chrome.action.setIcon(Constants.UNCHECKED_ICON)
    }
}

export function normalizeUrl(url: string): string {
    const t = new URL(url)
    t.pathname = path.format(path.parse(t.pathname))
    return t.toString()
}

export function urlEquals(a: string, b: string): boolean {
    return normalizeUrl(a) === normalizeUrl(b)
}

export function isBlank(s: string) {
    return /^\s*$/.test(s)
}
