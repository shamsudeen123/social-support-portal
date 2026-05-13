import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getTheme from './theme';
import Header from './components/common/Header';
import ApplicationPage from './pages/ApplicationPage';
import './i18n';

const cacheLtr = createCache({ key: 'mui' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const App = () => {
  const { themeMode, language } = useSelector((s) => s.ui);
  const { i18n } = useTranslation();
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  React.useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    i18n.changeLanguage(language);
  }, [language, direction, i18n]);

  const theme = useMemo(() => getTheme(themeMode, direction), [themeMode, direction]);

  return (
    <CacheProvider value={direction === 'rtl' ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div dir={direction}>
            <Header />
            <Routes>
              <Route path="/" element={<ApplicationPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
