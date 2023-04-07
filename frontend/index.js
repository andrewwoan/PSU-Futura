import "./index.scss";
import { io } from "socket.io-client";
import Experience from "./Experience/Experience.js";
import elements from "./Experience/Utils/functions/elements.js";

// Dom Elements ----------------------------------

const domElements = elements({
    canvas: ".experience-canvas",
    chatContainer: ".chat-container",
    messageSubmitButton: "#chat-message-button",
    messageInput: "#chat-message-input",
    inputWrapper: ".message-input-wrapper",
    nameInputButton: "#name-input-button",
    nameInput: "#name-input",
});

// Frontend Server ----------------------------------

const socketUrl = new URL("/", window.location.href);
// console.log(socketUrl.toString());

// const socket = io(socketUrl.toString());
const chatSocket = io(socketUrl.toString() + "chat");
const updateSocket = io(socketUrl.toString() + "update");

// Experience ----------------------------------

const experience = new Experience(domElements.canvas, updateSocket);

// Sockets ----------------------------------

chatSocket.on("connect", () => {
    // console.log("Connected to server with ID" + chatSocket.id);
});

domElements.messageSubmitButton.addEventListener("click", handleMessageSubmit);
domElements.nameInputButton.addEventListener("click", handleNameSubmit);
document.addEventListener("keydown", handleMessageSubmit);

function handleNameSubmit() {
    // console.log("clicked");
    chatSocket.emit("setName", domElements.nameInput.value);
    updateSocket.emit("setName", domElements.nameInput.value);
}

function handleMessageSubmit(event) {
    if (event.type === "click" || event.key === "Enter") {
        domElements.inputWrapper.classList.toggle("hidden");
        domElements.messageInput.focus();

        if (domElements.messageInput.value === "") return;
        displayMessage(domElements.messageInput.value, getTime());
        chatSocket.emit(
            "send-message",
            domElements.messageInput.value,
            getTime()
        );
        domElements.messageInput.value = "";
    }
}

function getTime() {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;
    return time;
}

function displayMessage(message, time) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `[${time}]: ${message}`;
    domElements.chatContainer.append(messageDiv);
    domElements.chatContainer.scrollTop =
        domElements.chatContainer.scrollHeight;
}

// Get data from server ----------------------------------

chatSocket.on("recieved-message", (message, time) => {
    displayMessage(message, time);
});

// Update Socket ----------------------------------------------------
updateSocket.on("connect", () => {
    // console.log("Joined Update" + updateSocket.id);
});
