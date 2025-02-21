import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//ccBgColor01.setAttribute("fill", "#0025CE");
//ccBgColor02.setAttribute("fill", "#8000CE");

function setCardType(type) {
    const colors = {
        visa: ["#5CCEFF", "#8000CE"],
        mastercard: ["#07051B", "#5E38F5"],
        americanexpress: ["#2AE8C6", "#FF3988"],
        default: ["black", "gray"]
    }

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);

    ccLogo.setAttribute("src", `cc-${type}.svg`)
}
//setCardType("default");
globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
    mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
            
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        }
    }
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number"); 
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 000000 00000",
      regex: /^3[47]\d{0,13}/,
      cardtype: "americanexpress",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask.cardtype)
    setCardType(foundMask.cardtype)
    return foundMask
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector("#btn-add-card");
addButton.addEventListener("click", () => {
    alert("Cartão Adicionado!");
})

document.querySelector("form").addEventListener("submit",(event) => {
    event.preventDefault();
})

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value");

    ccHolder.innerText =
      cardHolder.value.length === 0 ? "Ingrid Santos" : cardHolder.value
}) 

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value");

    ccSecurity.innerText = code.length === 0 ? "123" : code;
}

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType()
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number");
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value);
})

function updateExpirationDate(date) {
    const ccExpiration = document.querySelector(".cc-extra .value");
    ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}

