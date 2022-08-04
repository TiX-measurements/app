export const getTimestamp = () => {
    return Math.round(new Date().getTime() / 1000);
}

export const getTimestampInNanos = () => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const now = new Date().getTime();

    return millisecondsToNano(now - startOfDay.getTime());
}

const millisecondsToNano = (input: number) => {
    return input * 1000000;
}