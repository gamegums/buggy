function userSelection() {
    var userSelector = document.getElementById(`userSelector`);
    if (userSelector.classList.contains(`is-active`)) {
        userSelector.classList.remove("is-active");
    } else {
        userSelector.classList.add("is-active");
    }
}