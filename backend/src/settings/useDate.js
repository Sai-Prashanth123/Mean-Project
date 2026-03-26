const useDate = ({ settings }) => {
  const { nexacrm_app_date_format } = settings;

  const dateFormat = nexacrm_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;
