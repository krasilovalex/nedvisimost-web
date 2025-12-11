export function navigateTo(url) {
    document.body.classList.remove('loaded');


    setTimeout(() => {
        window.location.href = url;
    }, 250);
}