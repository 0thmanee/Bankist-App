'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-09-18T21:31:17.178Z',
    '2021-09-23T07:42:02.383Z',
    '2022-06-28T09:15:04.904Z',
    '2022-09-01T10:17:24.185Z',
    '2022-08-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-10-03T23:36:17.929Z',
    '2022-10-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-10-01T13:15:33.035Z',
    '2021-10-01T09:48:16.867Z',
    '2021-09-25T06:04:23.907Z',
    '2021-09-25T14:18:46.235Z',
    '2022-10-05T16:33:06.386Z',
    '2022-07-10T14:43:26.374Z',
    '2020-08-25T18:49:59.371Z',
    '2022-09-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
// Days ago
const daysAgo = function (date, local) {
  const days = Math.floor((new Date() - date) / 1000 / 60 / 60 / 24);
  if (days === 0) {
    return `Today`;
  } else if (days === 1) {
    return `Yesterday`;
  } else if (days <= 7) {
    return `${days} days ago`;
  } else return new Intl.DateTimeFormat(local).format(date);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const displayDate = daysAgo(
      new Date(acc.movementsDates[i]),
      navigator.language
    );

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    mov = new Intl.NumberFormat(acc.local, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(acc.local, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${new Intl.NumberFormat(acc.local, {
    style: 'currency',
    currency: acc.currency,
  }).format(incomes)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${new Intl.NumberFormat(acc.local, {
    style: 'currency',
    currency: acc.currency,
  }).format(Math.abs(out))}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${new Intl.NumberFormat(acc.local, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE LOGING
//currentAccount = account1;
//updateUI(currentAccount);
//containerApp.style.opacity = 10;

const startTimerLogout = function () {
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  // SET TIME TO THE APP

  const now = new Date();
  /*labelDate.textContent = `${`${now.getDate()}`.padStart(2, 0)}/${`${
    now.getMonth() + 1
  }`.padStart(2, 0)}/${now.getFullYear()}, ${`${now.getHours()}`.padStart(
    2,
    0
  )}:${`${now.getMinutes()}`.padStart(2, 0)}`;*/

  // DATE API
  const date = new Date();
  const local = navigator.language;
  const option = {
    hour: 'numeric', //  numeric
    minute: 'numeric', //  numeric
    year: '2-digit', //  numeric
    month: 'numeric', //  numeric
    day: 'numeric',
    weekday: 'short', // long - 2digit
  };
  labelDate.textContent = new Intl.DateTimeFormat('local', option).format(date);

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startTimerLogout();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
    timer = startTimerLogout();
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // add mvt date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    setTimeout(() => {
      updateUI(currentAccount);
    }, 2000);
  }
  inputLoanAmount.value = '';
  // reset timer
  clearInterval(timer);
  timer = startTimerLogout();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(+'23');
console.log(Number.parseInt('    120px  '));
console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));

console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN(+'20X')); // true

// inFinite() is better than isNaN()

console.log(Number.isFinite(Number.parseInt('200px')));
console.log(Number.isFinite(19 / 0));

console.log(Number.isInteger(20));

// math functions

console.log(25 ** (1 / 2));
console.log(Math.sqrt(25));
console.log(8 ** (1 / 3));

console.log(Math.max(1, 2, 3, 4, '5', 6));
console.log(Math.max(1, 2, 3, 4, '5rem', 6));
console.log(Math.min(1, 2, 3, 4, '5', 6));

console.log(Math.PI * Number.parseInt('10px'));

// function that gives us a random number between a min and a max

const randInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min;
// 0 ...... max - min
// => 0 + min .... max - min + min => min .... max
console.log(randInt(2, 10));

// rounding integers

console.log(Math.round(19.2));
console.log(Math.round(19.5));
// if decimal < 5 it gives small vs if decimal >=5

console.log(Math.ceil(19.2));
console.log(Math.ceil(19.6));

console.log(Math.floor(19.2));
console.log(Math.floor(-19.2));
console.log(Math.trunc(-19.2));

// floor gives us the small number vs trunc just remove decimal part
// rounding floats

console.log(+(19.2).toFixed(0));
// works with strings
console.log((19.12312234).toFixed(3));


const aDIVb = (a, b) => a % b === 0;

console.log(aDIVb(8, 16));

console.log(Number.MAX_SAFE_INTEGER); // 2 ** 53 - 1

// BIGINT TYPE

console.log(1274523714284906291512695065n);
console.log(BigInt(47618451));

// we can't do operations between regular and bigint numbers except comparaison or (==): type coersion

//console.log(1944n + 12); will give us an error

console.log(742349n < 12); // not the same type so : false
console.log(123n === 123); // false
console.log(123n == 123); // true
*/
// DATES
/*
const now = new Date();
console.log(now);
console.log(new Date(0)); // first date in linux
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // first + 3 days
console.log(new Date('21 july 2003'));
console.log(new Date('28 febray 2004'));

console.log(new Date(2021, 3, 31, 12, 30));
*/

// working with dates
/*
const date = new Date(2037, 6, 21, 12, 30);
console.log(date.getFullYear());
console.log(date.getMonth());
console.log(date.getDay());
console.log(date.getHours());
console.log(date.getMinutes());
console.log(date.getSeconds());

console.log(date.getTime());
console.log(new Date(date.getTime()));
console.log(new Date(Date.now()));

console.log(new Date(date.setFullYear(2040)));
// setday / setHours / .... change one element

const calcAge = (birthDate, nowDate) =>
  Math.abs(nowDate - birthDate) / 1000 / 60 / 60 / 24 / 365;

console.log(calcAge(new Date(2003, 7, 21), new Date(Date.now())));


// Intl numbers
const num = 1234567.89;
const options = {
  style: 'currency', // unit / percent / currency
  unit: 'celsius',
  currency: 'MAD',
  useGrouping: false, // default is true
};
console.log(new Intl.NumberFormat(navigator.language, options).format(num));
*/
const orders = ['BigMac', 'BigTasty'];
const orderTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your order with ${ing1} and ${ing2}..`),
  2000,
  ...orders
);
console.log(`waiting...`);
// this line is executed before the last one, that's called asynchronous JS

if (orders.includes('BigMac')) clearTimeout(orderTimer); // that's how we clear a timer

for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    //console.log(i);
  }, 3000);
}
const option2 = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};
/*setInterval(
  () =>
    console.log(
      new Intl.DateTimeFormat(navigator.language, option2).format(new Date())
    ),
  1000
);*/
