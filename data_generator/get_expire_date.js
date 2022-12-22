export const get_expire_date = () => {
  const yy = new Date().getFullYear() - 2;
  let exp_dd;

  const get_rand = (length, max, min = 0) => {
    exp_dd = Math.floor(Math.random() * 100);
    if (exp_dd > min && exp_dd < max) {
      if (exp_dd < 10) {
        exp_dd = "0"+ exp_dd;
      }
      return exp_dd;
    } else {
      return get_rand(length,max, min);
    }
  }

  const mm = get_rand(2,12,0)
  const dd = get_rand(2,28,0)


  return {
    dd,
    mm,
    yy
  }
}