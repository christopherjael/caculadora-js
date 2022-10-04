const $numbers = document.getElementsByClassName('numbers');
const $operations = document.getElementsByClassName('operations');
const $mathOperations = document.getElementsByClassName('mathOperations');
const $display = document.getElementById('display');
const $lastOp = document.getElementById('lastop');
const $history = document.getElementById('history-content');

const localStorageHandler = (operation, result) => {
  if (localStorage.getItem('histories') == null) {
    localStorage.setItem('histories', JSON.stringify({ histories: [] }));
  }
  const histories = JSON.parse(localStorage.getItem('histories'));
  console.log(histories);

  histories.histories.push({
    operation,
    result,
  });

  localStorage.setItem('histories', JSON.stringify(histories));
};

const getHistories = () => {
  const histories = JSON.parse(localStorage.getItem('histories'));
  histories.histories.map((element) => {
    $history.innerHTML += `
    <div class="item">
      <p class="operation">${element.operation}</p>
      <p class="result">=${element.result}</p>
    </div>
    `;
  });
};

const hiddenHistory = () => {
  $history.style.display = 'none';
};

const showHistory = () => {
  $history.innerHTML = `<i class="bi bi-x" onclick="hiddenHistory()"></i>`;
  getHistories();
  $history.style.display = 'block';
  const $items = document.querySelectorAll('#history-content .item');
  $items.forEach((item) => {
    item.addEventListener('click', (e) => {
      $lastOp.value = e.currentTarget
        .getElementsByClassName('operation')[0]
        .textContent.toString()
        .replace('=', '');
      $display.value = e.currentTarget
        .getElementsByClassName('result')[0]
        .textContent.toString()
        .replace('=', '');
      hiddenHistory();
    });
  });
};

const addKeytoDisplay = (key) => {
  // if the first key entered on the screen is a (.) then before you added the number 0
  if (key === '.' && $display.value.toString().length <= 0) {
    $display.value = '0.';
    return;
  }

  if (key === '.' && $display.value.toString().includes('.')) return;
  $display.value += key;
};

const del = () => {
  $display.value = $display.value.toString().slice(0, -1);
};

const clear = () => {
  $display.value = '';
  $lastOp.value = '';
};

const calculate = () => {
  $lastOp.value = $display.value;
  const current = $display.value;
  const result = eval(current);
  $display.value = result;
  localStorageHandler($lastOp.value, result);
};

Array.prototype.forEach.call($numbers, (element) => {
  element.addEventListener('click', (e) => {
    let key = e.target.dataset.number.toString();
    addKeytoDisplay(key);
  });
});

Array.prototype.forEach.call($operations, (element) => {
  element.addEventListener('click', (e) => {
    let dataset = e.target.dataset;
    if (dataset.op === 'AC') {
      clear();
    } else if (dataset.op === 'DEL') {
      del();
    }
  });
});

Array.prototype.forEach.call($mathOperations, (element) => {
  element.addEventListener('click', (e) => {
    let mathop = e.target.textContent;
    if (mathop === '=') {
      calculate();
      return;
    }
    addKeytoDisplay(mathop);
  });
});
