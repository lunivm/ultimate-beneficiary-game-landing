const selectors = Object.freeze({
  card: '#services .service-card:not([data-buy-handler-skip])',
  buyButton: 'button.game-button',
  buyOption: {
    container: '.service-option[data-buy-handler-item]',
    name: '.service-option-name',
    checked: 'input:checked'
  }
});

function getOption(container) {
  return {
    name: container.querySelector(selectors.buyOption.name)?.childNodes[0]?.textContent?.trim(),
    value: container.dataset.buyHandlerItem,
    checked: container.querySelector(selectors.buyOption.checked),
  }
}

function getOptions(parent) {
  const containers = parent.querySelectorAll(selectors.buyOption.container);
  return Array.from(containers).map(getOption);
}

function getAlertMessage(buyItems) {
  const buyItemSelected = buyItems.some(i => i.checked);

  return buyItemSelected ? null : buyItems.map(i => i.name).join('\n');
}

function toggleDisabled(button, disabled) {
  button.disabled = disabled;
  button.classList.toggle('disabled', disabled);
}

function buyTelegramBotMessage(items, additionalPayload) {
  const buyItemsPayloads = new Map([
    [  'game-v1', 'Гра v1' ],
    [  'game-v4.5.0', 'Гра v4.5.0' ],
    [  'participation-offline-game', 'Грати оффлайн' ],
    [  'participation-online-game', 'Грати онлайн' ],
  ]);

  console.warn('!!!!!!!!!!!!!! implement buyTelegramBotMessage logic, params: --------------');
  console.log("=>(buy.js:36) additionalPayload", additionalPayload);
  console.log("=>(buy.js:36) items", items);
}

function buyRedirect(items) {
  const url = 'https://www.beneficiary.com.ua/multi-cart';
  const buyItemsUrl = new Map([
    [  'game-v1', '748' ],
    [  'game-v4.5.0', '1198' ],
  ]);
  const params = items.map(i => buyItemsUrl.get(i.value)).join(',');

  window.location.href = `${url}?multi-add-to-cart=${params}`;
}

async function buyAction(button, buyItems) {
  toggleDisabled(button, true);


  setTimeout(async () => {
    try {
      switch (button.dataset.buyHandlerAction) {
        case 'buy-redirect':
          await buyRedirect(buyItems);
          break;
        case 'telegram-bot-message':
          await buyTelegramBotMessage(buyItems, button.dataset.buyHandlerAdditionalPayload);
          break;
        default:
          console.error('No [data-buy-handler-action] found on a button');
      }
    } catch(err) {
      alert('Щось пішло не так, спробуйте ще раз');
    } finally {
      toggleDisabled(button, false);
    }
  }, 500); // show spinner at least for 0.5s
}

function clickHandler(card) {
  card.querySelector(selectors.buyButton)?.addEventListener('click', function () {
    const buyItems = getOptions(card);
    const alertMessage = getAlertMessage(buyItems);

    if (alertMessage){
      this.blur();
      alert(`Оберіть хоча б один елемент зі списку:\n${alertMessage}`);
    } else {
      buyAction(this, buyItems.filter(i => i.checked));
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(selectors.card);

  cards.forEach(clickHandler);
});