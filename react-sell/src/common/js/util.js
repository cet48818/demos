  export function px2rem (length) {
    return length / 37.5 + 'rem';
  }
  export function setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  export function formTimeString(timeString) {
    let formDate = new Date(timeString);
    return `${formDate.getFullYear()}-${addZero(formDate.getMonth())}-${formDate.getDate()}`;
  }

  function addZero(month) {
    return month >= 10 ? month: '0' + month;
  }