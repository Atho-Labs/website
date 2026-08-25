const dialog = document.querySelector("[data-explorer-dialog]");
const continueButton = document.querySelector("[data-explorer-continue]");
const searchForm = document.querySelector("[data-explorer-search]");
const searchMessage = document.querySelector("[data-explorer-message]");
const noticeKey = "atho-explorer-offline-notice";

function showOfflineNotice() {
  if (!(dialog instanceof HTMLDialogElement)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const forceNotice = params.has("notice");
  const suppressNotice = params.has("capture");

  if (suppressNotice || (!forceNotice && sessionStorage.getItem(noticeKey))) {
    return;
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeOfflineNotice() {
  sessionStorage.setItem(noticeKey, "seen");
  if (!(dialog instanceof HTMLDialogElement)) {
    return;
  }
  if (dialog.open && typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

continueButton?.addEventListener("click", closeOfflineNotice);

dialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeOfflineNotice();
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeOfflineNotice();
  }
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (searchMessage instanceof HTMLElement) {
    searchMessage.textContent = "Search is paused until a compatible public Atho endpoint is online.";
    searchMessage.classList.add("is-active");
  }
});

showOfflineNotice();
