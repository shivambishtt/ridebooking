const validNumberPlate = (plate: string) => {
  const valid = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
  return valid.test(plate);
};

export default validNumberPlate;
