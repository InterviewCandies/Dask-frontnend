export const formatDate = (date: Date) => {
  return new Date(date).toJSON().slice(0, 10).split("-").reverse().join("/");
};
