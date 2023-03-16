'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Sajid Ali',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-02-27T14:43:26.374Z',
    '2023-03-04T18:49:59.371Z',
    '2023-03-05T12:01:20.894Z',
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
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2023-02-27T14:43:26.374Z',
    '2023-02-28T18:49:59.371Z',
    '2023-03-04T12:01:20.894Z',
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

/////// Functions
const formatMovementsDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(navigator.language).format(date);
  // else {
  //   const day1 = `${date.getDate()}`.padStart(2, 0);
  //   const month1 = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year1 = date.getFullYear();
  //   return `${day1}/${month1}/${year1}`;
  // }
};

const createUsername = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (object, sorted = false) {
  containerMovements.innerHTML = '';
  const movs = sorted
    ? object.movements.slice().sort((a, b) => a - b)
    : object.movements;
  //.textContent = 0;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(object.movementsDates[i]);
    const displayDates = formatMovementsDate(date);

    const formattedMov = formatCur(mov, object.locale, object.currency);

    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDates}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (object) {
  object.balance = object.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(
    object.balance,
    object.locale,
    object.currency
  );
};

// console.log(calcDisplayBalance(account1));

const eurTOUsd = 1.1;
const calcDisplaySummary = function (object) {
  const income = object.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(income, object.locale, object.currency);

  const out = object.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, object.locale, object.currency);

  const interest = object.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * currentAccount.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCur(
    interest,
    object.locale,
    object.currency
  );
};

const updateUI = function (object) {
  calcDisplaySummary(object);
  calcDisplayBalance(object);
  displayMovements(object);
};

const startLogOutTimer = function () {
  let time = 120;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login To Get Started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
////////////////////////Events

/// LogIn

let currentAccount, timer;

// Fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;
  }

  /////// creating date
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };
  const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = now.getHours();
  // const min = now.getMinutes();

  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

  /// Clearing the login field;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  //// LOGOUT TIMER
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  ///// updating the page;
  updateUI(currentAccount);
});

//// transfer Money:-

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount?.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    /////Implementing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    /// updating date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //// updating ui

    updateUI(currentAccount);

    /// Clearing the login field;
    inputTransferTo.value = inputTransferAmount.value = '';
    inputLoginPin.blur();
  }

  clearInterval(timer);
  timer = startLogOutTimer();
});

/// Requesting Loan;

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    ///add movements
    currentAccount.movements.push(amount);
  }
  /// loan date
  currentAccount.movementsDates.push(new Date().toISOString());

  ///update ui
  updateUI(currentAccount);
  clearInterval(timer);
  timer = startLogOutTimer();
});

//// closing account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //deleting account
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();

  labelWelcome.textContent = `Log in to get started`;
});

///// sorting the movements;

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

///////////////////////////////////////////////////
//////////////////////////////////////
///////////////////////// Lectures)))

/// setInterval

// setInterval(() => {
//   const now = new Date();
//   // const options = {
//   //   hour: 'numeric',
//   //   minute: 'numeric',
//   //   seconds: 'numeric',
//   // };
//   const hour = now.getHours();
//   const minute = now.getMinutes();
//   const seconds = now.getSeconds();
//   // const time = new Intl.DateTimeFormat('en-US', options).format(now);

//   console.log(`${hour}:${minute}:${seconds}`);
// }, 1000);
