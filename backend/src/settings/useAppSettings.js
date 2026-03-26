const useAppSettings = () => {
  let settings = {};
  settings['nexacrm_app_email'] = 'noreply@nexacrm.app';
  settings['nexacrm_base_url'] = 'http://localhost:3000';
  return settings;
};

module.exports = useAppSettings;
