export function timeoutLoop(millis: number, callback: () => void) {
    setTimeout(() => {
        callback()
        timeoutLoop(millis, callback)
    }, millis)
}
