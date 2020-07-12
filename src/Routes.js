import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  UniUserSms as UniUserSmsView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  GroupList,
  MemberList,
  MultiUserSms,
  GroupSMS,
  NotFound as NotFoundView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/dashboard" />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />

      <RouteWithLayout
        component={GroupList}
        exact
        layout={MainLayout}
        path="/sms-groups"
      />

      <RouteWithLayout
        component={UniUserSmsView}
        exact
        layout={MainLayout}
        path="/single-user-sms"
      />

      <RouteWithLayout
        component={MultiUserSms}
        exact
        layout={MainLayout}
        path="/multi-user-sms"
      />

      <RouteWithLayout
        component={GroupSMS}
        exact
        layout={MainLayout}
        path="/group-sms"
      />

      <RouteWithLayout
        component={MemberList}
        exact
        layout={MainLayout}
        path="/sms-group-members"
      />

      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
