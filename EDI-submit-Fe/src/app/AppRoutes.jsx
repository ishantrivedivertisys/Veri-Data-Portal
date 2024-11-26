/*React Libraries */
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

/*Custom Components, Styles and Icons */
import { AppRoute } from "./AppRoute";
import AuthorizedRoute from "./AuthorizedRoute";
import ImportSettings from "../components/ImportSettings";
import ImportHistory from "../components/ImportHistory";
import UploadPreview from "../components/UploadPreview";
import LoginPage from "../components/Login";
import CurrencyRate from "../components/CurrencyRate";
import MismatchedColumnAlias from "../components/MismatchedColumnAlias";
import ColumnAliases from "../components/ColumnAliases";
import ProcessingNotes from "../components/ProcessingNotes";
import HelpSection from "../components/HelpSection";

const getAuthRoute = (content) => <AuthorizedRoute>{content}</AuthorizedRoute>;

const AppRoutes = () => (
  <Suspense fallback={<>Loading...</>}>
    <Routes>
      <Route
        path={AppRoute.importHistory}
        element={getAuthRoute(<ImportHistory />)}
      />
      <Route
        path={AppRoute.importPreview}
        element={getAuthRoute(<UploadPreview />)}
      />
      <Route
        path={AppRoute.importSettings}
        element={getAuthRoute(<ImportSettings />)}
      />
      <Route
        path={AppRoute.currencyRate}
        element={getAuthRoute(<CurrencyRate />)}
      />
      <Route
        path={AppRoute.mismatchedColumns}
        element={getAuthRoute(<MismatchedColumnAlias />)}
      />
      <Route path={AppRoute.alias} element={getAuthRoute(<ColumnAliases />)} />
      <Route
        path={AppRoute.processingNotes}
        element={getAuthRoute(<ProcessingNotes />)}
      />
      <Route path={AppRoute.help} element={getAuthRoute(<HelpSection />)} />
      <Route path={AppRoute.home} element={<LoginPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
