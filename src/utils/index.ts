export const getScript = (url)=> {
    return new Promise(function(resolve, reject)
    {
        const newScript = document.createElement("script");
        newScript.onerror = reject;
        newScript.onload = resolve;
        newScript.src = url;
        document.getElementsByTagName('head')[0].appendChild(newScript);
    });
}

export const secondsToTime = (s) => {
    const pad = value => `0${value}`.slice(-2);
    const getHours = value => Math.trunc((value / 60 / 60) % 60);
    const getMinutes = value => Math.trunc((value / 60) % 60);
    const getSeconds = value => Math.trunc(value % 60);
    const timeHour = s > 86400 ? pad(getHours(s)) + ':' : '';
    return timeHour + pad(getMinutes(s)) + ':' + pad(getSeconds(s));
}